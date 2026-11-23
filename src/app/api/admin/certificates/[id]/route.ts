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

    if (data.title !== undefined) updateData.title = data.title;
    if (data.issuer !== undefined) updateData.issuer = data.issuer;
    if (data.issueDate !== undefined) updateData.issueDate = data.issueDate;
    if (data.credentialUrl !== undefined) updateData.credentialUrl = data.credentialUrl;
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.published !== undefined) updateData.published = Boolean(data.published);
    if (data.displayOrder !== undefined) updateData.displayOrder = Number(data.displayOrder);

    const certificate = await prisma.certificate.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
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
    await prisma.certificate.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
