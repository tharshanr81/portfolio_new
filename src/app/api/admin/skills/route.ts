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
    const categories = await prisma.skillCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        skills: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, icon, categoryId, newCategoryName, displayOrder, published } = data;

    if (!name) {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }

    let targetCategoryId = categoryId;

    if (!targetCategoryId && newCategoryName) {
      let cat = await prisma.skillCategory.findUnique({
        where: { name: newCategoryName.trim() },
      });
      if (!cat) {
        cat = await prisma.skillCategory.create({
          data: { name: newCategoryName.trim(), displayOrder: 99 },
        });
      }
      targetCategoryId = cat.id;
    }

    if (!targetCategoryId) {
      return NextResponse.json({ error: 'A skill category is required' }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        name: name.trim(),
        icon: icon || null,
        categoryId: targetCategoryId,
        displayOrder: Number(displayOrder) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
