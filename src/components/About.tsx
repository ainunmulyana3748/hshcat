"use client";

import { AboutSection } from "@/types/content";
import { UtensilsCrossed, Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";

interface AboutProps {
  about: AboutSection;
}

export default function About({ about }: AboutProps) {
  return (
    <section id="tentang" className="py-24 md:py-32 bg-[#F4EFEB] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#8C827A] block mb-3">
            {about.badge}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1C1917] leading-tight mb-6">
            {about.title}
          </h2>
          <p className="text-[#8C827A] text-sm sm:text-base leading-relaxed mb-4">
            {about.subtitle}
          </p>
          <p className="text-[#57534E] text-base sm:text-lg leading-relaxed">
            {about.story}
          </p>
        </div>

        {/* Highlight Quote Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E7E2D8] mb-16 shadow-[0_4px_24px_rgba(28,25,23,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#8F6F3E] block mb-2">
              Filosofi Dapur Kami
            </span>
            <p className="font-serif text-xl sm:text-2xl italic text-[#1C1917] leading-relaxed">
              &ldquo;{about.quote}&rdquo;
            </p>
          </div>
          <div className="flex-shrink-0 border-l md:border-l border-[#E7E2D8] pl-0 md:pl-8 pt-4 md:pt-0">
            <p className="font-serif text-base font-medium text-[#1C1917]">
              {about.quoteAuthor || ""}
            </p>
            <p className="text-xs text-[#8C827A] mt-0.5">
              {about.quoteRole || ""}
            </p>
          </div>
        </div>

        {/* 4 Pillars of Hospitality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.features.map((feat, index) => (
            <div
              key={feat.id}
              className="p-7 rounded-2xl bg-white/70 hover:bg-white border border-[#E7E2D8] transition-all duration-300 hover:shadow-sm group flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs text-[#8C827A] block mb-4">
                  0{index + 1}
                </span>
                <h3 className="font-serif text-lg font-medium text-[#1C1917] mb-2 group-hover:text-[#8F6F3E] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {feat.description}
                </p>
              </div>
              <div className="w-8 h-px bg-[#E7E2D8] mt-6 group-hover:w-full group-hover:bg-[#B38E5D] transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
