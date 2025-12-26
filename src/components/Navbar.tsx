"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Custom event for opening the game map
export const OPEN_GAME_MAP_EVENT = "openGameMap";

const navLinks = [
  { href: "/#verhaal", label: "Het project", gold: true },
  { href: "/wat-te-doen", label: "Wat te doen", highlight: true },
  { href: "/iftar", label: "Iftarkaart", highlight: true },
  { href: "/moskeeen", label: "Moskeeën", highlight: true },
  { href: "/#sponsors", label: "Sponsors" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? "bg-white border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className={`relative w-9 h-9 rounded-md overflow-hidden ${
                  !isScrolled ? "bg-white" : ""
                }`}
              >
                <Image
                  src="/assets/logos/vgm-logo.png"
                  alt="VGM Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="hidden sm:block">
                <span
                  className={`block text-sm font-semibold transition-colors ${
                    isScrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  Ramadan Lights
                </span>
                <span
                  className={`block text-[11px] font-medium transition-colors ${
                    isScrolled ? "text-gray-500" : "text-white/70"
                  }`}
                >
                  Gent 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-sm transition-colors
                    ${link.highlight
                      ? "px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700"
                      : link.gold
                        ? isScrolled
                          ? "text-gold font-semibold hover:text-gold-dark px-3 py-2"
                          : "text-gold-light font-semibold hover:text-gold px-3 py-2"
                        : isScrolled
                          ? isActive(link.href)
                            ? "text-gray-900 font-semibold px-3 py-2"
                            : "text-gray-500 hover:text-gray-900 px-3 py-2"
                          : isActive(link.href)
                            ? "text-white font-semibold px-3 py-2"
                            : "text-white/70 hover:text-white px-3 py-2"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              {/* Game Map Button - Flickering Arrow */}
              <motion.button
                onClick={() => window.dispatchEvent(new CustomEvent(OPEN_GAME_MAP_EVENT))}
                className={`
                  relative ml-1 p-2.5 rounded-lg transition-colors group
                  ${isScrolled
                    ? "bg-gradient-to-br from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100"
                    : "bg-gradient-to-br from-gold/30 to-gold/20 hover:from-gold/40 hover:to-gold/30"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open Sponsor Kaart"
              >
                {/* Outer glow ring */}
                <motion.div
                  className={`absolute inset-0 rounded-lg ${
                    isScrolled ? "bg-gold/20" : "bg-gold/30"
                  }`}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Inner pulsing glow */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gold/40"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Map icon with subtle bounce */}
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <MapIcon className={`w-4 h-4 ${isScrolled ? "text-amber-700" : "text-gold"}`} />
                </motion.div>

                {/* Sparkle effect */}
                <motion.div
                  className="absolute -top-0.5 -right-0.5 text-[10px]"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  ✨
                </motion.div>
              </motion.button>

              <div className={`w-px h-5 mx-3 ${isScrolled ? "bg-gray-200" : "bg-white/30"}`} />

              <Link
                href="/sponsor"
                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${isScrolled
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                Word Sponsor
              </Link>

              <Link
                href="/#doneren"
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-gold text-white hover:bg-gold-dark"
              >
                #LightUpRamadan
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`
                lg:hidden p-2 -mr-2 transition-colors
                ${isScrolled ? "text-gray-900" : "text-white"}
              `}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-0 left-0 right-0 bg-white z-50 lg:hidden border-b border-gray-100"
            >
              <div className="px-5">
                <div className="flex items-center justify-between h-16">
                  <Link
                    href="/"
                    className="flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative w-9 h-9 rounded-md overflow-hidden">
                      <Image
                        src="/assets/logos/vgm-logo.png"
                        alt="VGM Logo"
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      Ramadan Lights
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-gray-500"
                    aria-label="Sluiten"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="py-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        block py-3 px-4 text-[15px] rounded-md transition-colors
                        ${link.highlight
                          ? "bg-teal-600 text-white font-medium"
                          : link.gold
                            ? "text-gold font-semibold hover:bg-gold/10"
                            : isActive(link.href)
                              ? "text-gray-900 font-semibold bg-gray-50"
                              : "text-gray-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {/* Game Map Button - Mobile */}
                  <motion.button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent(OPEN_GAME_MAP_EVENT));
                    }}
                    className="relative w-full flex items-center justify-center gap-3 py-3 px-4 text-[15px] font-medium rounded-md bg-gradient-to-r from-amber-100 to-gold/20 text-amber-800 hover:from-amber-200 hover:to-gold/30 transition-all overflow-hidden"
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Pulsing background */}
                    <motion.div
                      className="absolute inset-0 bg-gold/20"
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <MapIcon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Ontdek de Sponsor Kaart</span>
                    <motion.span
                      className="text-sm relative z-10"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [0.9, 1.1, 0.9],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ✨
                    </motion.span>
                  </motion.button>
                </div>

                <div className="py-4 border-t border-gray-100 space-y-2">
                  <Link
                    href="/sponsor"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      block w-full py-3 text-center text-[15px] font-medium
                      bg-gray-900 text-white rounded-md
                    "
                  >
                    Word Sponsor
                  </Link>
                  <Link
                    href="/#doneren"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      block w-full py-3 text-center text-[15px] font-medium
                      bg-gold text-white rounded-md
                    "
                  >
                    #LightUpRamadan
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
