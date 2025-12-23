import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ramadan Lights Gent | Verbindend licht in het hart van de stad",
  description:
    "Ontdek de magische Ramadanverlichting in Gent. Een project dat gemeenschappen verbindt door licht en samenhorigheid.",
  keywords: [
    "Ramadan",
    "Gent",
    "verlichting",
    "Ramadan Lights",
    "VGM",
    "Vereniging van Gentse Moskeeën",
    "sponsoring",
    "gemeenschap",
  ],
  authors: [{ name: "VGM vzw" }],
  openGraph: {
    title: "Ramadan Lights Gent",
    description: "Verbindend licht in het hart van de stad",
    type: "website",
    locale: "nl_BE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
