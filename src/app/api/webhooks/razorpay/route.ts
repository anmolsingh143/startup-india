import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import { Payment } from '@/models/AnalyticsModels';
import { User } from '@/models/CoreModels';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: 'Missing webhook secret or signature' }, { status: 400 });
    }

    // Verify Signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    await dbConnect();

    // Handle Payment Success
    if (event.event === 'payment.captured') {
      const paymentData = event.payload.payment.entity;
      
      // Update Payment Record
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: paymentData.order_id },
        { 
          status: 'Successful',
          razorpayPaymentId: paymentData.id
        },
        { new: true }
      );

      if (payment) {
        // If it's a course or internship, add it to user's enrolled list
        if (payment.itemType === 'Course' || payment.itemType === 'Internship') {
           await User.findByIdAndUpdate(payment.userId, {
             $addToSet: { enrolledCourses: payment.itemId.toString() }
           });
        }
        
        // Example: If it's a subscription, update user's role
        if (payment.itemType === 'Subscription') {
           await User.findByIdAndUpdate(payment.userId, {
             role: 'Pro Student',
           });
        }
      }

      return NextResponse.json({ status: 'ok' });
    }

    // Handle Payment Failed
    if (event.event === 'payment.failed') {
      const paymentData = event.payload.payment.entity;
      
      await Payment.findOneAndUpdate(
        { razorpayOrderId: paymentData.order_id },
        { status: 'Failed', razorpayPaymentId: paymentData.id }
      );

      return NextResponse.json({ status: 'ok' });
    }

    return NextResponse.json({ status: 'unhandled event' });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
