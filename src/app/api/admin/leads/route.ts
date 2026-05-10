import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { Lead } from "@/models/CoreModels";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    const role = ((sessionClaims?.metadata as any)?.role || "").toLowerCase();
    
    if (!userId || (role !== "admin" && role !== "employee")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const leads = await Lead.find().sort({ createdAt: -1 });

    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = ((sessionClaims?.metadata as any)?.role || "").toLowerCase();
    
    if (!userId || (role !== "admin" && role !== "employee")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, status, assignedTo } = await req.json();
    await dbConnect();

    const lead = await Lead.findByIdAndUpdate(id, { status, assignedTo }, { new: true });
    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
