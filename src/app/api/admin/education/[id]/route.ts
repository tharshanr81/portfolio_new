import { getAdminSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updateData: any = {};

    if (data.institution !== undefined) updateData.institution = data.institution;
    if (data.degree !== undefined) updateData.degree = data.degree;
    if (data.fieldOfStudy !== undefined) updateData.fieldOfStudy = data.fieldOfStudy;
    if (data.score !== undefined) updateData.score = data.score;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.displayOrder !== undefined) updateData.displayOrder = Number(data.displayOrder);
    if (data.published !== undefined) updateData.published = Boolean(data.published);

    const edu = await prisma.education.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, education: edu });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.education.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
