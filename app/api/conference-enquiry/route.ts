import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Basic validation
    if (!body.organisation || !body.contact || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: integrate with real email / CRM. For now, accept and return success.
    console.log('Conference enquiry received:', body);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
