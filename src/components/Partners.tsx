"use client";

import { PartnerItem, PartnersSectionConfig } from "@/types/content";
import { Building2 } from "lucide-react";

interface PartnersProps {
  partners: PartnerItem[];
  config?: PartnersSectionConfig;
}

// Brand Logo Component with clean vector styling & image support
function BrandLogoDisplay({ partner }: { partner: PartnerItem }) {
  const name = partner.name.toLowerCase();

  // If a valid uploaded or external image is provided
  if (partner.logoUrl && (partner.logoUrl.startsWith("/") || partner.logoUrl.startsWith("http"))) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-center p-2.5 mb-4 group-hover:border-[#B38E5D] transition-colors overflow-hidden">
        <img
          src={partner.logoUrl}
          alt={`Logo ${partner.name}`}
          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          onError={(e) => {
            // fallback if image fails to load
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  // Pre-designed corporate SVG emblems for top brands
  if (name.includes("telkomsel")) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] flex items-center justify-center text-[#E11D48] mb-4 group-hover:scale-105 transition-transform shadow-sm">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#E11D48" fillOpacity="0.1" />
          <path d="M12 4a8 8 0 100 16 8 8 0 000-16zm-2 11.5v-7l6 3.5-6 3.5z" fill="#E11D48" />
        </svg>
      </div>
    );
  }

  if (name.includes("indosat")) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] flex items-center justify-center text-[#D97706] mb-4 group-hover:scale-105 transition-transform shadow-sm">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="8" cy="12" r="5" fill="#F59E0B" />
          <circle cx="16" cy="12" r="5" fill="#EF4444" fillOpacity="0.85" />
        </svg>
      </div>
    );
  }

  if (name.includes("xl")) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB] mb-4 group-hover:scale-105 transition-transform shadow-sm font-sans font-black text-xl tracking-tighter">
        <span className="text-[#2563EB]">X</span>
        <span className="text-[#059669]">L</span>
      </div>
    );
  }

  if (name.includes("bca")) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#1D4ED8] mb-4 group-hover:scale-105 transition-transform shadow-sm font-serif font-black text-lg">
        BCA
      </div>
    );
  }

  if (name.includes("mandiri")) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] flex items-center justify-center text-[#B45309] mb-4 group-hover:scale-105 transition-transform shadow-sm font-sans font-bold text-sm tracking-wide">
        mandirı
      </div>
    );
  }

  if (name.includes("pertamina")) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#DC2626] mb-4 group-hover:scale-105 transition-transform shadow-sm">
        <div className="w-6 h-6 border-4 border-[#DC2626] border-t-[#2563EB] border-r-[#16A34A] rounded-sm transform rotate-45" />
      </div>
    );
  }

  if (name.includes("astra")) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-center text-[#1C1917] mb-4 group-hover:scale-105 transition-transform shadow-sm font-serif font-bold text-base tracking-widest">
        ASTRA
      </div>
    );
  }

  // Default clean monogram logo
  return (
    <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-center text-[#8C827A] group-hover:text-[#B38E5D] group-hover:border-[#B38E5D] mb-4 transition-colors">
      <Building2 className="w-7 h-7" />
    </div>
  );
}

export default function Partners({ partners, config }: PartnersProps) {
  const badge = config?.badge || "04 • KLIEN & REKANAN";
  const title = config?.title || "Klien Korporat & Mitra Terpercaya";
  const subtitle =
    config?.subtitle ||
    "Dipercaya oleh korporasi telekomunikasi terdepan, perbankan nasional, BUMN, dan institusi terkemuka untuk melayani jamuan resmi dan momen prestisius.";
  const footnote =
    config?.footnote ||
    "Memiliki lokasi acara pribadi atau gedung pilihan keluarga? Tim banquet kami siap melayani di seluruh venue dan kediaman se-Jabodetabek.";

  return (
    <section id="mitra" className="py-24 bg-[#F4EFEB] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-[#B38E5D]" />
            <span className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#8C827A]">
              {badge}
            </span>
            <span className="w-5 h-px bg-[#B38E5D]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-[#57534E] text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Partners Grid: Logo + Nama + Kategori */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="p-7 rounded-3xl bg-white border border-[#E7E2D8] hover:border-[#B38E5D]/60 transition-all duration-300 flex flex-col items-center justify-center text-center group shadow-[0_2px_16px_rgba(28,25,23,0.03)] hover:shadow-lg hover:-translate-y-1"
            >
              {/* Brand Logo Display */}
              <BrandLogoDisplay partner={partner} />

              {/* Title / Name */}
              <h3 className="font-serif font-medium text-base sm:text-lg text-[#1C1917] group-hover:text-[#8F6F3E] transition-colors mb-1.5 leading-snug">
                {partner.name}
              </h3>

              {/* Category */}
              <span className="text-[10px] tracking-[0.16em] uppercase font-mono text-[#8C827A]">
                {partner.category}
              </span>
            </div>
          ))}
        </div>

        {/* Footnote on custom venue coordination */}
        {footnote && (
          <p className="text-center text-xs text-[#8C827A] mt-12 max-w-xl mx-auto leading-relaxed">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
