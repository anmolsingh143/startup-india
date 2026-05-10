import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Payment } from "@/models/AnalyticsModels";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    await dbConnect();
    const payments = await Payment.find().sort({ createdAt: -1 });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Admin payments GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
