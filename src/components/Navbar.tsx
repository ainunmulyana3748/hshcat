"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CompanyInfo } from "@/types/content";
import { MessageCircle, Menu, X } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";

interface NavbarProps {
  company: CompanyInfo;
}

export default function Navbar({ company }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waUrl = generateWhatsAppUrl(
    company.whatsapp,
    company.whatsappPrefilledMessage,
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(28,25,23,0.04)] border-b border-[#E7E2D8] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-9 sm:h-12 w-auto max-w-[160px] sm:max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center font-serif text-lg tracking-wider transition-transform duration-300 group-hover:scale-105">
                  R
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl tracking-[0.06em] font-medium text-[#1C1917] leading-none">
                    ROYAL RASA
                  </span>
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#8C827A] font-medium mt-1">
                    Catering & Fine Events
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-9 text-xs uppercase tracking-[0.18em] font-medium text-[#57534E]">
            <Link
              href="#beranda"
              className="hover:text-[#1C1917] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1C1917] hover:after:w-full after:transition-all"
            >
              Beranda
            </Link>
            <Link
              href="#tentang"
              className="hover:text-[#1C1917] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1C1917] hover:after:w-full after:transition-all"
            >
              Tentang
            </Link>
            <Link
              href="#portofolio"
              className="hover:text-[#1C1917] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1C1917] hover:after:w-full after:transition-all"
            >
              Galeri Acara
            </Link>
            <Link
              href="#mitra"
              className="hover:text-[#1C1917] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1C1917] hover:after:w-full after:transition-all"
            >
              Klien &amp; Rekanan
            </Link>
            <Link
              href="#faq"
              className="hover:text-[#1C1917] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1C1917] hover:after:w-full after:transition-all"
            >
              FAQ
            </Link>
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#2B2826] text-[#FAF8F5] text-xs uppercase tracking-[0.16em] font-medium px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#FAF8F5]" />
              <span>Konsultasi Menu</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1C1917] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E7E2D8] px-6 py-8 mt-2 space-y-6 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4 text-sm font-medium tracking-[0.12em] uppercase text-[#1C1917]">
            <Link
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#B38E5D] transition py-1"
            >
              Beranda
            </Link>
            <Link
              href="#tentang"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#B38E5D] transition py-1"
            >
              Tentang Kami
            </Link>
            <Link
              href="#portofolio"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#B38E5D] transition py-1"
            >
              Galeri Acara
            </Link>
            <Link
              href="#mitra"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#B38E5D] transition py-1"
            >
              Klien &amp; Rekanan
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#B38E5D] transition py-1"
            >
              FAQ
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#E7E2D8]">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1C1917] text-[#FAF8F5] py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
