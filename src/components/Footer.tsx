"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

const footerLinks = {
  navigation: [
    { label: "Het Verhaal", href: "#verhaal" },
    { label: "Route", href: "#route" },
    { label: "Sponsors", href: "#sponsors" },
    { label: "Word Partner", href: "#sponsor-form" },
  ],
  legal: [
    { label: "Sponsorovereenkomst", href: "/contract.pdf" },
    { label: "Privacybeleid", href: "#" },
  ],
};

const contactInfo = [
  { icon: Mail, label: "info@vgm.be", href: "mailto:info@vgm.be" },
  { icon: Phone, label: "+32 XXX XX XX XX", href: "tel:+32XXXXXXXX" },
  { icon: MapPin, label: "Gent, België", href: "#" },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
];

export function Footer() {
  return (
    <footer id="contact" className="relative bg-background-alt border-t border-border">
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-10" />

      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/logos/vgm-logo.png"
                  alt="VGM Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-lg text-text-primary block">
                  Ramadan Lights
                </span>
                <span className="text-text-muted text-sm">Gent 2025</span>
              </div>
            </div>
            <p className="text-text-muted text-sm mb-6">
              Een initiatief van de Vereniging van Gentse Moskeeën (VGM vzw) dat
              gemeenschappen verbindt door de magie van licht.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-lg text-text-primary mb-4">
              Navigatie
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-muted hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-text-primary mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((info) => (
                <li key={info.label}>
                  <a
                    href={info.href}
                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm"
                  >
                    <info.icon className="w-4 h-4" />
                    {info.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg text-text-primary mb-4">
              Documenten
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-muted hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-6">
              <a
                href="#sponsor-form"
                className="inline-flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                Ook sponsoren?
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-text-muted text-sm">
                © {new Date().getFullYear()} VGM vzw. Alle rechten voorbehouden.
              </p>
              {/* Legal disclaimer - REQUIRED */}
              <p className="text-text-muted text-xs mt-1">
                Kleine onderneming vrijgesteld van BTW (Art. 56bis W.BTW)
              </p>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <span>Met</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-red-500"
              >
                ❤
              </motion.span>
              <span>gemaakt in Gent</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
