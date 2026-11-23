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
    const projects = await prisma.project.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      title,
      slug,
      summary,
      description,
      problemSolved,
      architecture,
      keyFeatures,
      technologies,
      thumbnail,
      images,
      githubUrl,
      liveUrl,
      status,
      featured,
      published,
      displayOrder,
    } = data;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        slug: generatedSlug,
        summary: summary || title,
        description: description.trim(),
        problemSolved: problemSolved || '',
        architecture: architecture || '',
        keyFeatures: Array.isArray(keyFeatures) ? JSON.stringify(keyFeatures) : (keyFeatures || '[]'),
        technologies: Array.isArray(technologies) ? JSON.stringify(technologies) : (technologies || '[]'),
        thumbnail: thumbnail || null,
        images: Array.isArray(images) ? JSON.stringify(images) : (images || '[]'),
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        status: status || 'Completed',
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('Error creating project:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A project with this slug or title already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
