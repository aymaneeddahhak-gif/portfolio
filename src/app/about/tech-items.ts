import type { TechItem, TechTrack } from "./types";

/** The rail's filter buttons, in the order they are shown. */
export const TECH_FILTERS: { id: TechTrack | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "language", label: "Languages" },
  { id: "web", label: "Web & UI" },
  { id: "mobile", label: "Mobile" },
  { id: "backend", label: "Backend & Data" },
  { id: "devops", label: "DevOps & Tools" },
  { id: "design", label: "Design & Architecture" },
];

// The languages and tools the portfolio actually ships with.
// Main technologies are placed first: React, Laravel, Next.js, Docker, REST API, Flutter, Supabase, GitHub, followed by all others.
export const TECH_ITEMS: TechItem[] = [
  // --- MAIN TECHNOLOGIES FIRST ---
  {
    id: "react",
    accentHue: 206,
    track: "web",
    name: "React",
    category: "UI LIBRARY",
    shortDescription:
      "Component-driven interfaces with declarative state, hooks and reusable design primitives shared across web and mobile.",
    fullDescription:
      "React is my default for interactive UI. I split products into small components with clear props and hook ownership, memoize the expensive paths, and keep state close to where it is used — which is what makes features ship fast and stay maintainable.",
    officialUrl: "https://react.dev/",
    linkDisplay: "react.dev",
    image: "/images/tech/react.webp",
    tags: ["Hooks", "Components", "Context", "Performance"],
  },
  {
    id: "laravel",
    accentHue: 1,
    track: "backend",
    name: "Laravel",
    category: "PHP FRAMEWORK",
    shortDescription:
      "An opinionated PHP framework delivering Eloquent models, queues, policies and an artisan pipeline that scales with the product.",
    fullDescription:
      "Laravel turns backend work into a well-lit path: Eloquent for the data layer, form requests and policies for validation and authorisation, queues and scheduled jobs for background work, and migrations that keep environments in sync across the team.",
    officialUrl: "https://laravel.com/",
    linkDisplay: "laravel.com",
    image: "/images/tech/laravel.webp",
    tags: ["Eloquent", "Artisan", "Queues", "Policies"],
  },
  {
    id: "nextjs",
    accentHue: 0,
    plateTone: "dark",
    track: "web",
    name: "Next.js",
    category: "REACT FRAMEWORK",
    shortDescription:
      "The production React framework: file-based routing, server components and streamed rendering, tuned out of the box.",
    fullDescription:
      "Next.js is how I ship React to production. The App Router gives every screen a file and a layout, server components let data loading happen before the browser gets involved, Suspense streams the page in pieces for a fast first paint, and image, font and bundle optimisation are the framework's job instead of mine.",
    officialUrl: "https://nextjs.org/",
    linkDisplay: "nextjs.org",
    image: "/images/tech/nextjs.webp",
    tags: ["App Router", "Server components", "SSR & SSG", "Route handlers"],
  },
  {
    id: "docker",
    accentHue: 200,
    track: "devops",
    name: "Docker",
    category: "CONTAINER PLATFORM",
    shortDescription:
      "Containerised delivery: reproducible container units, config from the environment, and pipelines that behave the same everywhere.",
    fullDescription:
      "Docker decouples application logic from host infrastructure. A lightweight container per service, secrets and config injected through the environment, health and readiness endpoints so the platform can route traffic, and a pipeline that builds the same image for every stage.",
    officialUrl: "https://www.docker.com/",
    linkDisplay: "docker.com",
    image: "/images/tech/docker.webp",
    tags: ["Docker", "Containers", "CI/CD", "Microservices"],
  },
  {
    id: "api",
    accentHue: 225,
    track: "backend",
    name: "REST API",
    category: "BACKEND INTEGRATION",
    shortDescription:
      "REST and JSON integrations treated as contracts: stable resources, versioning, token auth and predictable errors.",
    fullDescription:
      "An API is the contract between everything else I build. I design REST resources with honest verbs and status codes, version them before a client breaks, protect them with token auth and rate limits, and consume third-party services through typed clients with retries, timeouts and real error surfaces.",
    officialUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
    linkDisplay: "developer.mozilla.org",
    image: "/images/tech/api.webp",
    tags: ["REST", "JSON", "Auth tokens", "Error handling"],
  },
  {
    id: "flutter",
    accentHue: 194,
    track: "mobile",
    name: "Flutter",
    category: "MOBILE TOOLKIT",
    shortDescription:
      "One Dart codebase compiled to native Android and iOS apps, with the same pixels on both — hot reload included.",
    fullDescription:
      "Flutter is my first choice when a mobile product has to reach both stores at once. A single Dart codebase compiles to native ARM code for Android and iOS, the widget system gives me control over every pixel and gesture, and hot reload makes tuning motion fast enough to iterate frame by frame.",
    officialUrl: "https://flutter.dev/",
    linkDisplay: "flutter.dev",
    image: "/images/tech/flutter.webp",
    tags: ["Dart", "Android & iOS", "Widgets", "Hot reload"],
  },
  {
    id: "supabase",
    accentHue: 145,
    track: "backend",
    name: "Supabase",
    category: "BACKEND AS A SERVICE",
    shortDescription:
      "Postgres, auth, storage, realtime and edge functions in one managed backend so a product can launch in a single afternoon.",
    fullDescription:
      "Supabase gives a project the whole backend at once: a real Postgres database with row-level security, drop-in authentication, file storage, realtime subscriptions and edge functions — so I spend the budget on the product instead of server plumbing.",
    officialUrl: "https://supabase.com/",
    linkDisplay: "supabase.com",
    image: "/images/tech/supabase.webp",
    tags: ["Postgres", "Auth", "Realtime", "Storage"],
  },
  {
    id: "github",
    accentHue: 227,
    plateTone: "dark",
    track: "devops",
    name: "GitHub",
    category: "VERSION CONTROL & CI/CD",
    shortDescription:
      "Version control, code review and automated pipelines — the collaboration backbone of every project I ship.",
    fullDescription:
      "GitHub carries the whole delivery process: feature branches and pull requests for reviewable changes, GitHub Actions for lint, type-check, test and deploy on every push, plus issue templates and project boards that keep work visible to everyone.",
    officialUrl: "https://github.com/",
    linkDisplay: "github.com",
    image: "/images/tech/github.webp",
    tags: ["Git", "Pull requests", "GitHub Actions", "Code review"],
  },

  // --- REMAINING TECHNOLOGIES ---
  {
    id: "javascript",
    accentHue: 60,
    track: "language",
    name: "JavaScript",
    category: "PROGRAMMING LANGUAGE",
    shortDescription:
      "The language the whole stack speaks — modern ES syntax, async flows and DOM work that run natively in browsers and on Node.js.",
    fullDescription:
      "JavaScript is the connective tissue of everything I build. I work with modern ES modules, async/await, immutability and the fetch/Web API surface, keeping logic typed, side-effect free where it matters, and light enough to stay off the main thread.",
    officialUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    linkDisplay: "developer.mozilla.org",
    image: "/images/tech/javascript.webp",
    tags: ["ES2024", "Async / await", "Web APIs", "ES modules"],
  },
  {
    id: "php",
    accentHue: 235,
    track: "language",
    name: "PHP",
    category: "BACKEND LANGUAGE",
    shortDescription:
      "The server-side language behind classic and modern web backends — request handling, sessions, auth and SQL-driven business logic.",
    fullDescription:
      "PHP powers a huge share of the web I maintain and extend. I write typed PHP 8 with clear separation between controllers, services and data access — handling authentication, file uploads, payments and the server-rendered pages that keep SEO simple.",
    officialUrl: "https://www.php.net/",
    linkDisplay: "php.net",
    image: "/images/tech/php.webp",
    tags: ["PHP 8", "REST APIs", "Sessions & auth", "SQL"],
  },
  {
    id: "python",
    accentHue: 46,
    track: "language",
    name: "Python",
    category: "PROGRAMMING LANGUAGE",
    shortDescription:
      "Readable, batteries-included scripting for automation, data pipelines and the AI and machine-learning side of my stack.",
    fullDescription:
      "Python is where I automate the boring parts and wire up intelligence: scraping and ETL jobs, data analysis with pandas, and machine-learning models served through FastAPI so a trained model becomes a normal, testable HTTP service.",
    officialUrl: "https://www.python.org/",
    linkDisplay: "python.org",
    image: "/images/tech/python.webp",
    tags: ["Automation", "AI & ML", "FastAPI", "Data pipelines"],
  },
  {
    id: "html5",
    accentHue: 15,
    track: "language",
    name: "HTML5",
    category: "MARKUP LANGUAGE",
    shortDescription:
      "The semantic skeleton of every page — accessible landmarks, forms and media that both search engines and screen readers can read.",
    fullDescription:
      "HTML5 is where every interface starts. I write landmark-based, screen-reader friendly markup with native form validation, responsive media (picture, srcset and lazy loading) and structured data, so the document itself carries meaning before a single line of CSS or JavaScript runs.",
    officialUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    linkDisplay: "developer.mozilla.org",
    image: "/images/tech/html5.webp",
    tags: ["Semantics", "A11y", "SEO", "Forms"],
  },
  {
    id: "css",
    accentHue: 229,
    track: "language",
    name: "CSS3",
    category: "STYLING LANGUAGE",
    shortDescription:
      "Hand-tuned layout and motion: flexbox, grid, custom properties and keyframes that make an interface feel alive without a design tool.",
    fullDescription:
      "CSS3 gives the interface its character. I build fluid responsive layouts with grid and flexbox, theme everything through custom properties, and drive the micro-interactions — transitions, keyframes, filters and backdrop blur — with GPU-friendly transforms instead of JavaScript where possible.",
    officialUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    linkDisplay: "developer.mozilla.org",
    image: "/images/tech/css.webp",
    tags: ["Grid & Flexbox", "Animations", "Responsive", "Design tokens"],
  },
  {
    id: "tailwind",
    accentHue: 177,
    track: "web",
    name: "Tailwind CSS",
    category: "UTILITY-FIRST CSS",
    shortDescription:
      "A constraint-driven styling system where spacing, colour and breakpoints live next to the markup they belong to.",
    fullDescription:
      "Tailwind is how most of this portfolio is styled. Design tokens live in the config, breakpoints are enforced by the utility classes, and the production build ships only the classes actually used — with zero dead CSS and no naming debates.",
    officialUrl: "https://tailwindcss.com/",
    linkDisplay: "tailwindcss.com",
    image: "/images/tech/tailwind.webp",
    tags: ["Design tokens", "Purged builds", "Dark mode", "Responsive"],
  },
  {
    id: "bootstrap",
    accentHue: 263,
    track: "web",
    name: "Bootstrap",
    category: "CSS FRAMEWORK",
    shortDescription:
      "A battle-tested 12-column grid and component kit for launching consistent, responsive interfaces quickly and predictably.",
    fullDescription:
      "When a project needs to move fast with a team, Bootstrap's grid, utility and component system keeps every screen consistent — plus accessible modals, dropdowns and form controls that behave the same in every browser without reinventing them.",
    officialUrl: "https://getbootstrap.com/",
    linkDisplay: "getbootstrap.com",
    image: "/images/tech/bootstrap.webp",
    tags: ["Grid system", "Components", "Rapid UI", "Cross-browser"],
  },
  {
    id: "mysql",
    accentHue: 197,
    track: "backend",
    name: "MySQL",
    category: "RELATIONAL DATABASE",
    shortDescription:
      "Relational storage with normalised schemas, indexing and transactions — the dependable core of most production backends.",
    fullDescription:
      "MySQL holds the structured side of my projects. I design normalised schemas, add the indexes that keep queries fast as data grows, and lean on transactions and foreign keys so integrity survives concurrency and traffic spikes.",
    officialUrl: "https://www.mysql.com/",
    linkDisplay: "mysql.com",
    image: "/images/tech/mysql.webp",
    tags: ["Schema design", "Indexing", "Transactions", "Relations"],
  },
  {
    id: "mongodb",
    accentHue: 106,
    track: "backend",
    name: "MongoDB",
    category: "DOCUMENT DATABASE",
    shortDescription:
      "Flexible document storage for content, catalogues and event data that refuse to fit into rigid tables.",
    fullDescription:
      "MongoDB shines when the shape of the data keeps evolving. I model documents around how the app actually reads them, use aggregation pipelines for reporting, and index embedded fields so flexible data stays fast.",
    officialUrl: "https://www.mongodb.com/",
    linkDisplay: "mongodb.com",
    image: "/images/tech/mongodb.webp",
    tags: ["Documents", "Aggregation", "Flexible schema", "Indexes"],
  },
  {
    id: "git",
    accentHue: 11,
    track: "devops",
    name: "Git",
    category: "VERSION CONTROL",
    shortDescription:
      "Branching, rebasing and history hygiene — small reviewable changes instead of one giant commit at the end.",
    fullDescription:
      "Git is the tool I touch every hour: short-lived branches per feature, commits that explain the why, interactive rebase to keep the log readable, and conflicts settled before review rather than during a release — so any single change can be cherry-picked or reverted with confidence.",
    officialUrl: "https://git-scm.com/",
    linkDisplay: "git-scm.com",
    image: "/images/tech/git.webp",
    tags: ["Branching", "Rebase", "Merging", "Tags & releases"],
  },
  {
    id: "gitlab",
    accentHue: 25,
    track: "devops",
    name: "GitLab",
    category: "DEVOPS PLATFORM",
    shortDescription:
      "Repositories, merge requests and pipelines in one platform — including on infrastructure the client owns.",
    fullDescription:
      "GitLab keeps the entire loop in one place: repositories with protected branches, merge requests that gate on review and green pipelines, and CI/CD jobs declared in the same repo as the code — runnable on GitLab.com or on the client's own servers when compliance demands it.",
    officialUrl: "https://about.gitlab.com/",
    linkDisplay: "about.gitlab.com",
    image: "/images/tech/gitlab.webp",
    tags: ["Merge requests", "CI pipelines", "Protected branches", "Self-hosting"],
  },
  {
    id: "cloud-native",
    accentHue: 212,
    track: "devops",
    name: "Cloud Native",
    category: "CLOUD INFRASTRUCTURE",
    shortDescription:
      "Resilient cloud-native systems: container orchestration, microservices architecture, and scalable serverless backends.",
    fullDescription:
      "Cloud Native architecture designs applications for continuous delivery and distributed resilience. From container orchestration and microservice separation to cloud storage, edge deployments, and observability pipelines that keep modern products scalable and fault-tolerant.",
    officialUrl: "https://www.cncf.io/",
    linkDisplay: "cncf.io",
    image: "/images/tech/cloud-native.webp",
    tags: ["Kubernetes", "Microservices", "Containers", "DevOps"],
  },
  {
    id: "wordpress",
    accentHue: 202,
    track: "web",
    name: "WordPress",
    category: "CONTENT MANAGEMENT",
    shortDescription:
      "The CMS most clients already know — custom themes, plugin-free blocks, and delivery of a fully editable marketing site.",
    fullDescription:
      "For content-heavy sites, WordPress lets the client own their copy after launch. I build custom themes and blocks, harden the install, keep it fast with caching and image pipelines, and expose only the parts an editor actually needs.",
    officialUrl: "https://wordpress.org/",
    linkDisplay: "wordpress.org",
    image: "/images/tech/wordpress.webp",
    tags: ["Custom themes", "Blocks", "SEO", "Client editing"],
  },
  {
    id: "figma",
    accentHue: 22,
    track: "design",
    name: "Figma",
    category: "UI / UX DESIGN",
    shortDescription:
      "Interface design, clickable prototypes and shared design tokens handed straight over for implementation.",
    fullDescription:
      "Figma is where the interface is designed and agreed on: responsive breakpoints, component variants, auto-layout and interactive prototypes for stakeholder sign-off — then exported as tokens and specs so the build matches the design pixel for pixel.",
    officialUrl: "https://www.figma.com/",
    linkDisplay: "figma.com",
    image: "/images/tech/figma.webp",
    tags: ["Prototyping", "Design system", "Auto-layout", "Handoff"],
  },
  {
    id: "oop",
    accentHue: 35,
    track: "design",
    name: "OOP",
    category: "PROGRAMMING PARADIGM",
    shortDescription:
      "Object-oriented design — encapsulation, inheritance and polymorphism — for codebases that stay readable as they grow.",
    fullDescription:
      "Object-oriented programming is how I keep large systems honest: cohesive classes with single responsibilities, interfaces for anything that will change, and dependency injection instead of hard-wired coupling — so features are added by extension rather than by editing the core.",
    officialUrl:
      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming",
    linkDisplay: "developer.mozilla.org",
    image: "/images/tech/oop.webp",
    tags: ["Encapsulation", "Polymorphism", "SOLID", "Dependency injection"],
  },
  {
    id: "uml",
    accentHue: 227,
    track: "design",
    name: "UML",
    category: "SYSTEM DESIGN",
    shortDescription:
      "Diagrams that settle arguments before they reach the code: class, sequence and use-case models of the whole system.",
    fullDescription:
      "Every project starts on a whiteboard. UML class, sequence and use-case diagrams let me agree on the entities, their relationships and the flow of a feature with the client and the team before writing the first file — which removes the most expensive kind of rework.",
    officialUrl: "https://www.uml.org/",
    linkDisplay: "uml.org",
    image: "/images/tech/uml.webp",
    tags: ["Class diagrams", "Sequence diagrams", "Architecture", "Modelling"],
  },
  {
    id: "jira",
    accentHue: 216,
    track: "devops",
    name: "Jira",
    category: "PROJECT MANAGEMENT",
    shortDescription:
      "Sprints, backlogs and burn-downs that turn a roadmap into a predictable, tracked delivery cycle with the client.",
    fullDescription:
      "Jira keeps delivery honest: a groomed backlog, estimated stories, sprint boards, and burn-downs that show whether the next milestone is actually reachable. It is how scope stays agreed instead of drifting mid-sprint.",
    officialUrl: "https://www.atlassian.com/software/jira",
    linkDisplay: "atlassian.com/software/jira",
    image: "/images/tech/jira.webp",
    tags: ["Agile sprints", "Backlog", "Burn-down", "Tracking"],
  },
  {
    id: "agile",
    accentHue: 35,
    track: "devops",
    name: "Agile",
    category: "DELIVERY PROCESS",
    shortDescription:
      "Short sprints, a prioritised backlog and a demo at the end of each one — plans that adapt instead of drifting.",
    fullDescription:
      "I work in short iterations with the client in the room: a groomed backlog, estimated stories, a working demo at the end of every sprint and a retro that fixes the process. Scope, pace and risk stay visible week to week, so the plan changes deliberately instead of silently.",
    officialUrl: "https://www.atlassian.com/agile",
    linkDisplay: "atlassian.com/agile",
    image: "/images/tech/agile.webp",
    tags: ["Scrum", "Sprints", "Retrospectives", "Demo driven"],
  },
];
