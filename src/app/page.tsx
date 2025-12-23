"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { RouteMap } from "@/components/RouteMap";
import { SponsorGrid } from "@/components/SponsorGrid";
import { SponsorForm } from "@/components/SponsorForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Story />
      <RouteMap />
      <SponsorGrid />
      <SponsorForm />
      <Footer />
    </main>
  );
}
