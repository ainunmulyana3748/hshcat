import fs from "fs/promises";
import path from "path";
import { CateringContent } from "@/types/content";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "catering-content.json");

function ensureSeoSettings(content: CateringContent): CateringContent {
  const seo = content.seo;
  content.seo = {
    metaTitle:
      seo?.metaTitle || `${content.company.name} | Catering Premium Jakarta`,
    metaDescription: seo?.metaDescription || content.company.description,
    keywords: seo?.keywords ?? [
      "catering premium Jakarta",
      "jasa catering Jakarta",
      "wedding catering",
      "event catering",
    ],
    ogImage:
      seo?.ogImage ||
      content.company.logoUrl ||
      content.portfolio[0]?.imageUrl ||
      "",
    canonicalUrl: seo?.canonicalUrl || "https://royalrasacatering.com",
  };
  return content;
}

export async function getContent(): Promise<CateringContent> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data: CateringContent = JSON.parse(raw);
    ensureSeoSettings(data);

    // Safety check: ensure portfolio never exceeds 10
    if (data.portfolio && data.portfolio.length > 10) {
      data.portfolio = data.portfolio.slice(0, 10);
    }

    return data;
  } catch (error) {
    console.error("Gagal membaca file data katering:", error);
    throw new Error("Gagal memuat data konten.");
  }
}

export async function saveContent(newData: CateringContent): Promise<CateringContent> {
  // STRICT VALIDATION: Max 10 photos in portfolio
  if (newData.portfolio && newData.portfolio.length > 10) {
    throw new Error(
      "Kapasitas portofolio maksimal adalah 10 foto. Anda harus mengorbankan atau menghapus salah satu foto terlebih dahulu."
    );
  }

  ensureSeoSettings(newData);
  newData.lastUpdated = new Date().toISOString();

  const jsonString = JSON.stringify(newData, null, 2);
  await fs.writeFile(DATA_FILE_PATH, jsonString, "utf-8");
  return newData;
}
