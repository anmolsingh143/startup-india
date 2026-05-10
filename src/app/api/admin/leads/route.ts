import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Lead } from "@/models/CoreModels";
import { requireAdmin } from "@/lib/admin-auth";

const VALID_STATUSES = [
  "New Lead",
  "Applied",
  "Payment Pending",
  "Payment Success",
  "Enrolled",
  "Rejected",
] as const;

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    await dbConnect();
    const leads = await Lead.find().sort({ createdAt: -1 });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Admin leads GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    const { name, email, phone, source, status, assignedTo } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }

    await dbConnect();
    const lead = await Lead.create({
      clerkId: `manual_${Date.now()}`,
      name,
      email,
      phone,
      source: source || "Manual Admin Entry",
      status: VALID_STATUSES.includes(status) ? status : "New Lead",
      assignedTo: assignedTo || undefined,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Admin leads POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    const { id, status, assignedTo } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Lead id is required" }, { status: 400 });
    }

    await dbConnect();

    const update: { status?: string; assignedTo?: string } = {};

    if (VALID_STATUSES.includes(status)) {
      update.status = status;
    }

    if (typeof assignedTo === "string") {
      update.assignedTo = assignedTo;
    }

    const lead = await Lead.findByIdAndUpdate(id, update, { new: true });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Admin leads PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
