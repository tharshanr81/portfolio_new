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
    const experiences = await prisma.experience.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ experiences });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { role, company, location, startDate, endDate, isCurrent, description, responsibilities, displayOrder, published } = data;

    if (!role || !company) {
      return NextResponse.json({ error: 'Role and company are required' }, { status: 400 });
    }

    const exp = await prisma.experience.create({
      data: {
        role: role.trim(),
        company: company.trim(),
        location: location || null,
        startDate: startDate || '',
        endDate: isCurrent ? 'Present' : (endDate || ''),
        isCurrent: Boolean(isCurrent),
        description: description || '',
        responsibilities: Array.isArray(responsibilities) ? JSON.stringify(responsibilities) : (responsibilities || '[]'),
        displayOrder: Number(displayOrder) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, experience: exp });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
