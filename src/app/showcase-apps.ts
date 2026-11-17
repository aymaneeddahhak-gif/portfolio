export interface AppFeature {
  id: string;
  name: string;
  detail: string;
}

export interface ShowcaseApp {
  id: "a-task" | "a-store" | (string & {});
  platformFilter: "all" | "web" | "mobile";
  rankLabel: string;
  rankLabelFr: string;
  namePart1: string;
  namePart2: string;
  shortName: string;
  category: string;
  categoryFr: string;
  platform: string;
  videoUrl: string; // Commerce/promo video (empty while awaiting user generation)
  livePreviewVideoUrl?: string; // Live preview walkthrough shown when clicking "View App"
  livePreviewType?: "video" | "interactive";
  ambientColor: string;
  accentColor: string;
  description: string;
  descriptionFr: string;
  price: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
  features: AppFeature[];
  featuresFr: AppFeature[];
  tags: string[];
}

export const SHOWCASE_APPS: ShowcaseApp[] = [
  {
    id: "a-task",
    platformFilter: "mobile",
    rankLabel: "MOBILE APP",
    rankLabelFr: "APP MOBILE",
    namePart1: "A-",
    namePart2: "TASK",
    shortName: "A-Task",
    category: "TASK MANAGEMENT APP",
    categoryFr: "GESTION DE TÂCHES",
    platform: "Android · iOS",
    videoUrl: "/videos/atask_showcase.webm",
    livePreviewType: "interactive",
    ambientColor: "rgba(147, 51, 234, 0.35)",
    accentColor: "#9333EA",
    description:
      "Offline-first cross-platform task engine engineered in Flutter & Firebase — delivering optimistic local writes, conflict-safe cloud sync, and 60 FPS gesture workflows across Android and iOS.",
    descriptionFr:
      "Moteur de gestion de tâches multiplateforme hors-ligne conçu avec Flutter & Firebase — écriture locale instantanée, synchronisation cloud sans conflit et gestes fluides à 60 FPS sur Android et iOS.",
    price: "Flutter · Cross-platform",
    techStack: "Flutter • Firebase • REST API • GitHub",
    githubUrl: "https://github.com/aymaneeddahhak-gif/A-Task",
    liveUrl: "/a-task",
    features: [
      {
        id: "f1",
        name: "Smart Prioritization",
        detail: "Tag, filter, and sequence high-impact daily milestones with zero lag",
      },
      {
        id: "f2",
        name: "Offline-First Sync",
        detail: "Optimistic local state with automatic cloud reconciliation on reconnect",
      },
      {
        id: "f3",
        name: "Single Dart Codebase",
        detail: "Compiled to native ARM code for consistent 60 FPS Android & iOS UX",
      },
      {
        id: "f4",
        name: "Firebase Realtime",
        detail: "Authenticated user sessions, live listeners, and secure cloud persistence",
      },
    ],
    featuresFr: [
      {
        id: "f1",
        name: "Priorisation Intelligente",
        detail: "Filtrage et organisation instantanée des objectifs quotidiens prioritaires",
      },
      {
        id: "f2",
        name: "Synchro Hors-Ligne",
        detail: "État local optimiste avec réconciliation cloud automatique à la reconnexion",
      },
      {
        id: "f3",
        name: "Codebase Unique Dart",
        detail: "Compilation ARM native offrant une fluidité 60 FPS sur Android et iOS",
      },
      {
        id: "f4",
        name: "Firebase Temps Réel",
        detail: "Sessions authentifiées, écouteurs temps réel et stockage cloud sécurisé",
      },
    ],
    tags: ["Flutter", "Dart", "Firebase", "Productivity"],
  },
  {
    id: "a-store",
    platformFilter: "web",
    rankLabel: "WEB APP",
    rankLabelFr: "APP WEB",
    namePart1: "A-",
    namePart2: "STORE",
    shortName: "A-Store",
    category: "E-COMMERCE APP",
    categoryFr: "PLATEFORME E-COMMERCE",
    platform: "Responsive Web",
    // Empty: reserved for official commerce video to be generated later
    videoUrl: "",
    livePreviewVideoUrl: "/videos/website.mp4",
    livePreviewType: "video",
    ambientColor: "rgba(37, 99, 235, 0.32)",
    accentColor: "#2563EB",
    description:
      "Headless e-commerce platform engineered with Next.js App Router and a decoupled Laravel REST API — eliminating full-page filter reloads and streamlining cart-to-checkout conversion.",
    descriptionFr:
      "Plateforme e-commerce headless conçue avec Next.js App Router et une API REST Laravel découplée — éliminant les rechargements lents du catalogue et accélérant le tunnel panier-paiement.",
    price: "Next.js · Laravel API",
    techStack: "Next.js • React • Laravel • REST API",
    githubUrl: "https://github.com/aymaneeddahhak-gif/A-store",
    liveUrl: "",
    features: [
      {
        id: "f1",
        name: "Instant Catalogue",
        detail: "Sub-200ms faceted filtering, search, and related product discovery",
      },
      {
        id: "f2",
        name: "Frictionless Checkout",
        detail: "Optimistic cart updates and a streamlined multi-step purchase flow",
      },
      {
        id: "f3",
        name: "Verified Social Proof",
        detail: "Integrated ratings, buyer reviews, and guided sizing/product specs",
      },
      {
        id: "f4",
        name: "Decoupled API",
        detail: "Typed Next.js storefront backed by Laravel Eloquent & REST contracts",
      },
    ],
    featuresFr: [
      {
        id: "f1",
        name: "Catalogue Instantané",
        detail: "Filtrage à facettes sous 200ms, recherche rapide et produits associés",
      },
      {
        id: "f2",
        name: "Paiement Sans Friction",
        detail: "Panier optimiste et tunnel de commande réduit pour maximiser la conversion",
      },
      {
        id: "f3",
        name: "Preuve Sociale",
        detail: "Avis clients vérifiés, notations et guide d'achat intégré au parcours",
      },
      {
        id: "f4",
        name: "API Découplée",
        detail: "Interface Next.js typée propulsée par Laravel Eloquent et contrats REST",
      },
    ],
    tags: ["Next.js", "React", "TypeScript", "Laravel"],
  },
];
