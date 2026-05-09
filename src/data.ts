import type { SiteData } from "./types";

export const data: SiteData = {
  name: "Hector Alvarez Toledo",
  location: "Santa Maria, CA",
  email: "hect16@gmail.com",
  github: "https://github.com/clouds16",
  linkedin: "https://linkedin.com/in/hector-alvarez-toledo",

  hero: {
    all: {
      title: "Mechanical & Software Engineer",
      tagline: "Mechanical engineer turned software builder — comfortable from CAD drawings to cloud deployments.",
      stack: "TS · Inventor · AWS",
    },
    software: {
      title: "Full-Stack & DevOps Engineer",
      tagline: "Building interfaces, infrastructure, and everything in between.",
      stack: "TS · Go · AWS",
    },
    mechanical: {
      title: "Mechanical Design & Manufacturing Engineer",
      tagline: "Designing systems, optimizing processes, building things that move.",
      stack: "Inventor · AutoCAD · PLC",
    },
  },

  skills: [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "TanStack Query", "React Hook Form", "Zod", "Vite", "Chakra UI", "Framer Motion"],
      disciplines: ["software"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "Go", "Prisma", "PostgreSQL", "Redis", "REST APIs"],
      disciplines: ["software"],
    },
    {
      category: "DevOps & Cloud",
      items: ["AWS", "Docker", "Terraform", "Nginx", "GitHub Actions", "CI/CD", "Linux"],
      disciplines: ["software"],
    },
    {
      category: "Mobile & Tools",
      items: ["React Native", "Expo", "SQLite", "MSW", "Storybook", "Git"],
      disciplines: ["software"],
    },
    {
      category: "CAD & Design",
      items: ["Autodesk Inventor", "AutoCAD", "GD&T", "Mechanical Drafting", "DFM", "Tolerance Analysis"],
      disciplines: ["mechanical"],
    },
    {
      category: "Manufacturing",
      items: ["Polymer Processing", "Mold Design", "Process Optimization", "Quality Validation", "Production Engineering"],
      disciplines: ["mechanical"],
    },
    {
      category: "Controls & Embedded",
      items: ["PLC Ladder Logic", "PID Control", "HMI Design", "Sensor Instrumentation", "DAQ Systems"],
      disciplines: ["mechanical"],
    },
    {
      category: "Analysis & Tools",
      items: ["Python (NumPy, Pandas)", "Predictive Maintenance", "GIS", "Telemetry Analysis"],
      disciplines: ["mechanical"],
    },
  ],

  experience: [
    {
      company: "SimpleAppBuilders",
      role: "Founder & Lead Engineer",
      period: "2025 — Present",
      location: "Santa Maria, CA",
      href: "https://simpleappbuilders.com",
      bullets: [
        "Founded SimpleAppBuilders.com, a custom software studio delivering production-grade web applications for small businesses and startups.",
        "Architected a reusable multi-tenant platform on React Router v7, Prisma, PostgreSQL, and Redis — featuring role-based access control, WebSocket notifications, S3 file storage, transactional email, and Twilio SMS.",
        "Designed the UI system on Chakra UI and Tailwind, with a Dockerized local stack (Postgres, Redis, MailHog, MinIO) so client engagements bootstrap in minutes.",
        "Run the full delivery cycle — discovery, design, implementation, AWS deployment via Terraform + Docker + GitHub Actions, and ongoing maintenance.",
      ],
      disciplines: ["software"],
    },
    {
      company: "Jayler Pitch Inc",
      role: "Software & Controls Engineer",
      period: "Aug 2025 — Present",
      location: "Ventura, CA",
      bullets: [
        "Consulting on infrastructure and DevOps deployment strategies, advising on scalable and maintainable cloud architecture for production environments.",
        "Programming and maintaining industrial control systems using PLC ladder logic, supporting automation workflows across client operations.",
        "Performing server maintenance and system administration tasks, ensuring uptime, reliability, and operational continuity.",
      ],
      disciplines: ["software", "mechanical"],
    },
    {
      company: "Vultr",
      role: "Frontend Engineer",
      period: "Oct 2024 — Dec 2025",
      location: "Remote",
      bullets: [
        "Worked within Vultr's cloud computing platform with deep exposure to virtualized compute, storage, networking infrastructure, DNS management, and load balancing systems.",
        "Modernized the product from a legacy PHP/Twig stack to a contemporary React-based architecture, improving performance and maintainability.",
        "Collaborated with platform and DevOps teams on CI/CD processes, internal tooling, and cloud infrastructure workflows across a large-scale production environment.",
        "Applied Linux systems knowledge and shell scripting in day-to-day development and debugging within a cloud-native engineering environment.",
      ],
      disciplines: ["software"],
    },
    {
      company: "CASE-X",
      role: "Software Engineering Consultant",
      period: "Jun 2024 — Oct 2024",
      location: "Remote",
      bullets: [
        "Implemented and maintained high-quality UI changes using EJS templates, collaborating with product and design teams to deliver reusable components.",
        "Developed and maintained scalable Node.js services and APIs, enhancing endpoint responses and optimizing server-side logic for high performance.",
        "Designed, built, and maintained CI/CD pipelines for seamless deployment; automated release cycles and reduced manual overhead.",
        "Provisioned and managed AWS servers and MySQL databases, overseeing backups, restore procedures, and security best practices.",
      ],
      disciplines: ["software"],
    },
    {
      company: "Studylog Systems, Inc",
      role: "Full Stack Web Engineer",
      period: "Apr 2022 — Jun 2024",
      location: "Remote",
      bullets: [
        "Designed relational database schemas and backend services, improving SQL query performance by over 50% on multi-million-record tables.",
        "Built interactive data analytics dashboards using React, Next.js, and GraphQL (Prisma/Nest stack) to surface key operational metrics.",
        "Managed cloud infrastructure and CI/CD pipelines using Terraform, AWS (EC2, S3, Lambda), and Docker for reliable and repeatable deployments.",
        "Integrated REST and GraphQL APIs across services; leveraged Express.js and Socket.io for real-time application features.",
      ],
      disciplines: ["software"],
    },
    {
      company: "North American Fire Hose",
      role: "Design & Project Engineer",
      period: "Mar 2019 — Apr 2021",
      location: "Santa Maria, CA",
      bullets: [
        "Owned the full mechanical design lifecycle in Autodesk Inventor and AutoCAD — from concept and drafting through prototyping, mold construction, and quality validation per GD&T standards.",
        "Programmed and maintained industrial machines using PLC ladder logic; designed and deployed HMI interfaces for operator control of manufacturing equipment.",
        "Developed and tuned PID control loops for automated machine systems, leveraging real-time sensor data to improve output consistency.",
        "Instrumented production equipment with sensors and DAQ systems; analyzed telemetry using Python (NumPy, Pandas) to build predictive maintenance models.",
        "Applied data-driven process improvement to polymer manufacturing workflows, achieving a 12%+ increase in production output.",
      ],
      disciplines: ["mechanical"],
    },
    {
      company: "City of Santa Barbara",
      role: "Engineering Technician",
      period: "Jun 2015 — Sep 2016",
      location: "Santa Barbara, CA",
      bullets: [
        "Digitized electrical engineering drawings for the Waste Water Treatment plant via AutoCAD, updating records with current infrastructure details.",
        "Contributed to design proposals for the Santa Barbara Desalination plant addition.",
        "Led design of a proposal for a $5M FOG odor control project at the Waste Water Treatment plant.",
        "Used GIS software to schedule and coordinate maintenance of city water and wastewater pipe systems.",
      ],
      disciplines: ["mechanical"],
    },
  ],

  // To add a preview image to a project, drop a file into `public/projects/`
  // (e.g. public/projects/casex.png) and set `image: "/projects/casex.png"`.
  // Leave undefined to show the gradient placeholder.
  projects: [
    {
      name: "CaseX",
      desc: "Full ground-up rebuild of a medical case management platform. 300+ hours. React, TypeScript, Node.js, PostgreSQL.",
      tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      color: "#00ff88",
      disciplines: ["software"],
      // image: "/projects/casex.png",
    },
    {
      name: "PillPal",
      desc: "React Native medication tracker with push notifications, SQLite local storage, and RevenueCat subscription management.",
      tags: ["React Native", "Expo", "SQLite", "RevenueCat"],
      color: "#00d4ff",
      disciplines: ["software"],
      // image: "/projects/pillpal.png",
    },
    {
      name: "Portfolio Tracker CLI",
      desc: "Terminal-based stock portfolio tracker built in Go using the Bubble Tea TUI framework with live Finnhub API data.",
      tags: ["Go", "Bubble Tea", "Finnhub API", "TUI"],
      color: "#ff6b6b",
      disciplines: ["software"],
      // image: "/projects/portfolio-tracker.png",
    },
    {
      name: "AdminPortal",
      desc: "Next.js admin template with Prisma, PostgreSQL, Redis, React Hook Form + Zod, and full App Router architecture.",
      tags: ["Next.js", "Prisma", "Redis", "PostgreSQL"],
      color: "#a78bfa",
      disciplines: ["software"],
      // image: "/projects/admin-portal.png",
    },
    {
      name: "Polymer Process Optimization",
      desc: "Re-tuned a fire-hose extrusion line using sensor telemetry analyzed in Python; delivered a 12%+ throughput gain without capital expenditure.",
      tags: ["Process Engineering", "Python", "DAQ", "Manufacturing"],
      color: "#00ff88",
      disciplines: ["mechanical"],
      // image: "/projects/polymer-process.jpg",
      // cadEmbed: "https://sketchfab.com/models/<hash>/embed?ui_theme=dark&autostart=1",
    },
    {
      name: "Predictive Maintenance Pipeline",
      desc: "Instrumented production machines with sensors, streamed telemetry into a Pandas/NumPy pipeline, and surfaced early warning signals for failure modes.",
      tags: ["Sensors", "DAQ", "Pandas", "Reliability"],
      color: "#00d4ff",
      disciplines: ["mechanical"],
      // image: "/projects/predictive-maintenance.jpg",
    },
    {
      name: "PLC + HMI Machine Control",
      desc: "Designed ladder-logic programs and operator HMIs for fire-hose manufacturing equipment; tuned PID loops on real-time sensor input for output consistency.",
      tags: ["PLC", "HMI", "PID", "Ladder Logic"],
      color: "#ff6b6b",
      disciplines: ["mechanical"],
      // image: "/projects/plc-hmi.jpg",
    },
    {
      name: "FOG Odor Control Proposal",
      desc: "Led design of a $5M fats-oils-grease odor control proposal at the Santa Barbara Waste Water Treatment plant — full layout and AutoCAD drawing package.",
      tags: ["AutoCAD", "Civil/Mech", "Proposal", "Wastewater"],
      color: "#a78bfa",
      disciplines: ["mechanical"],
      // image: "/projects/fog-odor-control.jpg",
    },
  ],

  education: [
    {
      school: "Maryville University of Saint Louis",
      degree: "M.S. Software Development",
      period: "Graduated 2021",
      location: "Saint Louis, MO",
    },
    {
      school: "University of California, Irvine",
      degree: "B.S. Mechanical Engineering",
      location: "Irvine, CA",
      highlights: [
        "Volunteer tutor with SHPE UCI (Society of Hispanic Professional Engineers), 2015–2017",
        "Coursework spanning thermodynamics, dynamics, controls, materials, and machine design",
      ],
    },
    {
      school: "Santa Barbara City College",
      degree: "A.S. Math, Engineering, Physics & Liberal Arts",
      location: "Santa Barbara, CA",
    },
  ],
};
