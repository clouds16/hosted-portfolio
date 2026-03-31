export const data = {
  name: "Hector Alvarez Toledo",
  title: "Full-Stack & DevOps Engineer",
  tagline: "Building interfaces, infrastructure, and everything in between.",
  location: "Santa Maria, CA",
  email: "hector@example.com",
  github: "https://github.com/hectoralvarez",
  linkedin: "https://linkedin.com/in/hectoralvarez",

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
      company: "Vultr",
      role: "Front End Engineer",
      period: "Oct 2024 — Present",
      location: "Remote",
      bullets: [
        "Built a complex load balancer management UI supporting multi-region configs, SSL certificates, forwarding/firewall rules, and VPC networking.",
        "Implemented global parent-child load balancer hierarchies with real-time state sync via TanStack Query.",
        "Established component library with shadcn/ui, HeroUI, MSW mocking, and Storybook documentation.",
        "Authored custom hooks for clean separation of concerns across large feature surfaces.",
      ],
    },
    {
      company: "North American Fire Hose",
      role: "Mechanical / Controls Engineer",
      period: "2019 — 2024",
      location: "On-site",
      bullets: [
        "Programmed Allen-Bradley PLCs for automated hose manufacturing lines using ladder logic and function block diagrams.",
        "Designed and tuned PID control loops for tension and speed regulation, reducing waste by ~12%.",
        "Built HMI screens for production monitoring and fault diagnostics using FactoryTalk View.",
        "Created detailed CAD drawings and mechanical assemblies in Autodesk Inventor and AutoCAD.",
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
