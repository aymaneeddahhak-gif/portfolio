export type Language = "en" | "fr";

export interface Translations {
  nav: {
    projects: string;
    about: string;
    contact: string;
    workTogether: string;
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
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    serviceLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    sending: string;
    successTitle: string;
    successMessage: string;
    sendAnother: string;
    securityVerification: string;
    securityPassed: string;
  };
  footer: {
    createdBy: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      projects: "PROJECTS",
      about: "ABOUT",
      contact: "CONTACT",
      workTogether: "LET'S WORK TOGETHER",
    },
    hero: {
      mobileHeading: "Mobile Service",
      mobileDesc:
        "We solve real user problems through high-performance mobile apps — turning daily friction into fluid native speed, smart AI features, and offline reliability.",
      mobileTypewriter:
        "We tackle what makes or breaks a mobile product: instant cloud sync, on-device AI intelligence, zero-crash stability, and smooth native gestures that keep users coming back.",
      webHeading: "Web Service",
      webDesc:
        "Solving real business bottlenecks with high-converting web platforms and SaaS tools — built to eliminate slow load times, automate workflows, and scale seamlessly.",
      webTypewriter:
        "We turn complex product ideas into high-impact digital solutions: sub-second performance, smart AI-assisted automation, rock-solid security, and frictionless flows that drive real revenue.",
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
    },
    contact: {
      title: "Start Your Project with",
      subtitle:
        "Have a vision for a mobile app or web platform? Send a message and let's bring it to production.",
      nameLabel: "Your Name",
      namePlaceholder: "Aymane or Company name",
      emailLabel: "Email Address",
      emailPlaceholder: "aymane@company.com",
      serviceLabel: "Interested Service",
      messageLabel: "Tell me about your project",
      messagePlaceholder:
        "Briefly describe your product goals, desired timeline, or key features...",
      submitButton: "Send Inquiry",
      sending: "Sending...",
      successTitle: "Message Delivered Successfully!",
      successMessage:
        "Thank you for reaching out. I have received your message and will get back to you within 24 hours.",
      sendAnother: "Send Another Message",
      securityVerification: "Security Verification",
      securityPassed: "Security check passed (Local Development Mode)",
    },
    footer: {
      createdBy: "Created by",
    },
  },
  fr: {
    nav: {
      projects: "PROJETS",
      about: "À PROPOS",
      contact: "CONTACT",
      workTogether: "TRAVAILLONS ENSEMBLE",
    },
    hero: {
      mobileHeading: "Service Mobile",
      mobileDesc:
        "Nous résolvons les vrais problèmes des utilisateurs grâce à des applications mobiles haute performance — transformant les frictions quotidiennes en vitesse native fluide, fonctionnalités IA intelligentes et fiabilité hors-ligne.",
      mobileTypewriter:
        "Nous maîtrisons ce qui fait le succès d'un produit mobile : synchronisation cloud instantanée, IA sur l'appareil, stabilité zéro crash et gestes natifs fluides qui fidélisent les utilisateurs.",
      webHeading: "Service Web",
      webDesc:
        "Résoudre les goulets d'étranglement avec des plateformes web et outils SaaS à forte conversion — conçus pour éliminer les lenteurs, automatiser les flux et évoluer sans friction.",
      webTypewriter:
        "Nous transformons des idées complexes en solutions digitales à fort impact : performance sous la seconde, automatisation assistée par IA, sécurité robuste et parcours fluides générant de réels revenus.",
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
    },
    contact: {
      title: "Démarrez Votre Projet avec",
      subtitle:
        "Vous avez une idée d'application mobile ou de plateforme web ? Envoyez un message et donnons-lui vie en production.",
      nameLabel: "Votre Nom",
      namePlaceholder: "Aymane ou nom d'entreprise",
      emailLabel: "Adresse E-mail",
      emailPlaceholder: "aymane@entreprise.com",
      serviceLabel: "Service Souhaité",
      messageLabel: "Parlez-moi de votre projet",
      messagePlaceholder:
        "Décrivez brièvement les objectifs du produit, les délais envisagés ou les fonctionnalités clés...",
      submitButton: "Envoyer la Demande",
      sending: "Envoi en cours...",
      successTitle: "Message Envoyé avec Succès !",
      successMessage:
        "Merci pour votre message. Je l'ai bien reçu et je vous répondrai dans un délai de 24 heures.",
      sendAnother: "Envoyer un Autre Message",
      securityVerification: "Vérification de Sécurité",
      securityPassed: "Contrôle de sécurité validé (Mode Développement)",
    },
    footer: {
      createdBy: "Créé par",
    },
  },
};
