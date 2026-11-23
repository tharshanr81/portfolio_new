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
    const certificates = await prisma.certificate.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ certificates });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { title, issuer, issueDate, credentialUrl, fileUrl, category, published, displayOrder } = data;

    if (!title || !issuer) {
      return NextResponse.json({ error: 'Title and issuer are required' }, { status: 400 });
    }

    const certificate = await prisma.certificate.create({
      data: {
        title: title.trim(),
        issuer: issuer.trim(),
        issueDate: issueDate || '2025',
        credentialUrl: credentialUrl || null,
        fileUrl: fileUrl || null,
        category: category || 'General',
        published: published !== undefined ? Boolean(published) : true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}
