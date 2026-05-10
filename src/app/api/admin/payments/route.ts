import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { Payment } from "@/models/CoreModels";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;
    
    if (!userId || (role !== "admin" && role !== "employee")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const payments = await Payment.find().sort({ createdAt: -1 });

    return NextResponse.json(payments);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
