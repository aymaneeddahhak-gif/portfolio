import type { Metadata } from "next";
import { Montserrat, Syne, Plus_Jakarta_Sans } from "next/font/google";
import { SiteBackdrop } from "./site-backdrop";
import { LanguageProvider } from "@/i18n/LanguageContext";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AED PORTFOLIO",
  description: "AED Solutions — High-Performance Mobile & Web Product Engineering",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/logo-a.png?v=5", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=5",
    apple: "/images/logo-a.png?v=5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.className} ${syne.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('aed-portfolio-booted')==='1'){document.documentElement.setAttribute('data-booted','1');}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          {/* Ambient lighting shared by every section on the site. */}
          <SiteBackdrop />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
