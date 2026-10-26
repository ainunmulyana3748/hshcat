import fs from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";
import { CateringContent } from "@/types/content";
import { shouldUseBlobStorage } from "@/lib/blob-storage";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "catering-content.json");
const CONTENT_BLOB_PATH = "cms/catering-content.json";

async function readCloudContent(): Promise<CateringContent | null> {
  const { blobs } = await list({ prefix: CONTENT_BLOB_PATH, limit: 1 });
  const contentBlob = blobs.find(
    (blob) => blob.pathname === CONTENT_BLOB_PATH,
  );

  if (!contentBlob) return null;

  const response = await fetch(contentBlob.url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Gagal membaca konten dari penyimpanan cloud (${response.status}).`);
  }

  return JSON.parse(await response.text()) as CateringContent;
}

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
    const cloudData = shouldUseBlobStorage() ? await readCloudContent() : null;
    const data: CateringContent = cloudData
      ? cloudData
      : JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf-8"));
    ensureSeoSettings(data);

    // Safety check: ensure portfolio never exceeds 10
    if (data.portfolio && data.portfolio.length > 10) {
      data.portfolio = data.portfolio.slice(0, 10);
    }

    return data;
  } catch (error) {
    console.error("Gagal membaca file data katering:", error);
    throw new Error(
      error instanceof Error
        ? `Gagal memuat data konten: ${error.message}`
        : "Gagal memuat data konten. Periksa konfigurasi penyimpanan cloud.",
    );
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
  if (shouldUseBlobStorage()) {
    await put(CONTENT_BLOB_PATH, jsonString, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      // Konten CMS harus langsung menampilkan versi terbaru setelah disimpan.
      cacheControlMaxAge: 0,
    });
  } else {
    await fs.writeFile(DATA_FILE_PATH, jsonString, "utf-8");
  }

  return newData;
}
