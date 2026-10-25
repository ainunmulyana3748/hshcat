import { NextRequest, NextResponse } from "next/server";

const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || "HSH_Catering";
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || "hshcatering123";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (
      username?.trim() === DEFAULT_ADMIN_USER &&
      password?.trim() === DEFAULT_ADMIN_PASS
    ) {
      return NextResponse.json({
        success: true,
        message: "Login admin berhasil!",
        token:
          "session_royal_admin_" +
          Buffer.from(`${username}:${password}`).toString("base64"),
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Username atau Password salah! Silakan periksa kembali.",
      },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memproses autentikasi admin." },
      { status: 500 },
    );
  }
}
