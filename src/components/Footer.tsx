"use client";

import Image from "next/image";
import { Mail, MapPin, Instagram, Facebook } from "lucide-react";

const links = [
  { label: "Over ons", href: "#verhaal" },
  { label: "Route", href: "#route" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Word Partner", href: "#sponsor-form" },
];

const contact = [
  { icon: Mail, label: "vzwvgm@gmail.com", href: "mailto:vzwvgm@gmail.com" },
  { icon: MapPin, label: "Antwerpsesteenweg 24, 9000 Gent", href: "https://maps.google.com/?q=Antwerpsesteenweg+24+9000+Gent" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-text-primary text-white">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-14 bg-white rounded-xl p-2">
                <Image
                  src="/assets/logos/vgm-logo.png"
                  alt="VGM Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="font-display font-semibold text-white">Ramadan Lights</span>
                <span className="block text-sm text-teal-light">Gent 2026</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Een initiatief van de Vereniging van Gentse Moskeeën (VGM vzw).
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Navigatie</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-4">
              {contact.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                    <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Volg ons</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/vzwvgm/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-teal transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/Vzwvgm" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-teal transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>
              <p>© {new Date().getFullYear()} VGM vzw | BTW: BE 0662.896.812</p>
            </div>
            <p className="text-teal">Gemaakt met zorg in Gent</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
