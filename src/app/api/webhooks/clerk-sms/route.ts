import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing CLERK_WEBHOOK_SECRET" }, { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  const eventType = evt.type;

  if (eventType === 'sms.created') {
    const phoneNumber = evt.data.phone_number;
    const otpCode = evt.data.otp_code;
    // Clerk might pass a formatted message, but Fast2SMS route='otp' only takes the code

    if (!phoneNumber || !otpCode) {
      console.error("Missing phone number or OTP code in payload");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    try {
      const fast2smsKey = process.env.FAST2SMS_API_KEY;
      if (!fast2smsKey) {
          throw new Error("Missing FAST2SMS_API_KEY");
      }
      
      // Fast2SMS typically requires a 10-digit Indian number without the +91 country code for its standard API
      let cleanPhoneNumber = phoneNumber.replace("+", "");
      if (cleanPhoneNumber.startsWith("91") && cleanPhoneNumber.length === 12) {
          cleanPhoneNumber = cleanPhoneNumber.substring(2);
      }

      console.log(`Sending OTP ${otpCode} to ${cleanPhoneNumber} via Fast2SMS`);

      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "authorization": fast2smsKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otpCode,
          numbers: cleanPhoneNumber
        })
      });

      const data = await response.json();
      console.log("Fast2SMS Response:", data);

      if (!data.return) {
         throw new Error(data.message || "Failed to send SMS via Fast2SMS");
      }

      return NextResponse.json({ success: true, message: "SMS sent successfully via Fast2SMS" }, { status: 200 });
    } catch (error: any) {
      console.error("Fast2SMS Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
