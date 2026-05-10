import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-auth";
import { Application, Lead, User } from "@/models/CoreModels";
import { Payment } from "@/models/AnalyticsModels";
import {
  generateAdminInsights,
  type AdminInsightResponse,
  type AdminInsightSnapshot,
} from "@/lib/ai/gemini";

export const dynamic = "force-dynamic";

type AggregateCount = { _id: string | null; count: number };
type PaymentAggregate = { _id: string | null; count: number; revenue: number };
type ItemRevenueAggregate = { _id: string | null; count: number; revenue: number };
type EmployeeAggregate = { _id: string | null; leads: number; conversions: number };

function fallbackInsights(snapshot: AdminInsightSnapshot): AdminInsightResponse {
  const conversionRate = snapshot.totals.leads
    ? ((snapshot.totals.successfulPayments / snapshot.totals.leads) * 100).toFixed(1)
    : "0.0";
  const pendingLeadCount = snapshot.leadStatuses.find((item) => item.status === "Payment Pending")?.count || 0;
  const failedPayments = snapshot.paymentStatuses.find((item) => item.status === "Failed")?.count || 0;

  return {
    summary: `The admin system has ${snapshot.totals.leads} leads, ${snapshot.totals.applications} applications, and ${snapshot.totals.successfulPayments} successful payments. Current lead-to-payment conversion is approximately ${conversionRate}%.`,
    opportunities: [
      "Prioritize same-day follow-up for new and payment-pending leads.",
      "Use recent successful payment patterns to identify high-intent sources.",
      "Assign unowned leads to the best-performing employee before the next campaign push.",
    ],
    risks: [
      pendingLeadCount > 0
        ? `${pendingLeadCount} leads are stuck at payment pending and may churn without follow-up.`
        : "Payment-pending lead volume is currently low.",
      failedPayments > 0
        ? `${failedPayments} failed payments need support review.`
        : "No failed payment spike is visible in the current snapshot.",
      "Lead source quality should be reviewed weekly so ad spend does not drift into low-converting channels.",
    ],
    recommendedActions: [
      "Call all payment-pending leads within the next business hour.",
      "Export the successful payments list and reconcile it with Razorpay webhook status.",
      "Review unassigned leads and distribute them by employee conversion capacity.",
      "Send a WhatsApp recovery message to every failed-payment user.",
      "Compare the top lead source with conversion outcomes before increasing spend.",
    ],
    leadSegments: snapshot.leadStatuses.map((item) => ({
      label: item.status || "Unknown",
      count: item.count,
      action: item.status === "Payment Pending"
        ? "Send payment recovery sequence"
        : item.status === "New Lead"
          ? "Assign counselor and call today"
          : "Review for next lifecycle action",
    })),
    revenueForecast: {
      next30Days: `INR ${Math.round(Math.max(snapshot.totals.revenue, snapshot.totals.successfulPayments * 1999)).toLocaleString("en-IN")}`,
      confidence: snapshot.totals.successfulPayments > 10 ? "Medium" : "Low",
      reasoning: "Fallback estimate based on current successful payment volume and recorded revenue.",
    },
  };
}

export async function POST() {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    await dbConnect();

    const [
      totalUsers,
      totalLeads,
      totalApplications,
      successfulPayments,
      revenueData,
      leadStatusData,
      paymentStatusData,
      revenueByItemTypeData,
      recentLeadDocs,
      recentPaymentDocs,
      employeeData,
    ] = await Promise.all([
      User.countDocuments(),
      Lead.countDocuments(),
      Application.countDocuments(),
      Payment.countDocuments({ status: "Successful" }),
      Payment.aggregate<{ _id: null; total: number }>([
        { $match: { status: "Successful" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Lead.aggregate<AggregateCount>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Payment.aggregate<PaymentAggregate>([
        { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
        { $sort: { count: -1 } },
      ]),
      Payment.aggregate<ItemRevenueAggregate>([
        { $match: { status: "Successful" } },
        { $group: { _id: "$itemType", count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
        { $sort: { revenue: -1 } },
      ]),
      Lead.find().sort({ createdAt: -1 }).limit(10).lean(),
      Payment.find().sort({ createdAt: -1 }).limit(10).lean(),
      Lead.aggregate<EmployeeAggregate>([
        {
          $group: {
            _id: { $ifNull: ["$assignedTo", "Unassigned"] },
            leads: { $sum: 1 },
            conversions: {
              $sum: {
                $cond: [{ $in: ["$status", ["Payment Success", "Enrolled"]] }, 1, 0],
              },
            },
          },
        },
        { $sort: { conversions: -1, leads: -1 } },
        { $limit: 8 },
      ]),
    ]);

    const snapshot: AdminInsightSnapshot = {
      totals: {
        users: totalUsers,
        leads: totalLeads,
        successfulPayments,
        applications: totalApplications,
        revenue: revenueData[0]?.total || 0,
      },
      leadStatuses: leadStatusData.map((item) => ({
        status: item._id || "Unknown",
        count: item.count,
      })),
      paymentStatuses: paymentStatusData.map((item) => ({
        status: item._id || "Unknown",
        count: item.count,
        revenue: item.revenue || 0,
      })),
      revenueByItemType: revenueByItemTypeData.map((item) => ({
        itemType: item._id || "Unknown",
        count: item.count,
        revenue: item.revenue || 0,
      })),
      recentLeads: recentLeadDocs.map((lead) => ({
        name: lead.name,
        status: lead.status,
        source: lead.source,
        assignedTo: lead.assignedTo,
        createdAt: lead.createdAt?.toISOString(),
      })),
      recentPayments: recentPaymentDocs.map((payment) => ({
        status: payment.status,
        amount: payment.amount,
        itemType: payment.itemType,
        createdAt: payment.createdAt?.toISOString(),
      })),
      employeePerformance: employeeData.map((employee) => ({
        name: employee._id || "Unassigned",
        leads: employee.leads,
        conversions: employee.conversions,
      })),
    };

    try {
      const insights = await generateAdminInsights(snapshot);
      return NextResponse.json({
        ...insights,
        aiAvailable: true,
        generatedAt: new Date().toISOString(),
        snapshot,
      });
    } catch (error) {
      const insights = fallbackInsights(snapshot);
      return NextResponse.json({
        ...insights,
        aiAvailable: false,
        error: error instanceof Error ? error.message : "Gemini insight generation failed",
        generatedAt: new Date().toISOString(),
        snapshot,
      });
    }
  } catch (error) {
    console.error("Admin AI insights error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
