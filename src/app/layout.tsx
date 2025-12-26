import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { GameMapWrapper } from "@/components/GameMapWrapper";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ramadan Lights Gent 2026",
  description:
    "Verbindend licht in het hart van Gent. Een initiatief van de Vereniging van Gentse Moskeeën.",
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
  authors: [{ name: "VGM" }],
  openGraph: {
    title: "Ramadan Lights Gent 2026",
    description: "Verbindend licht in het hart van Gent",
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
    <html lang="nl" className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white antialiased font-body">
        <GameMapWrapper>{children}</GameMapWrapper>
      </body>
    </html>
  );
}
