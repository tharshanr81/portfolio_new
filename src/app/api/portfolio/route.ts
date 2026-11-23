import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Ensure fresh data on every request

export async function GET() {
  try {
    const [profile, projects, skillCategories, experiences, educations, certificates, settings] =
      await Promise.all([
        prisma.profile.findFirst(),
        prisma.project.findMany({
          where: { published: true },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.skillCategory.findMany({
          orderBy: { displayOrder: 'asc' },
          include: {
            skills: {
              where: { published: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        }),
        prisma.experience.findMany({
          where: { published: true },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.education.findMany({
          where: { published: true },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.certificate.findMany({
          where: { published: true },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.globalSetting.findMany(),
      ]);

    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      profile,
      projects,
      skillCategories,
      experiences,
      educations,
      certificates,
      settings: settingsMap,
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve portfolio data from database' },
      { status: 500 }
    );
  }
}
