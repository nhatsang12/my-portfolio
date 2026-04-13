export const PROJECTS = [
  {
    name: "Event Ticketing Platform",
    period: "Feb 2026 – Apr 2026",
    team: "Team size 3 | Role: Full Stack Developer",
    status: "Built",
    tech: ["React 19", "React Router", "Tailwind CSS", "Axios", "Zustand", "REST API", "Node.js"],
    bullets: [
      "Architected a React 19 SPA with centralised Axios interceptors, reducing duplicated API-handling code across 10+ endpoints",
      "Built role-based routing with protected routes and admin dashboard layout, enabling separate user flows for 2 distinct roles",
      "Integrated Stripe (international) and PayOS (VietQR/MoMo), covering both foreign and domestic payment methods in one checkout flow",
      "Deployed to Vercel via Vite 7 with zero-downtime production release",
    ],
    github: "https://github.com/nhatsang12/EventTicketMangement",
    demo: "https://event-ticket-mangement-8s3y.vercel.app/",
  },
  {
    name: "Estoria Platform",
    period: "Mar 2026 – Present",
    team: "Team size 2 | Role: Frontend Developer",
    status: "In Progress",
    tech: ["Next.js 16", "TypeScript", "Tailwind 4", "Recharts", "i18next", "Zod", "Node.js"],
    bullets: [
      "Implemented SSR with Next.js to improve first-paint speed and enable search-engine indexing for property listings",
      "Integrated interactive Leaflet maps with address autocomplete, shortening the property search flow for end users",
      "Built multi-step property submission form with React Hook Form, drag-and-drop image upload and real-time validation via Zod",
      "Added i18next multilingual support, making the platform accessible to both Vietnamese and English-speaking users",
    ],
    github: "https://github.com/nhatsang12/Estate",
    demo: "https://frontend-tan-theta-82.vercel.app/",
  },
];
