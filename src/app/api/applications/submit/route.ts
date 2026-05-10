import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { Lead, Application, Payment } from "@/models/CoreModels";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { 
      internshipId, 
      razorpay, 
      fullName, 
      email, 
      phone, 
      ...restOfFormData 
    } = body;

    // 1. Verify Razorpay Payment Signature (Double check)
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

    // 2. Check if Payment already exists (should be created in verify-payment)
    let payment = await Payment.findOne({ razorpayPaymentId: razorpay_payment_id });
    
    if (!payment) {
      // Fallback: create if missing
      payment = await Payment.create({
        userId,
        courseId: internshipId,
        amount: 1999,
        status: 'Successful',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });
    }

    // 3. Save Application Record
    const application = await Application.create({
      studentId: userId,
      internshipId,
      status: 'Pending',
      ...restOfFormData
    });

    // 4. Update CRM Lead Entry
    // Find existing lead from verify-payment or create new
    await Lead.findOneAndUpdate(
      { clerkId: userId, internshipId },
      {
        name: fullName,
        email,
        phone,
        status: 'Enrolled',
        source: 'Internship Onboarding Form',
        applicationId: application._id,
        paymentId: payment._id
      },
      { upsert: true }
    );

    // 5. Automations
    console.log(`Professional Application completed for ${fullName} (${userId})`);

    return NextResponse.json({ 
      success: true, 
      applicationId: application._id 
    });

  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
