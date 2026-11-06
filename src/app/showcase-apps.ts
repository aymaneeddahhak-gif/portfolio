export interface AppFeature {
  id: string;
  name: string;
  detail: string;
}

export interface ShowcaseApp {
  id: "a-task" | "a-store" | (string & {});
  platformFilter: "all" | "web" | "mobile";
  rankLabel: string;
  namePart1: string;
  namePart2: string;
  shortName: string;
  category: string;
  platform: string;
  videoUrl: string; // Commerce/promo video (empty while awaiting user generation)
  livePreviewVideoUrl?: string; // Live preview walkthrough shown when clicking "View App"
  livePreviewType?: "video" | "interactive";
  ambientColor: string;
  accentColor: string;
  description: string;
  price: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
  features: AppFeature[];
  tags: string[];
}

export const SHOWCASE_APPS: ShowcaseApp[] = [
  {
    id: "a-task",
    platformFilter: "mobile",
    rankLabel: "MOBILE APP",
    namePart1: "A-",
    namePart2: "TASK",
    shortName: "A-Task",
    category: "TASK MANAGEMENT APP",
    platform: "Android · iOS",
    videoUrl: "/videos/atask_showcase.webm",
    livePreviewType: "interactive",
    ambientColor: "rgba(147, 51, 234, 0.35)",
    accentColor: "#9333EA",
    description:
      "A task management mobile application built for streamlined productivity, smart task prioritization, categorization, and offline daily workflows.",
    price: "Flutter · Cross-platform",
    techStack: "Flutter • React Native • Firebase • Android • iOS",
    githubUrl: "https://github.com/aymaneeddahhak-gif/A-Task",
    liveUrl: "/a-task",
    features: [
      {
        id: "f1",
        name: "Smart Task Prioritization",
        detail: "Organize, tag, and filter high-priority daily milestones",
      },
      {
        id: "f2",
        name: "Offline-First Sync",
        detail: "Manage and update tasks with seamless cloud synchronization",
      },
      {
        id: "f3",
        name: "Cross-Platform",
        detail: "One codebase, native performance on Android and iOS",
      },
      {
        id: "f4",
        name: "Firebase Backend",
        detail: "Real-time updates, secure auth, and cloud storage",
      },
    ],
    tags: ["Flutter", "Mobile", "Firebase", "Productivity"],
  },
  {
    id: "a-store",
    platformFilter: "web",
    rankLabel: "WEB APP",
    namePart1: "A-",
    namePart2: "STORE",
    shortName: "A-Store",
    category: "E-COMMERCE APP",
    platform: "Responsive Web",
    // Empty: reserved for official commerce video to be generated later
    videoUrl: "",
    livePreviewVideoUrl: "/videos/website.mp4",
    livePreviewType: "video",
    ambientColor: "rgba(37, 99, 235, 0.32)",
    accentColor: "#2563EB",
    description:
      "The A-Store commerce build — catalogue discovery, product detail views, reviews, shopping guidance, related products and a focused cart-to-checkout journey.",
    price: "Next.js · Full-stack",
    techStack: "React • Next.js • TypeScript • Laravel • Node.js",
    githubUrl: "https://github.com/aymaneeddahhak-gif/A-store",
    liveUrl: "https://github.com/aymaneeddahhak-gif/A-store",
    features: [
      {
        id: "f1",
        name: "Catalogue & Search",
        detail: "Fast product discovery with filtering and related items",
      },
      {
        id: "f2",
        name: "Cart & Checkout",
        detail: "Focused purchase journey from cart to confirmation",
      },
      {
        id: "f3",
        name: "Reviews & Guidance",
        detail: "Social proof and shopping guidance built into the flow",
      },
      {
        id: "f4",
        name: "Clean Architecture",
        detail: "TypeScript front of house, Laravel API behind it",
      },
    ],
    tags: ["Next.js", "A-Store", "TypeScript", "Laravel"],
  },
];
