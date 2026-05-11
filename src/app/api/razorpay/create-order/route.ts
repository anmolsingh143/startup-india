import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { Payment } from "@/models/AnalyticsModels";
import { User } from "@/models/CoreModels";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpaySecret) {
  throw new Error("Razorpay credentials are not configured on the server.");
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId as string,
  key_secret: razorpaySecret as string,
});

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "INR", receipt, itemType, itemId } = await req.json();
    const normalizedItemType = itemType === "InternshipEnrollment" ? "Internship" : itemType;

    if (!amount || !normalizedItemType || !itemId) {
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Try to record in DB, but don't block payment if DB is having auth issues
    try {
      await dbConnect();
      const user = await User.findOne({ clerkId });
      if (user) {
        await Payment.create({
          userId: user._id,
          razorpayOrderId: order.id,
          amount,
          currency,
          status: 'Created',
          itemType: normalizedItemType,
          itemId: String(itemId),
        });
      }
    } catch (dbError) {
      console.warn("Database record failed, but proceeding with payment:", dbError);
    }
    
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ 
      error: "Failed to create order", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
