import React from 'react';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/public/Navbar';
import { Hero } from '@/components/public/Hero';
import { About } from '@/components/public/About';
import { Skills } from '@/components/public/Skills';
import { Projects } from '@/components/public/Projects';
import { Experience } from '@/components/public/Experience';
import { Certificates } from '@/components/public/Certificates';
import { Education } from '@/components/public/Education';
import { Contact } from '@/components/public/Contact';
import { Footer } from '@/components/public/Footer';

export const dynamic = 'force-dynamic';

async function getPortfolioData() {
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

  return {
    profile,
    projects,
    skillCategories,
    experiences,
    educations,
    certificates,
    settings: settingsMap,
  };
}

export default async function HomePage() {
  const data = await getPortfolioData();
  const profile = data.profile;

  return (
    <div className="relative min-h-screen bg-canvas text-primary overflow-x-hidden selection:bg-purple-500/30">
      {/* Background Subtle Mesh */}
      <div className="fixed inset-0 pointer-events-none bg-mesh-dark dark:bg-mesh-dark opacity-60 z-0" />

      <div className="relative z-10">
        <Navbar
          isAvailable={profile?.isAvailable}
          resumeUrl={profile?.resumeUrl}
        />

        <main>
          <Hero
            name={profile?.name || 'Tharshan R'}
            role={profile?.role || 'Frontend & Full-Stack Developer'}
            headline={profile?.headline || 'Architecting Resilient Digital Products'}
            bio={profile?.bio || 'Building scalable full-stack web applications and AI decision intelligence systems.'}
            avatarUrl={profile?.avatarUrl || '/uploads/avatar.png'}
            resumeUrl={profile?.resumeUrl || '/resume.pdf'}
            isAvailable={profile?.isAvailable}
          />

          <About
            bio={profile?.bio}
            aboutDetails={profile?.aboutDetails}
          />

          <Skills categories={data.skillCategories} />

          <Projects projects={data.projects as any} />

          <Experience experiences={data.experiences as any} />

          <Certificates certificates={data.certificates as any} />

          <Education educations={data.educations as any} />

          <Contact
            email={profile?.email || 'tharshanr7878@gmail.com'}
            phone={profile?.phone}
            location={profile?.location || 'Chennai, India'}
            githubUrl={profile?.githubUrl}
            linkedinUrl={profile?.linkedinUrl}
            resumeUrl={profile?.resumeUrl}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
