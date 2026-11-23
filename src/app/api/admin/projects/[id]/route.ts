import { getAdminSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

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
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.problemSolved !== undefined) updateData.problemSolved = data.problemSolved;
    if (data.architecture !== undefined) updateData.architecture = data.architecture;
    if (data.keyFeatures !== undefined) {
      updateData.keyFeatures = Array.isArray(data.keyFeatures)
        ? JSON.stringify(data.keyFeatures)
        : data.keyFeatures;
    }
    if (data.technologies !== undefined) {
      updateData.technologies = Array.isArray(data.technologies)
        ? JSON.stringify(data.technologies)
        : data.technologies;
    }
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
    if (data.images !== undefined) {
      updateData.images = Array.isArray(data.images)
        ? JSON.stringify(data.images)
        : data.images;
    }
    if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
    if (data.liveUrl !== undefined) updateData.liveUrl = data.liveUrl;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.published !== undefined) updateData.published = Boolean(data.published);
    if (data.displayOrder !== undefined) updateData.displayOrder = Number(data.displayOrder);

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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
    await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
