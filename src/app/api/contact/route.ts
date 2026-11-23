import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields' },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2 || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please enter a genuine name and message' },
        { status: 400 }
      );
    }

    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject ? subject.trim() : 'Inquiry from Developer Portfolio',
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been received! I will review it and get back to you shortly.',
      id: savedMessage.id,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Unable to deliver message at this moment. Please email directly at tharshanr7878@gmail.com' },
      { status: 500 }
    );
  }
}
