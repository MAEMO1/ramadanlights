"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "#verhaal", label: "Over ons" },
  { href: "/iftar", label: "Iftarkaart", highlight: true },
  { href: "/moskeeen", label: "Moskeeën", highlight: true },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#doneren", label: "Doneren" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className={`relative w-12 h-12 rounded-xl overflow-hidden ${!isScrolled ? "bg-white p-1" : ""}`}>
              <Image
                src="/assets/logos/vgm-logo.png"
                alt="VGM Logo"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="hidden sm:block">
              <span className={`font-display text-base font-semibold ${isScrolled ? "text-text-primary" : "text-white"}`}>
                Ramadan Lights
              </span>
              <span className={`block text-xs font-medium ${isScrolled ? "text-teal" : "text-teal-light"}`}>
                Gent 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.highlight
                    ? isScrolled
                      ? "text-teal font-semibold bg-teal/10 px-3 py-1.5 rounded-full hover:bg-teal/20"
                      : "text-white font-semibold bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30"
                    : isScrolled
                      ? "text-text-secondary hover:text-teal"
                      : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a href="#sponsor-form" className="btn-primary text-sm px-6 py-3">
              Word Sponsor
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isScrolled ? "text-text-primary" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl transition-colors font-medium ${
                    link.highlight
                      ? "text-teal font-semibold bg-teal/10 hover:bg-teal/20"
                      : "text-text-secondary hover:text-teal hover:bg-surface-soft"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4">
                <a
                  href="#sponsor-form"
                  className="btn-primary w-full text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Word Sponsor
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
