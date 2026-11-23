import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  // 1. Create Default Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in your local .env before seeding.');
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'Tharshan R' },
    create: {
      email: adminEmail,
      name: 'Tharshan R',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin User created/updated: ${admin.email}`);

  // 2. Seed Profile
  const profile = await prisma.profile.findFirst();
  const profileData = {
    name: 'Tharshan R',
    headline: 'Full-Stack Developer & Software Architect',
    role: 'Frontend / Full-Stack Developer & AI Systems Engineer',
    bio: 'B.Tech (Honours) in Artificial Intelligence & Data Science graduate with hands-on expertise engineering high-performance full-stack web applications, real-time data visualizers, and resilient digital products using React, Next.js, TypeScript, Python, and modern relational databases.',
    aboutDetails: `I specialize in bridging the gap between rigorous software architecture and elegant, intuitive user interfaces. With hands-on professional internship experience at Zetheta Algorithms engineering virtualized real-time dashboards for thousands of active records, and developing robust platforms like LunoHope, I focus on clean code, zero-waste performance, and purposeful design. My background in AI & Data Science allows me to design data-intensive applications, automated pipelines, and intelligent predictive systems with confidence.`,
    email: 'tharshanr7878@gmail.com',
    phone: '+91 8122057204',
    location: 'Chennai, India',
    avatarUrl: '/uploads/avatar.png',
    resumeUrl: '/uploads/resume.pdf',
    githubUrl: 'https://github.com/tharshanr81',
    linkedinUrl: 'https://www.linkedin.com/in/tharshanr81/',
    isAvailable: true,
  };

  if (profile) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: profileData,
    });
  } else {
    await prisma.profile.create({
      data: profileData,
    });
  }
  console.log('Profile seeded');

  // 3. Clear existing projects, skills, experiences, education, certificates to ensure a clean sync
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.globalSetting.deleteMany();

  // 4. Seed Projects
  const projects = [
    {
      title: 'LunoHope',
      slug: 'lunohope-crowdfunding-platform',
      summary: 'Full-stack crowdfunding ecosystem with modern architecture, resilient database layer, and reactive user interface.',
      description: 'LunoHope is a production-grade crowdfunding platform engineered to facilitate transparent fundraising with real-time tracking, modular campaign creation, and scalable user management. Built with Next.js App Router, TypeScript, and Prisma ORM backed by PostgreSQL & Supabase, it emphasizes clean separation of concerns and lightning-fast edge delivery.',
      problemSolved: 'Traditional crowdfunding platforms suffer from clunky multi-step campaign authoring, poor mobile experiences, and opaque transaction audits. LunoHope delivers an intuitive, frictionless donor experience with modular component trees and optimized server-side data fetching.',
      architecture: 'Next.js 14 App Router, Server Actions, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, Supabase Auth & Storage.',
      keyFeatures: JSON.stringify([
        'Modular campaign creation workflow with dynamic media attachments',
        'Real-time fundraising goal progress visualization and donor ledgers',
        'Prisma-backed relational schema with strict foreign-key integrity',
        'Fully responsive, accessible UI with smooth micro-interactions',
        'Server-side validation and secure database transactions'
      ]),
      technologies: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Prisma ORM', 'PostgreSQL', 'Supabase']),
      thumbnail: '/uploads/projects/sample_video.mp4',
      images: JSON.stringify(['/uploads/avatar.png']),
      githubUrl: 'https://github.com/tharshanr81/lunohope',
      liveUrl: '',
      status: 'In Progress',
      featured: true,
      displayOrder: 1,
      published: true,
    },
    {
      title: 'AI-Driven Predictive Decision Intelligence Framework',
      slug: 'ai-predictive-decision-intelligence-framework',
      summary: 'Enterprise Decision Intelligence & Risk Optimization system combining Digital Twin simulations, ETL pipelines, and prescriptive anomaly forecasting.',
      description: 'A comprehensive academic and engineering capstone project engineered in partial fulfilment for the B.Tech Honours degree. It bridges the gap between raw industrial telemetry and optimal strategic execution. Leveraging Digital Twin models, the framework simulates operational "What-If" scenarios to forecast risks, trace root causes, and prescribe proactive mitigations prior to physical execution.',
      problemSolved: 'Modern enterprises struggle with fragmented, descriptive-only analytics that fail to prescribe concrete actions during anomalies. This framework provides automated root-cause diagnosis and risk optimization under uncertain operational conditions.',
      architecture: 'Python, Scikit-learn, Pandas, NumPy, Digital Twin Simulation Pipeline, Automated ETL, REST API Integration.',
      keyFeatures: JSON.stringify([
        'Automated ETL data ingestion pipeline for multi-source operational metrics',
        'Digital Twin simulation module enabling risk-free "What-If" scenario testing',
        'Machine learning anomaly detection and predictive failure classification',
        'Automated root-cause tracing with prescriptive operational actions',
        'Comprehensive analytical dashboard with risk mitigation heatmaps'
      ]),
      technologies: JSON.stringify(['Python', 'Scikit-learn', 'Digital Twin', 'Pandas', 'NumPy', 'ETL Pipelines', 'REST APIs']),
      thumbnail: '',
      images: JSON.stringify([]),
      githubUrl: 'https://github.com/tharshanr81',
      liveUrl: '',
      status: 'Completed',
      featured: true,
      displayOrder: 2,
      published: true,
    },
    {
      title: 'Real-Time Stock Screener',
      slug: 'real-time-stock-screener',
      summary: 'High-performance stock screener dashboard tracking 5,000+ equities with virtualized tables, live price feeds, and interactive charting.',
      description: 'Engineered during my Frontend Developer internship at Zetheta Algorithms Pvt. Ltd. The dashboard renders over 5,000 active equity instruments smoothly at 60 FPS using TanStack Table and virtualization. Features instantaneous multi-attribute filtering, sector breakdowns, watchlist persistence, and dynamic financial charts.',
      problemSolved: 'Rendering thousands of streaming financial data rows leads to DOM bloating and sluggish frame rates. Solved by implementing virtualized windowing, memoized computations, and debounced state pipelines.',
      architecture: 'Next.js, TypeScript, Tailwind CSS, TanStack Virtual, TanStack Table, Lucide Icons.',
      keyFeatures: JSON.stringify([
        'Virtualized data grid rendering 5,000+ equities seamlessly without lag',
        'Real-time stock price changes and percentage delta indicators',
        'Multi-column sorting, sector filtering, and instantaneous search indexing',
        'Customizable user watchlist with persistent local state',
        'Interactive financial metric charting and visual breakout signals'
      ]),
      technologies: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'TanStack Table', 'Virtual Scrolling', 'Lucide']),
      thumbnail: '',
      images: JSON.stringify([]),
      githubUrl: 'https://github.com/tharshanr81/stock-screener',
      liveUrl: '',
      status: 'Completed',
      featured: true,
      displayOrder: 3,
      published: true,
    },
    {
      title: 'Financial Module Builder',
      slug: 'financial-module-builder',
      summary: 'Modular drag-and-drop educational canvas for authoring interactive financial lessons with rich blocks, calculators, and quizzes.',
      description: 'An advanced block-based authoring tool allowing educators and financial analysts to assemble rich interactive modules. Integrates drag-and-drop sorting, embedded compound interest/loan calculators, animated explainer components, progress milestones, and achievement badges.',
      problemSolved: 'Traditional financial training materials are static PDFs with zero engagement. This builder enables fluid, modular lesson creation with hands-on interactive simulations.',
      architecture: 'React, TypeScript, Vite, Tailwind CSS, @dnd-kit/core, @tiptap/core, Zustand Store.',
      keyFeatures: JSON.stringify([
        'Fluid drag-and-drop canvas powered by @dnd-kit for reordering blocks',
        'Embedded financial calculator widgets (SIP, Loan EMI, Compound Interest)',
        'Rich text authoring with inline formatting and callout components',
        'Interactive quizzes with immediate feedback and scoring validation',
        'Learner progress tracking and dynamic achievement badge unlocks'
      ]),
      technologies: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', '@dnd-kit', 'Zustand', 'Vite']),
      thumbnail: '',
      images: JSON.stringify([]),
      githubUrl: 'https://github.com/tharshanr81/financial-module-builder',
      liveUrl: '',
      status: 'Completed',
      featured: true,
      displayOrder: 4,
      published: true,
    },
    {
      title: 'Wi-Fi RSSI Crowd Level Classification',
      slug: 'wifi-rssi-crowd-level-classification',
      summary: 'Privacy-preserving AI crowd density classifier using Wi-Fi signal attenuation analysis without optical cameras.',
      description: 'An innovative IoT & machine learning system that determines indoor crowd density by measuring signal variations (RSSI) in Wi-Fi packets caused by human physical interference. Eliminates video surveillance risks while delivering low-cost, accurate occupancy intelligence via a web dashboard.',
      problemSolved: 'Optical camera-based crowd monitoring creates immense privacy violations and requires expensive optical hardware. Wi-Fi RSSI analysis provides a 100% privacy-safe, passive estimation method using existing wireless infrastructure.',
      architecture: 'Python, Random Forest (Scikit-learn), NumPy, Pandas, RSSI Telemetry Logger, Web Analytics Dashboard.',
      keyFeatures: JSON.stringify([
        '100% camera-free, privacy-compliant crowd density estimation',
        'Machine learning classification pipeline utilizing Random Forest algorithm',
        'Real-time signal variance extraction from Wi-Fi RSSI time-series data',
        'Interactive web telemetry dashboard displaying occupancy trends',
        'Ultra low-cost deployment using standard wireless network access points'
      ]),
      technologies: JSON.stringify(['Python', 'Scikit-learn', 'Random Forest', 'Pandas', 'NumPy', 'JavaScript', 'HTML5/CSS3']),
      thumbnail: '',
      images: JSON.stringify([]),
      githubUrl: 'https://github.com/tharshanr81/wifi-rssi-crowd-density',
      liveUrl: '',
      status: 'Completed',
      featured: false,
      displayOrder: 5,
      published: true,
    },
    {
      title: 'MultiForm Automator (Multiple Form Filler)',
      slug: 'multiform-automator',
      summary: 'Database-driven browser automation utility reducing repetitive web form completion by ~70% using Selenium and MySQL.',
      description: 'An automated desktop & web companion tool designed to eliminate tedious re-entry of repetitive form fields across diverse portals. Connects with a relational MySQL database to map user records into web inputs via Python Selenium automation.',
      problemSolved: 'Applying to hundreds of job applications or government portals requires manually typing the exact same biographical, academic, and professional details repeatedly, consuming hundreds of hours with high typographical error rates.',
      architecture: 'Python, Selenium WebDriver, MySQL Database, HTML5, CSS3, JavaScript Web UI.',
      keyFeatures: JSON.stringify([
        'Automated field mapping across dynamic multi-page web forms',
        'Relational MySQL storage for secure data retention and rapid profile retrieval',
        'Reduces repetitive manual entry duration by ~70%',
        'Built-in error mitigation and input validation handlers',
        'Intuitive interface for configuring custom field selector rules'
      ]),
      technologies: JSON.stringify(['Python', 'Selenium', 'MySQL', 'JavaScript', 'HTML5', 'CSS3']),
      thumbnail: '',
      images: JSON.stringify([]),
      githubUrl: 'https://github.com/tharshanr81/multiple-form-filler',
      liveUrl: '',
      status: 'Completed',
      featured: false,
      displayOrder: 6,
      published: true,
    },
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
  }
  console.log(`Seeded ${projects.length} projects`);

  // 5. Seed Skills & Categories
  const skillCategories = [
    {
      name: 'Frontend Development',
      displayOrder: 1,
      skills: [
        { name: 'React.js', icon: 'react', displayOrder: 1 },
        { name: 'Next.js (App Router)', icon: 'nextjs', displayOrder: 2 },
        { name: 'TypeScript', icon: 'typescript', displayOrder: 3 },
        { name: 'JavaScript (ES6+)', icon: 'javascript', displayOrder: 4 },
        { name: 'Tailwind CSS', icon: 'tailwind', displayOrder: 5 },
        { name: 'HTML5 & CSS3', icon: 'html5', displayOrder: 6 },
        { name: 'Responsive UI Architecture', icon: 'layout', displayOrder: 7 },
        { name: 'Vite', icon: 'vite', displayOrder: 8 },
      ],
    },
    {
      name: 'Programming Languages',
      displayOrder: 2,
      skills: [
        { name: 'TypeScript', icon: 'typescript', displayOrder: 1 },
        { name: 'JavaScript', icon: 'javascript', displayOrder: 2 },
        { name: 'Python', icon: 'python', displayOrder: 3 },
        { name: 'Java', icon: 'java', displayOrder: 4 },
        { name: 'SQL', icon: 'database', displayOrder: 5 },
      ],
    },
    {
      name: 'Backend & Automation',
      displayOrder: 3,
      skills: [
        { name: 'Next.js Server Actions & APIs', icon: 'server', displayOrder: 1 },
        { name: 'Node.js', icon: 'nodejs', displayOrder: 2 },
        { name: 'REST APIs', icon: 'api', displayOrder: 3 },
        { name: 'Python Selenium Automation', icon: 'cpu', displayOrder: 4 },
        { name: 'Flask', icon: 'flask', displayOrder: 5 },
      ],
    },
    {
      name: 'Databases & ORM',
      displayOrder: 4,
      skills: [
        { name: 'PostgreSQL', icon: 'postgresql', displayOrder: 1 },
        { name: 'Prisma ORM', icon: 'prisma', displayOrder: 2 },
        { name: 'MySQL', icon: 'mysql', displayOrder: 3 },
        { name: 'SQLite', icon: 'sqlite', displayOrder: 4 },
        { name: 'Supabase', icon: 'supabase', displayOrder: 5 },
      ],
    },
    {
      name: 'AI, ML & Analytics',
      displayOrder: 5,
      skills: [
        { name: 'Scikit-learn', icon: 'brain', displayOrder: 1 },
        { name: 'Random Forest & Classifiers', icon: 'binary', displayOrder: 2 },
        { name: 'Pandas & NumPy', icon: 'bar-chart', displayOrder: 3 },
        { name: 'Decision Intelligence & Digital Twin', icon: 'workflow', displayOrder: 4 },
        { name: 'Exploratory Data Analysis', icon: 'line-chart', displayOrder: 5 },
      ],
    },
    {
      name: 'Tools & Creative Design',
      displayOrder: 6,
      skills: [
        { name: 'Git & GitHub', icon: 'git', displayOrder: 1 },
        { name: 'Figma (UI/UX Wireframing)', icon: 'figma', displayOrder: 2 },
        { name: 'VS Code', icon: 'code', displayOrder: 3 },
        { name: 'Postman', icon: 'send', displayOrder: 4 },
        { name: 'Vitest', icon: 'check-circle', displayOrder: 5 },
      ],
    },
  ];

  for (const cat of skillCategories) {
    const createdCat = await prisma.skillCategory.create({
      data: {
        name: cat.name,
        displayOrder: cat.displayOrder,
      },
    });

    for (const s of cat.skills) {
      await prisma.skill.create({
        data: {
          name: s.name,
          icon: s.icon,
          categoryId: createdCat.id,
          displayOrder: s.displayOrder,
          published: true,
        },
      });
    }
  }
  console.log('Seeded skill categories and skills');

  // 6. Seed Experience
  const experiences = [
    {
      role: 'Frontend Developer Intern',
      company: 'Zetheta Algorithms Pvt. Ltd.',
      location: 'Chennai, India / Remote',
      startDate: 'Jan 2026',
      endDate: 'Present',
      isCurrent: true,
      description: 'Spearheaded frontend development for enterprise financial technology products, notably the Real-Time Stock Screener dashboard.',
      responsibilities: JSON.stringify([
        'Architected and implemented a high-performance stock screener handling 5,000+ real-time records at 60 FPS using Next.js, TypeScript, and Tailwind CSS',
        'Implemented TanStack Table virtualization to prevent DOM exhaustion and maintain sub-16ms render times',
        'Designed interactive filtering engines by market cap, sector, P/E ratio, and custom multi-column criteria',
        'Collaborated closely with backend engineers to integrate streaming price feeds and user watchlist persistence'
      ]),
      displayOrder: 1,
      published: true,
    },
    {
      role: 'UI/UX Design Intern',
      company: 'Cognifyz Technologies',
      location: 'Remote',
      startDate: 'Aug 2025',
      endDate: 'Oct 2025',
      isCurrent: false,
      description: 'Completed comprehensive UI/UX internship curriculum focused on user research, wireframing, high-fidelity Figma prototyping, and design systems.',
      responsibilities: JSON.stringify([
        'Successfully completed 6 out of 8 industry-standard product design task briefs',
        'Designed high-fidelity mockups for Eco-Products E-commerce, Tourist Booking App, and responsive landing pages',
        'Engineered reusable Figma component libraries with interactive variants and responsive auto-layout',
        'Conducted heuristic usability evaluations and refined micro-interaction patterns'
      ]),
      displayOrder: 2,
      published: true,
    },
    {
      role: 'Web Development Intern',
      company: 'Rinex',
      location: 'Remote',
      startDate: 'May 2024',
      endDate: 'Jul 2024',
      isCurrent: false,
      description: 'Developed modern web applications and foundational full-stack modules using modern JavaScript, HTML5, CSS3, and relational databases.',
      responsibilities: JSON.stringify([
        'Engineered responsive full-stack features and practiced modular component-based web development',
        'Completed comprehensive practical capstone projects with high grade evaluations',
        'Acquired production workflow experience with Git version control, code reviews, and API testing'
      ]),
      displayOrder: 3,
      published: true,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log('Seeded experiences');

  // 7. Seed Education
  const educations = [
    {
      institution: 'Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College (Anna University)',
      degree: 'Bachelor of Technology (B.Tech Honours)',
      fieldOfStudy: 'Artificial Intelligence & Data Science',
      score: 'CGPA: 7.80 / 10',
      startDate: '2023',
      endDate: '2027',
      description: 'Specializing in full-stack software engineering, applied machine learning algorithms, database management systems, and decision intelligence architectures. Authored the capstone on AI-Driven Predictive Decision Intelligence and Risk Optimization.',
      displayOrder: 1,
      published: true,
    },
    {
      institution: 'Arunachala Higher Secondary School',
      degree: 'Higher Secondary Certificate (HSC)',
      fieldOfStudy: 'Computer Science, Mathematics, Physics, Chemistry',
      score: '80%',
      startDate: '2022',
      endDate: '2023',
      description: 'Built strong foundational fundamentals in mathematics, object-oriented programming, algorithmic thinking, and computer science principles.',
      displayOrder: 2,
      published: true,
    },
  ];

  for (const edu of educations) {
    await prisma.education.create({ data: edu });
  }
  console.log('Seeded education');

  // 8. Seed Certificates
  const certificates = [
    {
      title: 'Project Work Experience Certificate – Frontend Developer',
      issuer: 'Zetheta Algorithms Pvt. Ltd.',
      issueDate: '2026',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/other_certifications/Screenshot 2026-03-24 145323.png',
      category: 'Experience',
      published: true,
      displayOrder: 1,
    },
    {
      title: 'Web Development Internship Certificate',
      issuer: 'Rinex Technologies',
      issueDate: '05 July 2024',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/web_Dev_images/Rinex_internship_cert.jpeg',
      category: 'Web',
      published: true,
      displayOrder: 2,
    },
    {
      title: 'Rinex Course Grade & Completion Certification',
      issuer: 'Rinex Technologies',
      issueDate: 'July 2024',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/web_Dev_images/Rinex_course_grade.jpeg',
      category: 'Web',
      published: true,
      displayOrder: 3,
    },
    {
      title: 'Full Stack Development Certification',
      issuer: 'NoviTech R&D Pvt. Ltd.',
      issueDate: '2024',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/web_Dev_images/NoviTech_Full_stack.jpeg',
      category: 'Web',
      published: true,
      displayOrder: 4,
    },
    {
      title: 'The Joy of Computing using Python',
      issuer: 'NPTEL (IIT Madras)',
      issueDate: '2024',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/python_certificates/Nptel.jpeg',
      category: 'Python',
      published: true,
      displayOrder: 5,
    },
    {
      title: 'Advanced Python Programming Certification',
      issuer: 'Scaler Academy',
      issueDate: '2024',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/python_certificates/Advanced Python.png',
      category: 'Python',
      published: true,
      displayOrder: 6,
    },
    {
      title: 'Python Development Certification',
      issuer: 'Infosys Springboard',
      issueDate: '2024',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/python_certificates/python.jpeg',
      category: 'Python',
      published: true,
      displayOrder: 7,
    },
    {
      title: 'TechTrio Python Course Certificate',
      issuer: 'Cybernaut Technologies',
      issueDate: '2024',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/python_certificates/Cybernault_python.jpeg',
      category: 'Python',
      published: true,
      displayOrder: 8,
    },
    {
      title: 'UI/UX Design Bootcamp: Instagram Clone in Figma',
      issuer: 'LetsUpgrade',
      issueDate: '2024',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/letsupgrade/instagramclone figma.jpg',
      category: 'UI/UX',
      published: true,
      displayOrder: 9,
    },
    {
      title: 'Unstop Engineering Series Quiz Winner',
      issuer: 'Unstop',
      issueDate: 'February 2025',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/unstop/Engineering_February_series_quiz win.jpg',
      category: 'Achievements',
      published: true,
      displayOrder: 10,
    },
    {
      title: 'Unstop Talent Park Winner',
      issuer: 'Unstop',
      issueDate: '2025',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/unstop/unstop talent park 2025 win.jpg',
      category: 'Achievements',
      published: true,
      displayOrder: 11,
    },
    {
      title: 'Weekly Coding Challenge Winner',
      issuer: 'Unstop',
      issueDate: '2025',
      credentialUrl: '',
      fileUrl: '/uploads/certificates/unstop/weekly coding win.jpg',
      category: 'Achievements',
      published: true,
      displayOrder: 12,
    },
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({ data: cert });
  }
  console.log(`Seeded ${certificates.length} certificates`);

  // 9. Global Settings
  const settings = [
    { key: 'siteTitle', value: 'Tharshan R — 2026 Developer Portfolio & Architecture' },
    { key: 'metaDescription', value: 'Full-Stack Developer, AI & Data Science B.Tech (Honours). Building resilient web products and scalable software architectures.' },
    { key: 'availabilityStatus', value: 'Available for Opportunities' },
    { key: 'defaultTheme', value: 'dark' },
    { key: 'portfolioVisibility', value: 'public' },
  ];

  for (const s of settings) {
    await prisma.globalSetting.create({ data: s });
  }
  console.log('Seeded global settings');

  console.log('--- Database Seeding Finished Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
