export type Language = "en" | "fr";

export interface Translations {
  boot: {
    skip: string;
  };
  nav: {
    projects: string;
    about: string;
    contact: string;
    resume: string;
    previewResume: string;
    downloadResume: string;
    workTogether: string;
    openMenu: string;
    closeMenu: string;
  };
  resumeModal: {
    badge: string;
    title: string;
    subtitle: string;
    downloadPdf: string;
    openNewTab: string;
    close: string;
  };
  hero: {
    mobileHeading: string;
    mobileDesc: string;
    mobileTypewriter: string;
    webHeading: string;
    webDesc: string;
    webTypewriter: string;
    viewOurWork: string;
    viewAll: string;
  };
  about: {
    heading: string;
    filters: {
      all: string;
      language: string;
      web: string;
      mobile: string;
      backend: string;
      devops: string;
      design: string;
    };
    heldBadgeHint: string;
    viewDocs: string;
    dragRailHint: string;
    prevTech: string;
    nextTech: string;
  };
  showcase: {
    badge: string;
    title: string;
    description: string;
    viewApp: string;
    livePreview: string;
    filterAll: string;
    filterMobile: string;
    filterWeb: string;
    viewMore: string;
    viewLess: string;
    highlightsHeading: string;
    exploreTech: string;
    githubCode: string;
    openLiveDemo: string;
    loadingPreview: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    serviceLabel: string;
    projectTypePlaceholder: string;
    services: {
      web: string;
      mobile: string;
      other: string;
    };
    timelineLabel: string;
    timelinePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    sending: string;
    sent: string;
    successTitle: string;
    successMessage: string;
    sendAnother: string;
    sendFailedTitle: string;
    sendFailedBody: string;
    openInGmail: string;
    useMailApp: string;
    tryAgainForm: string;
    securityVerification: string;
    securityPassed: string;
    captchaError: string;
    directContact: string;
    directCall: string;
    locationBadge: string;
  };
  footer: {
    createdBy: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    boot: {
      skip: "Skip Intro",
    },
    nav: {
      projects: "PROJECTS",
      about: "ABOUT",
      contact: "CONTACT",
      resume: "RESUME",
      previewResume: "Preview Resume",
      downloadResume: "Download Resume PDF",
      workTogether: "LET'S WORK TOGETHER",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
    },
    resumeModal: {
      badge: "AED SOLUTIONS · PROFILE & RESUME",
      title: "Capabilities & Technical Resume",
      subtitle: "Mobile & Web Product Engineering — Preview or download PDF",
      downloadPdf: "Download PDF",
      openNewTab: "Open PDF",
      close: "Close",
    },
    hero: {
      mobileHeading: "Mobile Service",
      mobileDesc:
        "We engineer high-performance iOS & Android apps that solve daily user friction — combining fluid 60 FPS native speed, offline-first sync, and smart AI workflows.",
      mobileTypewriter:
        "Built for retention and scale: instant cloud synchronization, on-device intelligence, crash-free reliability, and tactile native gestures.",
      webHeading: "Web Service",
      webDesc:
        "We build high-converting web platforms and SaaS products engineered to eliminate slow load times, automate operations, and turn traffic into measurable revenue.",
      webTypewriter:
        "From architecture to production launch: sub-second Next.js rendering, secure API backends, AI-assisted automation, and frictionless checkout flows.",
      viewOurWork: "VIEW OUR WORK",
      viewAll: "View all",
    },
    about: {
      heading: "Tech Stack & Skills",
      filters: {
        all: "All",
        language: "Languages",
        web: "Web & UI",
        mobile: "Mobile",
        backend: "Backend & Data",
        devops: "DevOps & Tools",
        design: "Design & Architecture",
      },
      heldBadgeHint: "Current focus badge",
      viewDocs: "Official Documentation",
      dragRailHint: "Drag or scroll through the tool rail",
      prevTech: "Previous technology",
      nextTech: "Next technology",
    },
    showcase: {
      badge: "FEATURED WORK",
      title: "Production-Grade Apps & Platforms",
      description:
        "Real products engineered with modern architectures, fluid animations, and real-time backend integrations.",
      viewApp: "View App",
      livePreview: "Live Preview",
      filterAll: "All Projects",
      filterMobile: "Mobile Apps",
      filterWeb: "Web Applications",
      viewMore: "View More ▼",
      viewLess: "View Less ▲",
      highlightsHeading: "Key Highlights & Architecture:",
      exploreTech: "Explore ↗",
      githubCode: "GitHub Code",
      openLiveDemo: "Open Live Demo",
      loadingPreview: "Loading interactive preview...",
    },
    contact: {
      title: "Start Your Project with",
      subtitle:
        "Have a vision for a mobile app or web platform? Send us a message and let's bring it to production.",
      nameLabel: "Your Name",
      namePlaceholder: "Your name or company",
      emailLabel: "Email Address",
      emailPlaceholder: "you@company.com",
      serviceLabel: "Interested Service",
      projectTypePlaceholder: "Select project type",
      services: {
        web: "Web Service",
        mobile: "Mobile Service",
        other: "Other Service",
      },
      timelineLabel: "Timeline / Scope",
      timelinePlaceholder: "e.g. MVP in 3–4 weeks, flexible scope",
      messageLabel: "Tell us about your project",
      messagePlaceholder:
        "Briefly describe your product goals, desired timeline, or key features...",
      submitButton: "Send Message",
      sending: "Sending...",
      sent: "Sent",
      successTitle: "Message sent!",
      successMessage:
        "Thanks for reaching out! Your inquiry landed in our inbox and we'll get back to you within 24 hours.",
      sendAnother: "← Send another message",
      sendFailedTitle: "One more tap",
      sendFailedBody:
        "Automatic delivery didn't go through. Your inquiry is pre-filled and ready — open Gmail and press send, or write directly to",
      openInGmail: "Open in Gmail",
      useMailApp: "Use mail app",
      tryAgainForm: "← Try again with form",
      securityVerification: "Security Verification",
      securityPassed: "Security check passed (Local Development Mode)",
      captchaError: "Please complete the Cloudflare security verification before sending.",
      directContact: "Direct contact",
      directCall: "Direct call",
      locationBadge: "Marrakech, Morocco · Available worldwide · Response within 24h",
    },
    footer: {
      createdBy: "Created by",
    },
  },
  fr: {
    boot: {
      skip: "Passer l'intro",
    },
    nav: {
      projects: "PROJETS",
      about: "À PROPOS",
      contact: "CONTACT",
      resume: "CV",
      previewResume: "Aperçu du CV",
      downloadResume: "Télécharger le CV (PDF)",
      workTogether: "TRAVAILLONS ENSEMBLE",
      openMenu: "Ouvrir le menu de navigation",
      closeMenu: "Fermer le menu de navigation",
    },
    resumeModal: {
      badge: "AED SOLUTIONS · PROFIL & CV",
      title: "Compétences & CV Technique",
      subtitle: "Ingénierie Produit Mobile & Web — Aperçu ou téléchargement PDF",
      downloadPdf: "Télécharger le PDF",
      openNewTab: "Ouvrir le PDF",
      close: "Fermer",
    },
    hero: {
      mobileHeading: "Service Mobile",
      mobileDesc:
        "Nous concevons des applications iOS & Android haute performance qui éliminent les frictions quotidiennes — alliant fluidité native 60 FPS, mode hors-ligne et fonctions IA.",
      mobileTypewriter:
        "Conçues pour durer : synchronisation cloud instantanée, IA embarquée, stabilité zéro crash et gestes natifs fluides qui fidélisent vos utilisateurs.",
      webHeading: "Service Web",
      webDesc:
        "Nous développons des plateformes web et produits SaaS à forte conversion — pensés pour éliminer les lenteurs, automatiser vos flux et accélérer votre croissance.",
      webTypewriter:
        "De l'architecture à la mise en production : rendu Next.js ultra-rapide, API sécurisées, automatisation IA et parcours d'achat sans friction.",
      viewOurWork: "VOIR NOS PROJETS",
      viewAll: "Tout voir",
    },
    about: {
      heading: "Stack Technique & Compétences",
      filters: {
        all: "Tout",
        language: "Langages",
        web: "Web & UI",
        mobile: "Mobile",
        backend: "Backend & Données",
        devops: "DevOps & Outils",
        design: "Design & Architecture",
      },
      heldBadgeHint: "Technologie en avant-plan",
      viewDocs: "Documentation Officielle",
      dragRailHint: "Faites glisser ou défilez sur le rail d'outils",
      prevTech: "Technologie précédente",
      nextTech: "Technologie suivante",
    },
    showcase: {
      badge: "RÉALISATIONS",
      title: "Applications & Plateformes de Production",
      description:
        "Des produits réels conçus avec des architectures modernes, des animations fluides et des intégrations backend en temps réel.",
      viewApp: "Voir l'App",
      livePreview: "Aperçu en Direct",
      filterAll: "Tous les Projets",
      filterMobile: "Apps Mobiles",
      filterWeb: "Applications Web",
      viewMore: "Voir plus ▼",
      viewLess: "Réduire ▲",
      highlightsHeading: "Points Clés & Architecture :",
      exploreTech: "Explorer ↗",
      githubCode: "Code GitHub",
      openLiveDemo: "Démo Live",
      loadingPreview: "Chargement de l'aperçu interactif...",
    },
    contact: {
      title: "Démarrez Votre Projet avec",
      subtitle:
        "Vous avez une vision d'application mobile ou de plateforme web ? Envoyez-nous un message et passons en production.",
      nameLabel: "Votre Nom",
      namePlaceholder: "Votre nom ou entreprise",
      emailLabel: "Adresse E-mail",
      emailPlaceholder: "vous@entreprise.com",
      serviceLabel: "Service Souhaité",
      projectTypePlaceholder: "Choisir le type de projet",
      services: {
        web: "Service Web",
        mobile: "Service Mobile",
        other: "Autre Service",
      },
      timelineLabel: "Délais / Périmètre",
      timelinePlaceholder: "ex. MVP en 3–4 semaines, budget flexible",
      messageLabel: "Parlez-nous de votre projet",
      messagePlaceholder:
        "Décrivez brièvement les objectifs du produit, les délais envisagés ou les fonctionnalités clés...",
      submitButton: "Envoyer",
      sending: "Envoi...",
      sent: "Envoyé",
      successTitle: "Message envoyé !",
      successMessage:
        "Merci pour votre message ! Votre demande est bien arrivée et nous vous répondrons sous 24 heures.",
      sendAnother: "← Envoyer un autre message",
      sendFailedTitle: "Une dernière étape",
      sendFailedBody:
        "L'envoi automatique n'a pas abouti. Votre message est prêt — ouvrez Gmail et appuyez sur envoyer, ou écrivez directement à",
      openInGmail: "Ouvrir dans Gmail",
      useMailApp: "Application mail",
      tryAgainForm: "← Réessayer via le formulaire",
      securityVerification: "Vérification de Sécurité",
      securityPassed: "Contrôle de sécurité validé (Mode Développement)",
      captchaError: "Veuillez compléter la vérification de sécurité Cloudflare avant d'envoyer.",
      directContact: "Contact direct",
      directCall: "Appel direct",
      locationBadge: "Marrakech, Maroc · Disponible à l'international · Réponse sous 24h",
    },
    footer: {
      createdBy: "Créé par",
    },
  },
};
