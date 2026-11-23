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
    const profile = await prisma.profile.findFirst();
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const existing = await prisma.profile.findFirst();

    if (!existing) {
      const created = await prisma.profile.create({
        data: {
          name: data.name || 'Tharshan R',
          headline: data.headline || '',
          role: data.role || 'Full-Stack Developer',
          bio: data.bio || '',
          aboutDetails: data.aboutDetails || '',
          email: data.email || 'tharshanr7878@gmail.com',
          phone: data.phone || '',
          location: data.location || 'Chennai, India',
          avatarUrl: data.avatarUrl || null,
          resumeUrl: data.resumeUrl || null,
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
        },
      });
      return NextResponse.json({ success: true, profile: created });
    }

    const updated = await prisma.profile.update({
      where: { id: existing.id },
      data: {
        name: data.name !== undefined ? data.name : existing.name,
        headline: data.headline !== undefined ? data.headline : existing.headline,
        role: data.role !== undefined ? data.role : existing.role,
        bio: data.bio !== undefined ? data.bio : existing.bio,
        aboutDetails: data.aboutDetails !== undefined ? data.aboutDetails : existing.aboutDetails,
        email: data.email !== undefined ? data.email : existing.email,
        phone: data.phone !== undefined ? data.phone : existing.phone,
        location: data.location !== undefined ? data.location : existing.location,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : existing.avatarUrl,
        resumeUrl: data.resumeUrl !== undefined ? data.resumeUrl : existing.resumeUrl,
        githubUrl: data.githubUrl !== undefined ? data.githubUrl : existing.githubUrl,
        linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : existing.linkedinUrl,
        isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : existing.isAvailable,
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
