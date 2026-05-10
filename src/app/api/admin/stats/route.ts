import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { User, Lead, Application } from "@/models/CoreModels";
import { Payment } from "@/models/AnalyticsModels";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    const role = ((sessionClaims?.metadata as any)?.role || "").toLowerCase();
    
    // Only allow Admin or Employee roles
    if (!userId || (role !== "admin" && role !== "employee")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    // Parallel fetching for performance
    const [
      totalUsers,
      totalLeads,
      totalPayments,
      totalApplications,
      recentPayments
    ] = await Promise.all([
      User.countDocuments(),
      Lead.countDocuments(),
      Payment.countDocuments({ status: "Successful" }),
      Application.countDocuments(),
      Payment.find({ status: "Successful" }).sort({ createdAt: -1 }).limit(5)
    ]);

    // Calculate total revenue
    const revenueData = await Payment.aggregate([
      { $match: { status: "Successful" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Mock trend data (in a real app, you'd calculate this by comparing time periods)
    const stats = [
      { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: "CreditCard", trend: "+12.5%", positive: true, color: "text-primary" },
      { label: "Total Leads", value: totalLeads.toString(), icon: "Target", trend: "+8.2%", positive: true, color: "text-secondary" },
      { label: "Conversion Rate", value: `${((totalPayments / (totalLeads || 1)) * 100).toFixed(1)}%`, icon: "TrendingUp", trend: "+2.1%", positive: true, color: "text-green-500" },
      { label: "Active Users", value: totalUsers.toString(), icon: "Users", trend: "+4", positive: true, color: "text-purple-500" },
    ];

    return NextResponse.json({
      stats,
      totalRevenue,
      totalUsers,
      totalLeads,
      totalPayments,
      totalApplications,
      recentPayments
    });

  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
