"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#verhaal", label: "Over ons" },
  { href: "/iftar", label: "Iftarkaart", highlight: true },
  { href: "/moskeeen", label: "Moskeeën", highlight: true },
  { href: "/#sponsors", label: "Sponsors" },
  { href: "/#doneren", label: "Doneren" },
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

  // Prevent body scroll when menu is open
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className={`relative w-10 h-10 lg:w-11 lg:h-11 rounded-lg overflow-hidden transition-all duration-300 ${
                  !isScrolled ? "bg-white shadow-md" : ""
                }`}
              >
                <Image
                  src="/assets/logos/vgm-logo.png"
                  alt="VGM Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="hidden sm:block">
                <span
                  className={`block text-[15px] font-semibold tracking-tight transition-colors duration-300 ${
                    isScrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  Ramadan Lights
                </span>
                <span
                  className={`block text-xs font-medium transition-colors duration-300 ${
                    isScrolled ? "text-teal-600" : "text-teal-300"
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
                    relative px-4 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200
                    ${isScrolled
                      ? isActive(link.href)
                        ? "text-teal-600 bg-teal-50"
                        : link.highlight
                          ? "text-teal-600 hover:bg-teal-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      : isActive(link.href)
                        ? "text-white bg-white/20"
                        : link.highlight
                          ? "text-white hover:bg-white/10"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${
                        isScrolled ? "bg-teal-600" : "bg-white"
                      }`}
                    />
                  )}
                </Link>
              ))}

              <div className="w-px h-6 bg-gray-200 mx-2" />

              <Link
                href="/#sponsor-form"
                className={`
                  px-5 py-2.5 text-sm font-semibold rounded-lg
                  transition-all duration-200
                  ${isScrolled
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-white text-teal-600 hover:bg-gray-50"
                  }
                `}
              >
                Word Sponsor
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`
                lg:hidden p-2 -mr-2 rounded-lg
                transition-colors duration-200
                ${isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
                }
              `}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-900">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Sluiten"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="px-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center justify-between px-4 py-3.5 rounded-xl mb-1
                          text-[15px] font-medium transition-colors
                          ${isActive(link.href)
                            ? "bg-teal-50 text-teal-700"
                            : link.highlight
                              ? "text-teal-600 hover:bg-teal-50"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        {link.label}
                        <ChevronRight
                          size={18}
                          className={isActive(link.href) ? "text-teal-500" : "text-gray-400"}
                        />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-5 border-t border-gray-100">
                  <Link
                    href="/#sponsor-form"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      flex items-center justify-center w-full
                      px-6 py-3.5 rounded-xl
                      bg-teal-600 text-white text-[15px] font-semibold
                      hover:bg-teal-700 transition-colors
                    "
                  >
                    Word Sponsor
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
