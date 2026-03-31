export const data = {
  name: "Hector Alvarez Toledo",
  title: "Full-Stack & DevOps Engineer",
  tagline: "Building interfaces, infrastructure, and everything in between.",
  location: "Santa Maria, CA",
  email: "hect16@gmail.com",
  github: "https://github.com/clouds16",
  linkedin: "https://linkedin.com/in/hector-alvarez-toledo",

  skills: [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "TanStack Query", "React Hook Form", "Zod", "Vite", "shadcn/ui", "Framer Motion"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "Go", "Prisma", "PostgreSQL", "Redis", "REST APIs"],
    },
    {
      category: "DevOps & Cloud",
      items: ["AWS", "Docker", "Terraform", "Nginx", "GitHub Actions", "CI/CD", "Linux (Pop!_OS)"],
    },
    {
      category: "Mobile & Tools",
      items: ["React Native", "Expo", "SQLite", "MSW", "Storybook", "Git"],
    },
    {
      category: "Controls & Embedded",
      items: ["PLC Programming", "PID Control", "HMI Design", "AutoCAD", "Inventor", "Sensor Instrumentation"],
    },
  ],

  experience: [
    {
      company: "Jayler Pitch Inc",
      role: "Software Engineer",
      period: "Aug 2025 — Present",
      location: "Ventura, CA",
      bullets: [
        "Consulting on infrastructure and DevOps deployment strategies, advising on scalable and maintainable cloud architecture for production environments.",
        "Programming and maintaining industrial control systems using PLC ladder logic, supporting automation workflows across client operations.",
        "Performing server maintenance and system administration tasks, ensuring uptime, reliability, and operational continuity.",
      ],
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
    },
    {
      company: "North American Fire Hose",
      role: "Manufacturing Engineer & Project Manager",
      period: "Mar 2019 — Apr 2021",
      location: "Santa Maria, CA",
      bullets: [
        "Programmed and maintained industrial machines using PLC ladder logic; designed and deployed HMI interfaces for operator control of manufacturing equipment.",
        "Developed and tuned PID control loops for automated machine systems, leveraging real-time sensor data to improve output consistency.",
        "Instrumented production equipment with sensors and DAQ systems; analyzed telemetry using Python (NumPy, Pandas) to build predictive maintenance models.",
        "Managed full product lifecycle in Autodesk Inventor and AutoCAD — concept through prototyping, mold construction, and quality validation per GD&T standards.",
        "Applied data-driven process improvement to polymer manufacturing workflows, achieving a 12%+ increase in production output.",
      ],
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
    },
  ],

  projects: [
    {
      name: "CaseX",
      desc: "Full ground-up rebuild of a medical case management platform. 300+ hours. React, TypeScript, Node.js, PostgreSQL.",
      tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      color: "#00ff88",
    },
    {
      name: "PillPal",
      desc: "React Native medication tracker with push notifications, SQLite local storage, and RevenueCat subscription management.",
      tags: ["React Native", "Expo", "SQLite", "RevenueCat"],
      color: "#00d4ff",
    },
    {
      name: "Portfolio Tracker CLI",
      desc: "Terminal-based stock portfolio tracker built in Go using the Bubble Tea TUI framework with live Finnhub API data.",
      tags: ["Go", "Bubble Tea", "Finnhub API", "TUI"],
      color: "#ff6b6b",
    },
    {
      name: "AdminPortal",
      desc: "Next.js admin template with Prisma, PostgreSQL, Redis, React Hook Form + Zod, and full App Router architecture.",
      tags: ["Next.js", "Prisma", "Redis", "PostgreSQL"],
      color: "#a78bfa",
    },
  ],
};