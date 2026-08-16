import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Wire up a real CRM/email integration here (e.g., Hubspot, Resend, or Zapier webhooks).
    console.log("=== NEW DEMO REQUEST ===");
    console.log(JSON.stringify(body, null, 2));
    console.log("========================");

    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, message: 'Demo request logged successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
