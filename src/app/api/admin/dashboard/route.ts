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
    const [
      totalProjects,
      totalCertificates,
      totalSkills,
      totalExperience,
      unreadMessages,
      totalMessages,
      recentProjects,
      recentMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.certificate.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count(),
      prisma.project.findMany({
        take: 4,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, status: true, published: true, updatedAt: true },
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, subject: true, isRead: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalProjects,
        totalCertificates,
        totalSkills,
        totalExperience,
        unreadMessages,
        totalMessages,
      },
      recentProjects,
      recentMessages,
    });
  } catch (error) {
    console.error('Admin dashboard metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}
