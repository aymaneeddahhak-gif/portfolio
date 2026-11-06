"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Language, type Translations } from "./translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "portfolio-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Check user explicit preference saved in localStorage
    const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (savedLang === "en" || savedLang === "fr") {
      setLangState(savedLang);
      document.documentElement.lang = savedLang;
    } else {
      // 2. Automatically detect browser language
      const browserLang = navigator.language?.toLowerCase() || "";
      const detected: Language = browserLang.startsWith("fr") ? "fr" : "en";
      setLangState(detected);
      document.documentElement.lang = detected;
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {}
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      lang: "en",
      setLang: () => {},
      t: translations.en,
    };
  }
  return context;
}
