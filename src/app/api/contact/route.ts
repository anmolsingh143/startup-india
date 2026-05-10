import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SupportRequest } from '@/models/SupportModels';
import { Notification } from '@/models/AnalyticsModels';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // 1. Save to Database
    const supportRequest = await SupportRequest.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // 2. Create Notification for Admin (using a placeholder admin ID or role-based check)
    // For now, we'll just create a general notification
    await Notification.create({
      userId: 'ADMIN_GLOBAL', // Placeholder for admin dashboard
      title: 'New Support Request',
      message: `New message from ${name}: ${subject}`,
      type: 'Info',
    });

    // 3. Send Email (Optional: only if env vars are set)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'support.startupindiatech@gmail.com',
        subject: `[Contact Form] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, data: supportRequest }, { status: 201 });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
