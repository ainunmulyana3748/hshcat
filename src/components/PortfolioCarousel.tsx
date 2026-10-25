"use client";

import { useState, useEffect } from "react";
import { PortfolioItem, PortfolioSectionConfig } from "@/types/content";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Users,
  X,
  ArrowUpRight,
} from "lucide-react";

interface PortfolioCarouselProps {
  portfolio: PortfolioItem[];
  config?: PortfolioSectionConfig;
}

export default function PortfolioCarousel({
  portfolio,
  config,
}: PortfolioCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const totalSlides = Math.min(portfolio.length, 10);

  // Auto-play interval with pause on hover
  useEffect(() => {
    if (!isAutoPlay || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  if (!portfolio || portfolio.length === 0) {
    return (
      <section id="portofolio" className="py-24 bg-[#181716] text-center text-[#8C827A]">
        <p>Belum ada dokumentasi portofolio yang diunggah.</p>
      </section>
    );
  }

  const activeItem = portfolio[currentIndex];

  return (
    <section
      id="portofolio"
      className="py-24 md:py-32 bg-[#181716] text-[#FAF8F5] relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-[#2C2927]">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-[#B38E5D]" />
              <span className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#B38E5D]">
                {config?.badge || "03 • DOKUMENTASI EVENT"}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#FAF8F5]">
              {config?.title || "Galeri Portofolio & Jamuan"}
            </h2>
            <p className="text-[#8C827A] text-sm sm:text-base mt-2 max-w-xl">
              {config?.subtitle ||
                "Koleksi dokumentasi event terpilih kami, mulai dari resepsi pernikahan hingga jamuan private dining."}
            </p>
          </div>

          {/* Minimalist Controls */}
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <span className="font-mono text-sm tracking-widest text-[#B38E5D]">
              {String(currentIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Dokumentasi Sebelumnya"
                className="w-11 h-11 rounded-full border border-[#3D3835] hover:border-[#FAF8F5] hover:bg-white/5 flex items-center justify-center transition-all duration-200 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-[#FAF8F5]" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Dokumentasi Selanjutnya"
                className="w-11 h-11 rounded-full border border-[#3D3835] hover:border-[#FAF8F5] hover:bg-white/5 flex items-center justify-center transition-all duration-200 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 text-[#FAF8F5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Grand Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#201E1C] rounded-3xl p-6 sm:p-10 border border-[#2F2C2A] shadow-2xl">
          {/* Main Visual Display */}
          <div className="lg:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#141211] group">
            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              key={activeItem.id}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Category Pill */}
            <div className="absolute top-5 left-5">
              <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#DFC69F] border border-white/10 text-xs font-medium tracking-wide">
                {activeItem.category}
              </span>
            </div>

            {/* Lightbox Zoom Trigger */}
            <button
              onClick={() => setLightboxItem(activeItem)}
              className="absolute bottom-5 right-5 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-[#DFC69F] hover:bg-black/80 border border-white/20 flex items-center justify-center transition group-hover:scale-105"
              title="Perbesar Layar Penuh"
              aria-label="Lihat Layar Penuh"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Narrative & Details */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full py-2">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#8C827A] mb-3">
                <span>SLOT #{currentIndex + 1}</span>
                <span>MAKSIMAL 10 FOTO</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-snug mb-4">
                {activeItem.title}
              </h3>

              <p className="text-[#A8A29E] text-sm leading-relaxed mb-6">
                {activeItem.description}
              </p>

              {/* Event Attributes */}
              <div className="space-y-3 pt-6 border-t border-[#2F2C2A] text-xs text-[#A8A29E]">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#B38E5D]" />
                  <span className="text-white font-medium">Pelaksanaan:</span>
                  <span>{activeItem.eventDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-[#B38E5D]" />
                  <span className="text-white font-medium">Skala Acara:</span>
                  <span>{activeItem.guestCount}</span>
                </div>
              </div>
            </div>

            {/* 10-Slot Quick Thumbnail Strip */}
            <div className="mt-8 pt-6 border-t border-[#2F2C2A]">
              <div className="flex items-center justify-between mb-3 text-xs text-[#8C827A]">
                <span>Pilih Foto Portofolio:</span>
                <span className="font-mono text-[10px] text-[#B38E5D]">
                  {currentIndex + 1} of {totalSlides}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {portfolio.slice(0, 10).map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                      currentIndex === idx
                        ? "border-[#B38E5D] ring-1 ring-[#B38E5D] scale-105"
                        : "border-[#3D3835] opacity-50 hover:opacity-100"
                    }`}
                    title={`Slot #${idx + 1}: ${item.title}`}
                    aria-label={`Lihat foto ${idx + 1}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono text-white px-1">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-[#1C1917] border border-[#2F2C2A] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 px-6 border-b border-[#2F2C2A] bg-[#141211]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#B38E5D] uppercase">
                  {lightboxItem.category}
                </span>
                <h4 className="font-serif text-lg font-normal text-white">
                  {lightboxItem.title}
                </h4>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-2 text-[#8C827A] hover:text-white rounded-lg transition"
                aria-label="Tutup Pratinjau"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded"
              />
            </div>

            <div className="p-4 px-6 bg-[#181716] border-t border-[#2F2C2A] text-xs text-[#A8A29E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>{lightboxItem.description}</p>
              <div className="flex items-center gap-4 text-[#DFC69F] whitespace-nowrap font-mono text-[11px]">
                <span>{lightboxItem.eventDate}</span>
                <span>•</span>
                <span>{lightboxItem.guestCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
