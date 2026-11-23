import { getAdminSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const educations = await prisma.education.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ educations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { institution, degree, fieldOfStudy, score, startDate, endDate, description, displayOrder, published } = data;

    if (!institution || !degree) {
      return NextResponse.json({ error: 'Institution and degree are required' }, { status: 400 });
    }

    const edu = await prisma.education.create({
      data: {
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy || '',
        score: score || null,
        startDate: startDate || '',
        endDate: endDate || null,
        description: description || null,
        displayOrder: Number(displayOrder) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, education: edu });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Failed to create education entry' }, { status: 500 });
  }
}
