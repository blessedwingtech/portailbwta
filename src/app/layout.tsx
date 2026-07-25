import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bwta.bittonik.com"),
  title: {
    default: "Portail BWTA | Blessed Wing Tech Academy - Innovation & Leadership",
    template: "%s | BWTA"
  },
  description: "Portail associatif officiel de la Blessed Wing Tech Academy (BWTA) à Lajeune, Pignon (Nord, Haïti). Académie d'excellence technologique, développement communautaire et leadership d'avenir.",
  keywords: ["BWTA", "Blessed Wing Tech Academy", "Académie Technologie", "Pignon", "Lajeune", "Nord Haïti", "Innovation", "Formation", "Communauté", "Tech"],
  authors: [{ name: "Bureau Exécutif BWTA", url: "https://bwta.bittonik.com" }],
  openGraph: {
    title: "Blessed Wing Tech Academy (BWTA) | Excellence & Innovation",
    description: "Rejoignez l'académie de référence en technologie et innovation technologique. Formation d'élite, recherche et engagement communautaire d'avenir.",
    url: "https://bwta.bittonik.com",
    siteName: "Portail BWTA",
    locale: "fr_HT",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Logo officiel et Insigne de Diplômé - Blessed Wing Tech Academy (BWTA)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blessed Wing Tech Academy (BWTA) | Innovation & Excellence",
    description: "Portail associatif officiel et inscriptions de la BWTA. Façonnons ensemble les leaders technologiques de demain.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/ba.png",
    shortcut: "/ba.png",
    apple: "/ba.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-brand-turquoise selection:text-white">
        {children}
      </body>
    </html>
  );
}
