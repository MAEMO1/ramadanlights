"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Gallery } from "@/components/Gallery";
import { RouteMap } from "@/components/RouteMap";
import { SponsorGrid } from "@/components/SponsorGrid";
import { DonateSection } from "@/components/DonateSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Story />
      <Gallery />
      <RouteMap />
      <SponsorGrid />
      <DonateSection />
      <Footer />
    </main>
  );
}
