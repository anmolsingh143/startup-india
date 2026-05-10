import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { Lead, User } from "@/models/CoreModels";
import { Payment } from "@/models/AnalyticsModels";
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

    // 2. Fetch User Details for Lead
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // 3. Update Payment Record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        userId: user._id,
        itemType: 'Internship',
        itemId: String(internshipId),
        amount: amount || 1999,
        currency: 'INR',
        status: 'Successful',
        razorpayPaymentId: razorpay_payment_id
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    // 4. Create or update CRM Lead Entry
    const lead = await Lead.findOneAndUpdate(
      { clerkId: userId, internshipId },
      {
        clerkId: userId,
        name: `${user.firstName || "Unknown"} ${user.lastName || "User"}`.trim(),
        email: user.email || "unknown@example.com",
        phone: user.phone || "Not Provided",
        status: 'Payment Success',
        source: 'Internship Enroll Flow',
        internshipId,
        assignedTo: 'Rahul Sharma'
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return NextResponse.json({ 
      success: true, 
      paymentId: payment._id,
      leadId: lead._id
    });

  } catch (error) {
    console.error("Verification Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
