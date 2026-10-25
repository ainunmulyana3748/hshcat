"use client";

import { useState } from "react";
import { FaqItem, FaqsSectionConfig } from "@/types/content";
import { Plus, Minus } from "lucide-react";

interface FaqProps {
  faqs: FaqItem[];
  config?: FaqsSectionConfig;
}

export default function Faq({ faqs, config }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#FAF8F5] border-b border-[#E7E2D8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-[#B38E5D]" />
            <span className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#8C827A]">
              {config?.badge || "07 • TANYA JAWAB"}
            </span>
            <span className="w-5 h-px bg-[#B38E5D]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight mb-3">
            {config?.title || "Pertanyaan yang Sering Diajukan"}
          </h2>
          <p className="text-[#57534E] text-sm sm:text-base">
            {config?.subtitle ||
              "Informasi esensial terkait proses booking tanggal, sesi food tasting, dan operasional boga kami."}
          </p>
        </div>

        <div className="divide-y divide-[#E7E2D8] border-y border-[#E7E2D8]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id} className="py-6 transition-colors">
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left flex items-center justify-between gap-6 focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl font-normal text-[#1C1917] group-hover:text-[#8F6F3E] transition-colors">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-[#D6CEBF] flex items-center justify-center flex-shrink-0 text-[#1C1917] group-hover:border-[#1C1917] transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="pt-4 pr-12 text-[#57534E] text-sm sm:text-base leading-relaxed animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
