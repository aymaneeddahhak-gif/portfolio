export interface AppFeature {
  id: string;
  name: string;
  detail: string;
}

export interface ShowcaseApp {
  id: "estate-elite" | "a-store" | (string & {});
  platformFilter: "all" | "web" | "mobile";
  rankLabel: string;
  namePart1: string;
  namePart2: string;
  shortName: string;
  category: string;
  platform: string;
  videoUrl: string;
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
    id: "estate-elite",
    platformFilter: "mobile",
    rankLabel: "Mobile App",
    namePart1: "ESTATE",
    namePart2: "ELITE",
    shortName: "Estate Elite",
    category: "Real Estate Mobile App",
    platform: "Android · iOS",
    videoUrl: "/videos/mobileapp.mp4",
    ambientColor: "rgba(147, 51, 234, 0.35)",
    accentColor: "#9333EA",
    description:
      "A mobile property experience for discovering curated stays, filtering destinations, saving listings, reviewing property details, and moving smoothly into a booking flow.",
    price: "Flutter · Cross-platform",
    techStack: "Flutter • React Native • Firebase • Android • iOS",
    githubUrl: "https://github.com/aymaneeddahhak-gif",
    liveUrl: "#contact",
    features: [
      {
        id: "f1",
        name: "Curated Discovery",
        detail: "Filter destinations and save favourite listings instantly",
      },
      {
        id: "f2",
        name: "Smooth Booking Flow",
        detail: "Property details to reservation without friction",
      },
      {
        id: "f3",
        name: "Cross-Platform",
        detail: "One codebase, native feel on Android and iOS",
      },
      {
        id: "f4",
        name: "Firebase Backend",
        detail: "Auth, storage and realtime data out of the box",
      },
    ],
    tags: ["Flutter", "Mobile", "Firebase", "Real Estate"],
  },
  {
    id: "a-store",
    platformFilter: "web",
    rankLabel: "Web App",
    namePart1: "A",
    namePart2: "STORE",
    shortName: "A-STORE",
    category: "E-Commerce Web App",
    platform: "Responsive Web",
    videoUrl: "/videos/website.mp4",
    ambientColor: "rgba(37, 99, 235, 0.32)",
    accentColor: "#2563EB",
    description:
      "The A-STORE commerce build — catalogue discovery, product detail views, reviews, shopping guidance, related products and a focused cart-to-checkout journey, shaped around the problems real shoppers actually run into.",
    price: "Next.js · Full-stack",
    techStack: "React • Next.js • TypeScript • Laravel • Node.js",
    githubUrl: "https://github.com/aymaneeddahhak-gif/A-store",
    liveUrl: "#contact",
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
    tags: ["Next.js", "A-STORE", "TypeScript", "Laravel"],
  },
];
