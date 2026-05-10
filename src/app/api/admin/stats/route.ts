import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Application, Lead, User } from "@/models/CoreModels";
import { Payment } from "@/models/AnalyticsModels";
import { requireAdmin } from "@/lib/admin-auth";

type DailyPayment = { _id: string; revenue: number };
type DailyLead = { _id: string; leads: number };
type EmployeePerformance = { _id: string | null; leads: number; conversions: number };

function formatDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatActivityTime(date?: Date) {
  if (!date) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes} mins ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;

  return `${Math.round(diffHours / 24)} days ago`;
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    await dbConnect();

    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalLeads,
      totalPayments,
      totalApplications,
      recentPayments,
      recentLeads,
      revenueData,
      dailyPayments,
      dailyLeads,
      employeePerformance,
    ] = await Promise.all([
      User.countDocuments(),
      Lead.countDocuments(),
      Payment.countDocuments({ status: "Successful" }),
      Application.countDocuments(),
      Payment.find({ status: "Successful" }).sort({ createdAt: -1 }).limit(5).lean(),
      Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
      Payment.aggregate<{ _id: null; total: number }>([
        { $match: { status: "Successful" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate<DailyPayment>([
        { $match: { status: "Successful", createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$amount" },
          },
        },
      ]),
      Lead.aggregate<DailyLead>([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            leads: { $sum: 1 },
          },
        },
      ]),
      Lead.aggregate<EmployeePerformance>([
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
        { $limit: 5 },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    const paymentRevenueByDay = new Map(dailyPayments.map((item) => [item._id, item.revenue]));
    const leadsByDay = new Map(dailyLeads.map((item) => [item._id, item.leads]));
    const chartData = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(since);
      date.setDate(since.getDate() + index);
      const key = formatDayKey(date);

      return {
        name: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
        revenue: paymentRevenueByDay.get(key) || 0,
        leads: leadsByDay.get(key) || 0,
      };
    });

    const conversionRate = (totalPayments / (totalLeads || 1)) * 100;
    const stats = [
      { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: "CreditCard", trend: "+ live", positive: true, color: "text-primary" },
      { label: "Total Leads", value: totalLeads.toString(), icon: "Target", trend: "+ live", positive: true, color: "text-secondary" },
      { label: "Conversion Rate", value: `${conversionRate.toFixed(1)}%`, icon: "TrendingUp", trend: "+ live", positive: conversionRate > 0, color: "text-green-500" },
      { label: "Active Users", value: totalUsers.toString(), icon: "Users", trend: "+ live", positive: true, color: "text-purple-500" },
    ];

    const activity = [
      ...recentPayments.map((payment) => ({
        event: "Payment Successful",
        time: formatActivityTime(payment.createdAt),
        desc: `${payment.itemType || "Item"} payment for ₹${Number(payment.amount || 0).toLocaleString("en-IN")}`,
        kind: "payment",
        createdAt: payment.createdAt?.toISOString(),
      })),
      ...recentLeads.map((lead) => ({
        event: "Lead Updated",
        time: formatActivityTime(lead.createdAt),
        desc: `${lead.name} from ${lead.source || "unknown source"} is ${lead.status}`,
        kind: "lead",
        createdAt: lead.createdAt?.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    return NextResponse.json({
      stats,
      chartData,
      totalRevenue,
      totalUsers,
      totalLeads,
      totalPayments,
      totalApplications,
      recentPayments,
      employeePerformance: employeePerformance.map((employee) => ({
        name: employee._id || "Unassigned",
        leads: employee.leads,
        conversions: employee.conversions,
        revenue: employee.conversions * 1999,
        score: Math.min(100, Math.round((employee.conversions / (employee.leads || 1)) * 100)),
      })),
      activity,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
