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

    if (data.role !== undefined) updateData.role = data.role;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.isCurrent !== undefined) updateData.isCurrent = Boolean(data.isCurrent);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.responsibilities !== undefined) {
      updateData.responsibilities = Array.isArray(data.responsibilities)
        ? JSON.stringify(data.responsibilities)
        : data.responsibilities;
    }
    if (data.displayOrder !== undefined) updateData.displayOrder = Number(data.displayOrder);
    if (data.published !== undefined) updateData.published = Boolean(data.published);

    const exp = await prisma.experience.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, experience: exp });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
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
    await prisma.experience.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
