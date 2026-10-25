"use client";

import { TestimonialItem, TestimonialsSectionConfig } from "@/types/content";

interface TestimonialsProps {
  testimonials: TestimonialItem[];
  config?: TestimonialsSectionConfig;
}

export default function Testimonials({ testimonials, config }: TestimonialsProps) {
  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-[#B38E5D]" />
            <span className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#8C827A]">
              {config?.badge || "06 • KISAH KEPUASAN TAMU"}
            </span>
            <span className="w-5 h-px bg-[#B38E5D]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight mb-3">
            {config?.title || "Ulasan Klien & Pasangan Pengantin"}
          </h2>
          <p className="text-[#57534E] text-sm sm:text-base">
            {config?.subtitle ||
              "Senyuman para tamu dan kepuasan keluarga adalah kebanggaan terbesar bagi tim dapur kami."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="p-8 rounded-3xl bg-white border border-[#E7E2D8] flex flex-col justify-between shadow-[0_4px_24px_rgba(28,25,23,0.03)] hover:shadow-md transition-all duration-300"
            >
              <div>
                <div
                  className="mb-3 flex gap-1 text-sm text-[#B38E5D]"
                  aria-label={`Rating ${testi.rating} dari 5`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      aria-hidden="true"
                      className={index < testi.rating ? "" : "text-[#D6CEBF]"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-2xl font-serif text-[#B38E5D] select-none block mb-2 leading-none">
                  &ldquo;
                </span>
                <p className="font-serif text-base text-[#1C1917] italic leading-relaxed mb-6">
                  {testi.comment}
                </p>
              </div>

              <div className="pt-6 border-t border-[#F4EFEB] flex items-center gap-4">
                <img
                  src={testi.avatarUrl}
                  alt={testi.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E7E2D8]"
                />
                <div>
                  <h4 className="font-serif font-medium text-sm text-[#1C1917]">
                    {testi.name}
                  </h4>
                  <p className="text-xs text-[#8C827A]">{testi.role}</p>
                  <p className="text-[10px] font-mono text-[#B38E5D] mt-0.5">{testi.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
