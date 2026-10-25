"use client";

import { CompanyInfo } from "@/types/content";
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { generateWhatsAppUrl } from "@/lib/utils";

interface SocialAndFooterProps {
  company: CompanyInfo;
}

// Crisp refined inline SVG for Instagram
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Crisp refined inline SVG for Facebook
function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function SocialAndFooter({ company }: SocialAndFooterProps) {
  const waUrl = generateWhatsAppUrl(
    company.whatsapp,
    company.whatsappPrefilledMessage,
  );

  return (
    <footer className="bg-[#181716] text-[#FAF8F5] relative overflow-hidden">
      {/* Social Connection Banner: Warm Editorial Concierge */}
      <div className="border-b border-[#2C2927] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#B38E5D] block mb-2">
                07 • KONEKSI &amp; KONSULTASI
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white">
                Terhubung Langsung dengan Tim Perencana Boga Kami.
              </h3>
              <p className="text-[#8C827A] text-sm mt-2">
                Dapatkan inspirasi dekorasi meja terbaru, dokumentasi video
                event, dan konsultasi cepat melalui kanal resmi kami.
              </p>
            </div>

            {/* Direct Social Links: Elegant & Integrated */}
            <div className="flex flex-wrap items-center gap-3">
              {/* WhatsApp Live Concierge */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#FAF8F5] text-[#1C1917] hover:bg-white text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 shadow-sm hover:shadow"
              >
                <MessageCircle className="w-4 h-4 fill-[#1C1917]" />
                <span>WhatsApp Concierge</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>

              {/* Instagram Channel */}
              <a
                href={company.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#201E1C] hover:bg-[#2B2826] border border-[#3D3835] hover:border-[#B38E5D] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300"
              >
                <InstagramIcon className="w-4 h-4 text-[#B38E5D]" />
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>

              {/* Facebook Page */}
              <a
                href={company.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#201E1C] hover:bg-[#2B2826] border border-[#3D3835] hover:border-[#B38E5D] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4 text-[#B38E5D]" />
                <span>Facebook</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-5">
            {company.logoUrl && (
              <Link
                href="/"
                aria-label={`Beranda ${company.name}`}
                className="inline-flex"
              >
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-auto md:max-h-48 max-h-24 w-auto max-w-full object-contain object-left"
                />
              </Link>
            )}
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#8C827A] block mb-2">
              Navigasi Halaman
            </span>
            <ul className="space-y-2.5 text-xs text-[#A8A29E]">
              <li>
                <Link href="#beranda" className="hover:text-white transition">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="#tentang" className="hover:text-white transition">
                  Tentang Royal Rasa
                </Link>
              </li>
              <li>
                <Link
                  href="#portofolio"
                  className="hover:text-white transition"
                >
                  Galeri Acara
                </Link>
              </li>
              <li>
                <Link href="#mitra" className="hover:text-white transition">
                  Klien &amp; Rekanan
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3 text-xs text-[#A8A29E]">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#8C827A] block mb-2">
              Kantor &amp; Tasting Lounge
            </span>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B38E5D] flex-shrink-0 mt-0.5" />
                <span>
                  {company.address}, {company.city}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B38E5D] flex-shrink-0" />
                <span>{company.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B38E5D] flex-shrink-0" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B38E5D] flex-shrink-0" />
                <span>{company.openingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#262321] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716C]">
          <p>
            © {new Date().getFullYear()} {company.name}.{" "}
            {company.copyrightText || "Hak Cipta Dilindungi Undang-Undang."}
          </p>
        </div>
      </div>
    </footer>
  );
}
