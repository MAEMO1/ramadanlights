"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#verhaal", label: "Over ons" },
  { href: "/iftar", label: "Iftarkaart", highlight: true, icon: "🌙" },
  { href: "/moskeeen", label: "Moskeeën", highlight: true, icon: "🕌" },
  { href: "/#sponsors", label: "Sponsors" },
  { href: "/#doneren", label: "Doneren" },
];

const linkVariants = {
  initial: { opacity: 0, y: -8 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
};

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const mobileLinkVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 + i * 0.06,
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
};

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
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
            : "bg-gradient-to-b from-black/40 via-black/20 to-transparent"
        }`}
      >
        {/* Subtle warm glow line at top when not scrolled */}
        {!isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-22 py-5">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-4 relative"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-3 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-teal/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

              <motion.div
                className={`relative w-14 h-14 rounded-2xl overflow-hidden transition-all duration-300 ${
                  !isScrolled
                    ? "bg-white/95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    : "bg-white shadow-md"
                }`}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src="/assets/logos/vgm-logo.png"
                  alt="VGM Logo"
                  fill
                  className="object-contain p-1.5"
                />
              </motion.div>

              <div className="hidden sm:block relative">
                <span className={`font-display text-lg font-bold tracking-tight transition-colors duration-300 ${
                  isScrolled ? "text-slate-800" : "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                }`}>
                  Ramadan Lights
                </span>
                <span className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${
                  isScrolled ? "text-teal" : "text-amber-300"
                }`}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  Gent 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i}
                  initial="initial"
                  animate="animate"
                  variants={linkVariants}
                >
                  <Link
                    href={link.href}
                    className={`
                      relative px-4 py-2.5 rounded-xl text-[15px] font-medium
                      transition-all duration-300 ease-out
                      group flex items-center gap-2
                      ${link.highlight
                        ? isScrolled
                          ? `bg-gradient-to-r from-teal/10 to-amber-500/10 text-teal
                             hover:from-teal/20 hover:to-amber-500/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]
                             ${isActive(link.href) ? "ring-2 ring-teal/30 shadow-[0_0_20px_rgba(20,184,166,0.25)]" : ""}`
                          : `bg-white/15 backdrop-blur-sm text-white border border-white/20
                             hover:bg-white/25 hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]
                             ${isActive(link.href) ? "bg-white/25 border-white/40" : ""}`
                        : isScrolled
                          ? `text-slate-600 hover:text-teal hover:bg-slate-100/80
                             ${isActive(link.href) ? "text-teal bg-teal/5" : ""}`
                          : `text-white/90 hover:text-white hover:bg-white/10
                             ${isActive(link.href) ? "text-white bg-white/10" : ""}`
                      }
                    `}
                  >
                    {link.highlight && (
                      <span className="text-base transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                        {link.icon}
                      </span>
                    )}
                    {link.label}

                    {/* Active indicator dot */}
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="activeIndicator"
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                          isScrolled ? "bg-teal" : "bg-amber-300"
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* CTA Button */}
              <motion.div
                custom={navLinks.length}
                initial="initial"
                animate="animate"
                variants={linkVariants}
                className="ml-4"
              >
                <Link
                  href="/#sponsor-form"
                  className={`
                    relative group inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    font-semibold text-[15px] overflow-hidden
                    transition-all duration-300
                    ${isScrolled
                      ? "bg-gradient-to-r from-teal to-teal-dark text-white shadow-lg shadow-teal/25 hover:shadow-xl hover:shadow-teal/30 hover:-translate-y-0.5"
                      : "bg-white text-teal shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
                    }
                  `}
                >
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <Sparkles className="w-4 h-4" />
                  <span className="relative">Word Sponsor</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={`
                md:hidden relative p-3 rounded-xl
                transition-colors duration-300
                ${isScrolled
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10"
                }
              `}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={26} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={26} strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-2xl"
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent" />

              <div className="px-6 py-8 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={mobileLinkVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      href={link.href}
                      className={`
                        flex items-center gap-4 px-5 py-4 rounded-2xl
                        font-medium text-base
                        transition-all duration-300
                        ${link.highlight
                          ? `bg-gradient-to-r from-teal/10 to-amber-500/5 text-teal
                             hover:from-teal/15 hover:to-amber-500/10
                             ${isActive(link.href) ? "ring-2 ring-teal/20" : ""}`
                          : `text-slate-600 hover:bg-slate-50 hover:text-teal
                             ${isActive(link.href) ? "bg-teal/5 text-teal" : ""}`
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.highlight && (
                        <span className="text-xl">{link.icon}</span>
                      )}
                      {!link.highlight && (
                        <span className="w-2 h-2 rounded-full bg-current opacity-40" />
                      )}
                      {link.label}

                      {isActive(link.href) && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-teal animate-pulse" />
                      )}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  custom={navLinks.length}
                  variants={mobileLinkVariants}
                  initial="closed"
                  animate="open"
                  className="pt-4"
                >
                  <Link
                    href="/#sponsor-form"
                    className="
                      flex items-center justify-center gap-3 w-full
                      bg-gradient-to-r from-teal to-teal-dark text-white
                      px-6 py-4 rounded-2xl font-semibold text-base
                      shadow-lg shadow-teal/20
                      active:scale-[0.98] transition-transform
                    "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Sparkles className="w-5 h-5" />
                    Word Sponsor
                  </Link>
                </motion.div>
              </div>

              {/* Decorative bottom element */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-slate-200" />
                  <span>🌙</span>
                  <span className="font-medium">Ramadan Mubarak</span>
                  <span>🌙</span>
                  <span className="w-8 h-px bg-gradient-to-l from-transparent to-slate-200" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
