"use client";

import { CompanyInfo, HeroSection } from "@/types/content";
import { MessageCircle, ArrowRight, ShieldCheck, Award, ChevronDown } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";

interface HeroProps {
  company: CompanyInfo;
  hero: HeroSection;
}

export default function Hero({ company, hero }: HeroProps) {
  const waUrl = generateWhatsAppUrl(
    company.whatsapp,
    company.whatsappPrefilledMessage
  );

  return (
    <section
      id="beranda"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#FAF8F5] overflow-hidden border-b border-[#E7E2D8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Eyebrow */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-6 h-px bg-[#B38E5D]" />
            <span className="text-[11px] font-medium tracking-[0.24em] uppercase text-[#8C827A]">
              {hero.badge}
            </span>
            <span className="w-6 h-px bg-[#B38E5D]" />
          </div>

          {/* Master Headline: Editorial Serif */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1C1917] leading-[1.12] tracking-tight mb-7">
            {hero.headline}
          </h1>

          {/* Thoughtful Subtitle */}
          <p className="text-[#57534E] text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mb-10">
            {hero.subheadline}
          </p>

          {/* Action Row: Refined & Elegant */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-16">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1C1917] hover:bg-[#2C3E2D] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{hero.ctaWhatsappText}</span>
            </a>

            <a
              href="#portofolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent hover:bg-[#F4EFEB] text-[#1C1917] border border-[#D6CEBF] text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300"
            >
              <span>{hero.ctaPortfolioText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8C827A]" />
            </a>
          </div>
        </div>

        {/* Featured Editorial Visual Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-16">
          {/* Main Large Visual */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden aspect-[16/10] bg-[#EFECE6] border border-[#E7E2D8] group shadow-[0_10px_30px_rgba(28,25,23,0.06)]">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85"
              alt="Grand Wedding Banquet Table Decor"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#E6D5B8] mb-1">
                  Private Ballroom Reception
                </p>
                <p className="font-serif text-xl sm:text-2xl font-normal">
                  Grand Ballroom Hotel Mulia Senayan
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono tracking-wide px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                1.200 Tamu Undangan
              </span>
            </div>
          </div>

          {/* Secondary Editorial Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            {/* Card 1: Chef & Culinary Craft */}
            <div className="rounded-3xl p-7 bg-white border border-[#E7E2D8] flex-1 flex flex-col justify-between shadow-[0_4px_20px_rgba(28,25,23,0.03)]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C827A] block mb-2">
                  Komitmen Mutu &amp; Higienitas
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1C1917] mb-3">
                  Executive Chef &amp; 100% Sertifikasi Halal
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Setiap menu diracik di bawah standar sanitasi HACCP dan bahan baku segar pilihan Grade A dari mitra petani terpercaya.
                </p>
              </div>

              <div className="pt-4 border-t border-[#F4EFEB] flex items-center justify-between text-xs text-[#8C827A]">
                <span>Tasting Lounge Senopati</span>
                <span className="font-mono text-[#1C1917]">Free Food Tasting</span>
              </div>
            </div>

            {/* Card 2: Small atmospheric picture */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] lg:aspect-auto lg:h-48 bg-[#EFECE6] border border-[#E7E2D8] group">
              <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"
                alt="Plating detail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#DFC69F]">
                  Live Culinary Station
                </p>
                <p className="font-serif text-sm font-normal">
                  Carving &amp; Fine Dining Set Menu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Trust Counter */}
        <div className="pt-10 border-t border-[#E7E2D8] grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
          {hero.stats.map((stat, idx) => (
            <div key={stat.id} className="space-y-1">
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#8C827A]">
                0{idx + 1} • {stat.label}
              </span>
              <p className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1917]">
                {stat.value}
              </p>
              <p className="text-xs text-[#57534E] font-normal">{stat.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
