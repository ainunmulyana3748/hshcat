import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Helper to safely delete file inside public/uploads
async function safelyDeleteUploadFile(fileUrl?: string | null) {
  if (!fileUrl || typeof fileUrl !== "string") return;
  if (!fileUrl.startsWith("/uploads/")) return;

  try {
    const fileName = path.basename(fileUrl);
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    // Path traversal check
    if (!filePath.startsWith(uploadDir)) return;

    await fs.unlink(filePath).catch(() => {});
  } catch (err) {
    console.warn("Could not delete old upload file:", fileUrl, err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const oldUrl = formData.get("oldUrl") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    // Validasi tipe file gambar
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Format file tidak didukung! Gunakan JPG, PNG, WebP, atau SVG.",
        },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maksimal 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran file terlalu besar! Maksimal 5MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pastikan folder public/uploads ada
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Hapus file lama jika ada (agar tidak ada sampah file yang tersimpan)
    if (oldUrl) {
      await safelyDeleteUploadFile(oldUrl);
    }

    // Bersihkan nama file dan beri timestamp
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${cleanName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      message: "Foto berhasil diunggah!",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengunggah foto: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "URL file tidak valid." },
        { status: 400 }
      );
    }

    await safelyDeleteUploadFile(url);

    return NextResponse.json({
      success: true,
      message: "File berhasil dihapus dari penyimpanan.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus file: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
