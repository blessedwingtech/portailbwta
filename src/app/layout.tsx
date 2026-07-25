import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portail BWTA - Blessed Wing Tech Academy",
  description: "Portail associatif officiel, idéologie et inscriptions pour Blessed Wing Tech Academy (BWTA) à Lajeune, Pignon, Nord.",
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
