import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { Lead, Payment } from "@/models/CoreModels";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { razorpay, internshipId, amount } = body;

    // 1. Verify Razorpay Payment Signature
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = razorpay;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!key_secret) {
      throw new Error("Razorpay key secret not configured");
    }

    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await dbConnect();

    // 2. Save Payment Record
    const payment = await Payment.create({
      userId,
      courseId: internshipId, 
      amount: amount || 1999,
      status: 'Successful',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });

    // 3. Create/Update CRM Lead Entry (Form Pending)
    const lead = await Lead.create({
      clerkId: userId,
      status: 'Payment Success',
      source: 'Internship Enroll Flow',
      internshipId,
      assignedTo: 'Rahul Sharma'
    });

    return NextResponse.json({ 
      success: true, 
      paymentId: payment._id,
      leadId: lead._id
    });

  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
