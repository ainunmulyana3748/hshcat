"use client";

import { CompanyInfo } from "@/types/content";
import { MessageCircle } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";

interface FloatingWhatsAppProps {
  company: CompanyInfo;
}

export default function FloatingWhatsApp({ company }: FloatingWhatsAppProps) {
  const waUrl = generateWhatsAppUrl(
    company.whatsapp,
    company.whatsappPrefilledMessage
  );

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi via WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1C1917] hover:bg-[#2C3E2D] text-[#FAF8F5] border border-[#3D3835] shadow-[0_8px_24px_rgba(28,25,23,0.18)] hover:shadow-[0_12px_28px_rgba(28,25,23,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
      >
        <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-4 h-4 fill-white" />
        </div>
        <div className="flex flex-col text-left pr-1">
          <span className="text-[11px] font-semibold tracking-wide uppercase leading-tight">
            Konsultasi WhatsApp
          </span>
          <span className="text-[9px] text-[#A8A29E] font-mono leading-none">
            Respon Cepat
          </span>
        </div>
      </a>
    </div>
  );
}
