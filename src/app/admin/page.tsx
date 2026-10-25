"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  CateringContent,
  PortfolioItem,
  PartnerItem,
  TestimonialItem,
  FaqItem,
  SectionVisibility,
} from "@/types/content";
import {
  Camera,
  Upload,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  Building2,
  Share2,
  Sparkles,
  Eye,
  Image as ImageIcon,
  Plus,
  HelpCircle,
  Quote,
  Layout,
  Info,
  User,
  KeyRound,
} from "lucide-react";

const ADMIN_SESSION_EVENT = "royal-admin-session-change";

function subscribeToAdminSession(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(ADMIN_SESSION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(ADMIN_SESSION_EVENT, onChange);
  };
}

function getAdminSessionSnapshot() {
  return localStorage.getItem("royal_admin_token") !== null;
}

export default function AdminPage() {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAdminSession,
    getAdminSessionSnapshot,
    () => false,
  );
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [content, setContent] = useState<CateringContent | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "portfolio"
    | "hero"
    | "about"
    | "partners"
    | "testimonials"
    | "faqs"
    | "company"
    | "logo"
  >("portfolio");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // New photo state
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoCategory, setNewPhotoCategory] = useState("Wedding Banquet");
  const [newPhotoDate, setNewPhotoDate] = useState("");
  const [newPhotoGuest, setNewPhotoGuest] = useState("");
  const [newPhotoDesc, setNewPhotoDesc] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.message || "Gagal memuat konten CMS.");
        }
        return json.data;
      })
      .then((data) => setContent(data))
      .catch((error: unknown) => {
        console.error("Gagal memuat konten CMS:", error);
        setSaveMessage({
          type: "error",
          text: "Gagal memuat konten CMS. Periksa koneksi server lalu muat ulang halaman.",
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const json = await res.json();
      if (json.success) {
        localStorage.setItem("royal_admin_token", json.token);
        window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
        setAuthError("");
      } else {
        setAuthError(json.message || "Username atau Password salah!");
      }
    } catch (err) {
      setAuthError("Gagal menghubungi server autentikasi.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("royal_admin_token");
    window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
  };

  const updateSectionVisibility = (
    section: keyof SectionVisibility,
    visible: boolean,
  ) => {
    if (!content) return;
    setContent({
      ...content,
      sectionVisibility: {
        hero: content.sectionVisibility?.hero ?? true,
        about: content.sectionVisibility?.about ?? true,
        portfolio: content.sectionVisibility?.portfolio ?? true,
        partners: content.sectionVisibility?.partners ?? true,
        testimonials: content.sectionVisibility?.testimonials ?? true,
        faqs: content.sectionVisibility?.faqs ?? true,
        [section]: visible,
      },
    });
  };

  const handleSave = async (updatedData?: CateringContent) => {
    const dataToSave = updatedData || content;
    if (!dataToSave) return;

    if (dataToSave.portfolio.length > 10) {
      setSaveMessage({
        type: "error",
        text: "Kapasitas portofolio maksimal 10 foto! Anda harus mengorbankan salah satu foto terlebih dahulu.",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      const json = await res.json();
      if (json.success) {
        setContent(json.data);
        setSaveMessage({
          type: "success",
          text: "Semua perubahan berhasil disimpan langsung ke file JSON (tanpa database)!",
        });
        setTimeout(() => setSaveMessage(null), 4000);
      } else {
        setSaveMessage({ type: "error", text: json.message });
      }
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: "Gagal menyimpan: " + (err as Error).message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Upload helper
  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Gagal mengunggah gambar.");
    }
    return json.url;
  };

  // Portfolio: Add
  const handleAddNewPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    if (content.portfolio.length >= 10) {
      alert(
        "KUOTA PENUH (10/10 FOTO)!\n\nSesuai aturan sistem, Anda harus mengorbankan (menghapus) salah satu foto portofolio yang ada di bawah sebelum bisa menambahkan foto baru.",
      );
      return;
    }

    let finalImageUrl = newPhotoUrl.trim();

    if (newPhotoFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadImageFile(newPhotoFile);
      } catch (err) {
        alert((err as Error).message);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    if (!finalImageUrl) {
      alert("Mohon pilih file gambar atau masukkan URL gambar!");
      return;
    }

    const newItem: PortfolioItem = {
      id: "port-" + Date.now(),
      title: newPhotoTitle || "Dokumentasi Event Baru",
      category: newPhotoCategory || "Wedding Banquet",
      imageUrl: finalImageUrl,
      eventDate: newPhotoDate || "Terbaru",
      guestCount: newPhotoGuest || "500 Undangan",
      description: newPhotoDesc || "Dokumentasi jamuan katering istimewa.",
    };

    const updatedPortfolio = [...content.portfolio, newItem];
    const updatedContent = { ...content, portfolio: updatedPortfolio };
    setContent(updatedContent);
    handleSave(updatedContent);

    // Reset form
    setNewPhotoTitle("");
    setNewPhotoCategory("Wedding Banquet");
    setNewPhotoDate("");
    setNewPhotoGuest("");
    setNewPhotoDesc("");
    setNewPhotoFile(null);
    setNewPhotoUrl("");
  };

  // Portfolio: Sacrifice
  const handleSacrificePhoto = (index: number) => {
    if (!content) return;
    const target = content.portfolio[index];
    const confirmSacrifice = window.confirm(
      `KORBANKAN FOTO INI?\n\nAnda akan menghapus foto "${target.title}" dari portofolio untuk mengosongkan 1 slot foto.\n\nLanjutkan?`,
    );

    if (confirmSacrifice) {
      const updatedPortfolio = content.portfolio.filter(
        (_, idx) => idx !== index,
      );
      const updatedContent = { ...content, portfolio: updatedPortfolio };
      setContent(updatedContent);
      handleSave(updatedContent);
    }
  };

  // Portfolio: Replace
  const handleReplaceSlotPhoto = async (index: number, file: File) => {
    if (!content) return;
    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImageFile(file);
      const updatedPortfolio = [...content.portfolio];
      updatedPortfolio[index] = {
        ...updatedPortfolio[index],
        imageUrl: uploadedUrl,
      };
      const updatedContent = { ...content, portfolio: updatedPortfolio };
      setContent(updatedContent);
      handleSave(updatedContent);
      alert(`Foto di Slot #${index + 1} berhasil diganti dengan foto baru!`);
    } catch (err) {
      alert("Gagal mengganti foto: " + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  // Portfolio: Reorder
  const handleMovePhoto = (index: number, direction: "up" | "down") => {
    if (!content) return;
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= content.portfolio.length) return;

    const list = [...content.portfolio];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    const updatedContent = { ...content, portfolio: list };
    setContent(updatedContent);
    handleSave(updatedContent);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#181716] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#201E1C] border border-[#3D3835] rounded-3xl p-8 shadow-2xl relative">
          <div className="w-14 h-14 rounded-2xl bg-[#B38E5D]/10 border border-[#B38E5D]/20 flex items-center justify-center mx-auto mb-6 text-[#B38E5D]">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="font-serif text-2xl font-normal text-center text-white mb-1">
            CMS Admin Katering
          </h1>
          <p className="text-[#8C827A] text-xs text-center mb-6">
            Masuk dengan Username &amp; Password untuk mengelola website
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Masukkan username..."
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141211] border border-[#3D3835] text-white placeholder-[#78716C] focus:outline-none focus:border-[#B38E5D] text-sm"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Masukkan password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141211] border border-[#3D3835] text-white placeholder-[#78716C] focus:outline-none focus:border-[#B38E5D] text-sm"
                  required
                />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800 text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#1C1917] font-semibold text-xs uppercase tracking-widest transition shadow-md disabled:opacity-50"
            >
              {isLoggingIn ? "Memverifikasi..." : "Masuk ke Panel Pengelola"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-[#8C827A] hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span>← Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-[#181716] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#B38E5D] animate-spin" />
          <span className="text-sm">Memuat data CMS katering...</span>
        </div>
      </div>
    );
  }

  const portfolioCount = content.portfolio.length;
  const isPortfolioFull = portfolioCount >= 10;

  return (
    <div className="min-h-screen bg-[#141211] text-[#FAF8F5]">
      {/* Top Header Admin */}
      <header className="bg-[#1C1917] border-b border-[#2C2927] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div>
              <h1 className="flex items-center gap-2 font-serif text-base font-medium text-white">
                <span className="truncate">CMS Admin • {content.company.name}</span>
              </h1>
              <p className="text-[10px] text-[#8C827A]">
                Kelola seluruh konten, teks, foto, dan klien website secara
                real-time
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-stretch gap-2 sm:flex sm:items-center sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#3D3835] bg-[#201E1C] px-2.5 text-xs text-[#A8A29E] transition hover:text-white sm:px-3"
            >
              <Eye className="w-3.5 h-3.5 text-[#B38E5D]" />
              <span className="sm:hidden">Website</span>
              <span className="hidden sm:inline">Buka Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#FAF8F5] px-2.5 text-xs font-semibold text-[#1C1917] shadow-sm transition hover:bg-white disabled:opacity-50 sm:px-4"
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span className="sm:hidden">
                {isSaving ? "Simpan..." : "Simpan"}
              </span>
              <span className="hidden sm:inline">
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex min-h-10 items-center justify-center rounded-lg p-2 text-[#8C827A] transition hover:bg-[#201E1C] hover:text-rose-400"
              title="Keluar dari Panel Admin"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Save Notification */}
      {saveMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border animate-in slide-in-from-bottom duration-300 ${
            saveMessage.type === "success"
              ? "bg-emerald-950 text-emerald-200 border-emerald-500"
              : "bg-rose-950 text-rose-200 border-rose-500"
          }`}
        >
          {saveMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-xs sm:text-sm font-medium">
            {saveMessage.text}
          </span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8 rounded-2xl border border-[#2F2C2A] bg-[#1C1917] p-5">
          <div className="mb-4">
            <h2 className="font-serif text-lg font-medium text-white">
              Visibilitas Section Landing Page
            </h2>
            <p className="mt-1 text-xs text-[#8C827A]">
              Atur section mana yang ditampilkan, lalu simpan perubahan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(
              [
                ["hero", "Hero"],
                ["about", "Tentang Kami"],
                ["portfolio", "Portofolio"],
                ["partners", "Klien & Rekanan"],
                ["testimonials", "Testimoni"],
                ["faqs", "FAQ"],
              ] as const
            ).map(([section, label]) => (
              <label
                key={section}
                className="flex items-center gap-2 rounded-xl border border-[#3D3835] bg-[#141211] p-3 text-xs text-white"
              >
                <input
                  type="checkbox"
                  checked={content.sectionVisibility?.[section] ?? true}
                  onChange={(e) =>
                    updateSectionVisibility(section, e.target.checked)
                  }
                  className="accent-[#B38E5D]"
                />
                {label}
              </label>
            ))}
          </div>
          <button
            onClick={() => handleSave()}
            className="mt-4 rounded-xl bg-[#FAF8F5] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917]"
          >
            Simpan Visibilitas
          </button>
        </section>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#2C2927] pb-4">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeTab === "portfolio"
                ? "bg-[#FAF8F5] text-[#1C1917] font-semibold shadow"
                : "bg-[#1C1917] text-[#8C827A] hover:text-white border border-[#2F2C2A]"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Galeri Acara</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                isPortfolioFull
                  ? "bg-rose-900 text-rose-200"
                  : "bg-[#2F2C2A] text-[#DFC69F]"
              }`}
            >
              {portfolioCount}/10
            </span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeTab === "hero"
                ? "bg-[#FAF8F5] text-[#1C1917] font-semibold shadow"
                : "bg-[#1C1917] text-[#8C827A] hover:text-white border border-[#2F2C2A]"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Hero &amp; Headline</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeTab === "about"
                ? "bg-[#FAF8F5] text-[#1C1917] font-semibold shadow"
                : "bg-[#1C1917] text-[#8C827A] hover:text-white border border-[#2F2C2A]"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Tentang Kami</span>
          </button>

          <button
            onClick={() => setActiveTab("partners")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeTab === "partners"
                ? "bg-[#FAF8F5] text-[#1C1917] font-semibold shadow"
                : "bg-[#1C1917] text-[#8C827A] hover:text-white border border-[#2F2C2A]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Klien &amp; Rekanan ({content.partners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeTab === "testimonials"
                ? "bg-[#FAF8F5] text-[#1C1917] font-semibold shadow"
                : "bg-[#1C1917] text-[#8C827A] hover:text-white border border-[#2F2C2A]"
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Testimoni ({content.testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("faqs")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeTab === "faqs"
                ? "bg-[#FAF8F5] text-[#1C1917] font-semibold shadow"
                : "bg-[#1C1917] text-[#8C827A] hover:text-white border border-[#2F2C2A]"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ ({content.faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeTab === "company"
                ? "bg-[#FAF8F5] text-[#1C1917] font-semibold shadow"
                : "bg-[#1C1917] text-[#8C827A] hover:text-white border border-[#2F2C2A]"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Kontak &amp; Sosmed</span>
          </button>

          <button
            onClick={() => setActiveTab("logo")}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeTab === "logo"
                ? "bg-[#FAF8F5] text-[#1C1917] font-semibold shadow"
                : "bg-[#1C1917] text-[#8C827A] hover:text-white border border-[#2F2C2A]"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Logo</span>
          </button>
        </div>

        {/* ===================== TAB 1: PORTOFOLIO (STRICT 10 SLOTS) ===================== */}
        {activeTab === "portfolio" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#2F2C2A] bg-[#1C1917] p-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Badge Section
                </label>
                <input
                  type="text"
                  value={content.portfolioSection?.badge || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      portfolioSection: {
                        badge: e.target.value,
                        title: content.portfolioSection?.title || "",
                        subtitle: content.portfolioSection?.subtitle || "",
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[#2F2C2A] bg-[#141211] px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Judul Section
                </label>
                <input
                  type="text"
                  value={content.portfolioSection?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      portfolioSection: {
                        badge: content.portfolioSection?.badge || "",
                        title: e.target.value,
                        subtitle: content.portfolioSection?.subtitle || "",
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[#2F2C2A] bg-[#141211] px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Deskripsi Section
                </label>
                <textarea
                  rows={2}
                  value={content.portfolioSection?.subtitle || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      portfolioSection: {
                        badge: content.portfolioSection?.badge || "",
                        title: content.portfolioSection?.title || "",
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[#2F2C2A] bg-[#141211] px-3.5 py-2 text-xs text-white"
                />
              </div>
              <button
                onClick={() => handleSave()}
                className="w-fit rounded-xl bg-[#FAF8F5] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917]"
              >
                Simpan Konten Portofolio
              </button>
            </div>

            {/* Quota Banner */}
            <div
              className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isPortfolioFull
                  ? "bg-rose-950/30 border-rose-800 text-rose-200"
                  : "bg-[#201E1C] border-[#3D3835] text-[#D6CEBF]"
              }`}
            >
              <div className="flex items-start gap-3">
                {isPortfolioFull ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#B38E5D] flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-medium text-base text-white flex items-center gap-2">
                    <span>Status Slot Foto Portofolio:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                        isPortfolioFull
                          ? "bg-rose-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {portfolioCount} / 10 Terisi
                    </span>
                  </h3>
                  <p className="text-xs text-[#A8A29E] mt-1 max-w-2xl leading-relaxed">
                    {isPortfolioFull ? (
                      <span className="text-rose-200">
                        ⚠️{" "}
                        <strong>KUOTA MAKSIMAL (10 FOTO) SUDAH PENUH!</strong>{" "}
                        Sesuai aturan: jika Anda ingin mengunggah foto baru,
                        Anda <u>wajib mengorbankan (menghapus)</u> salah satu
                        foto di bawah ini terlebih dahulu, atau klik{" "}
                        <u>Ganti Gambar</u> pada slot yang ingin digantikan.
                      </span>
                    ) : (
                      <span>
                        Tersisa{" "}
                        <strong>{10 - portfolioCount} slot kosong</strong> lagi.
                        Foto portofolio ditampilkan secara eksklusif dalam
                        carousel beranda (maksimal 10 foto).
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Form (Disabled if full) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1917] border border-[#2F2C2A]">
              <h3 className="text-base font-serif font-medium text-white mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#B38E5D]" />
                <span>Tambah Foto Portofolio Baru</span>
              </h3>
              <p className="text-xs text-[#8C827A] mb-5">
                {isPortfolioFull
                  ? "Form terkunci karena kapasitas sudah 10/10 foto. Korbankan salah satu foto di bawah untuk membuka slot baru."
                  : "Unggah foto dokumentasi acara baru untuk mengisi slot berikutnya."}
              </p>

              {isPortfolioFull ? (
                <div className="p-5 rounded-2xl bg-[#141211] border border-dashed border-rose-800 text-center text-xs text-rose-300">
                  🔒 Form penambahan foto dinonaktifkan sementara karena kuota
                  10/10 telah penuh.
                </div>
              ) : (
                <form onSubmit={handleAddNewPortfolio} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#A8A29E] mb-1">
                        Judul Acara
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Resepsi Pernikahan Ballroom Ritz-Carlton"
                        value={newPhotoTitle}
                        onChange={(e) => setNewPhotoTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs focus:border-[#B38E5D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A8A29E] mb-1">
                        Kategori
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Wedding Banquet / Intimate Wedding"
                        value={newPhotoCategory}
                        onChange={(e) => setNewPhotoCategory(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs focus:border-[#B38E5D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A8A29E] mb-1">
                        Waktu Pelaksanaan
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 15 November 2026"
                        value={newPhotoDate}
                        onChange={(e) => setNewPhotoDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs focus:border-[#B38E5D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A8A29E] mb-1">
                        Skala Tamu
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 1.000 Undangan"
                        value={newPhotoGuest}
                        onChange={(e) => setNewPhotoGuest(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs focus:border-[#B38E5D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#A8A29E] mb-1">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Jelaskan konsep jamuan..."
                      value={newPhotoDesc}
                      onChange={(e) => setNewPhotoDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs focus:border-[#B38E5D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#141211] border border-[#2F2C2A]">
                    <div>
                      <label className="block text-xs text-[#DFC69F] font-semibold mb-1">
                        Opsi 1: Unggah File Foto Komputer
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewPhotoFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs text-[#A8A29E] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#B38E5D] file:text-[#1C1917] file:font-semibold cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#DFC69F] font-semibold mb-1">
                        Opsi 2: Atau Masukkan Link URL Foto
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#1C1917] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isUploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isUploading
                        ? "Mengunggah..."
                        : `Unggah ke Slot #${portfolioCount + 1}`}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* List of 10 Slots */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-white font-medium">
                Daftar Slot Foto Saat Ini ({portfolioCount}/10)
              </h3>
              {content.portfolio.map((item, index) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#1C1917] border border-[#2F2C2A] flex flex-col lg:flex-row items-start lg:items-center gap-5"
                >
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#3D3835] flex-shrink-0 group">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/80 text-[#DFC69F] text-[9px] font-mono px-1.5 py-0.5 rounded">
                      SLOT #{index + 1}
                    </div>
                    <label
                      className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[#DFC69F] text-[10px] font-medium p-2 text-center"
                      title="Ganti gambar slot ini"
                    >
                      <span>Ganti Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleReplaceSlotPhoto(index, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                        Judul Acara
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...content.portfolio];
                          updated[index].title = e.target.value;
                          setContent({ ...content, portfolio: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                        Kategori
                      </label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => {
                          const updated = [...content.portfolio];
                          updated[index].category = e.target.value;
                          setContent({ ...content, portfolio: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                        Tanggal &amp; Tamu
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tanggal"
                          value={item.eventDate}
                          onChange={(e) => {
                            const updated = [...content.portfolio];
                            updated[index].eventDate = e.target.value;
                            setContent({ ...content, portfolio: updated });
                          }}
                          className="w-1/2 px-2.5 py-1.5 rounded-lg bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Tamu"
                          value={item.guestCount}
                          onChange={(e) => {
                            const updated = [...content.portfolio];
                            updated[index].guestCount = e.target.value;
                            setContent({ ...content, portfolio: updated });
                          }}
                          className="w-1/2 px-2.5 py-1.5 rounded-lg bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                        Deskripsi
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...content.portfolio];
                          updated[index].description = e.target.value;
                          setContent({ ...content, portfolio: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMovePhoto(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded bg-[#201E1C] text-[#A8A29E] hover:text-white disabled:opacity-30"
                        title="Naikkan"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMovePhoto(index, "down")}
                        disabled={index === content.portfolio.length - 1}
                        className="p-1.5 rounded bg-[#201E1C] text-[#A8A29E] hover:text-white disabled:opacity-30"
                        title="Turunkan"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleSacrificePhoto(index)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold transition border border-rose-800"
                      title="Korbankan foto ini untuk mengosongkan 1 slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Korbankan Foto</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: HERO & HEADLINE ===================== */}
        {activeTab === "hero" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1917] border border-[#2F2C2A] space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-white mb-1">
                Pengaturan Section Hero
              </h3>
              <p className="text-xs text-[#8C827A]">
                Ubah teks judul utama, subheadline, tombol CTA, dan angka
                statistik beranda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={content.hero.badge}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, badge: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Judul Utama (Headline)
                </label>
                <input
                  type="text"
                  value={content.hero.headline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, headline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Deskripsi (Subheadline)
                </label>
                <textarea
                  rows={3}
                  value={content.hero.subheadline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subheadline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Teks Tombol WhatsApp
                </label>
                <input
                  type="text"
                  value={content.hero.ctaWhatsappText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: {
                        ...content.hero,
                        ctaWhatsappText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Teks Tombol Portofolio
                </label>
                <input
                  type="text"
                  value={content.hero.ctaPortfolioText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: {
                        ...content.hero,
                        ctaPortfolioText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#2F2C2A]">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#DFC69F] mb-4">
                4 Kartu Statistik Kepercayaan:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {content.hero.stats.map((stat, idx) => (
                  <div
                    key={stat.id}
                    className="p-4 rounded-xl bg-[#141211] border border-[#2F2C2A] space-y-2"
                  >
                    <span className="text-[10px] font-mono text-[#8C827A]">
                      Stat #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Nilai (e.g. 2.800+)"
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...content.hero.stats];
                        updated[idx].value = e.target.value;
                        setContent({
                          ...content,
                          hero: { ...content.hero, stats: updated },
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded bg-[#201E1C] border border-[#3D3835] text-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Acara Sukses)"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...content.hero.stats];
                        updated[idx].label = e.target.value;
                        setContent({
                          ...content,
                          hero: { ...content.hero, stats: updated },
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Keterangan singkat"
                      value={stat.subtext}
                      onChange={(e) => {
                        const updated = [...content.hero.stats];
                        updated[idx].subtext = e.target.value;
                        setContent({
                          ...content,
                          hero: { ...content.hero, stats: updated },
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded bg-[#201E1C] border border-[#3D3835] text-[#8C827A] text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs uppercase tracking-wider"
            >
              Simpan Hero
            </button>
          </div>
        )}

        {/* ===================== TAB 3: TENTANG KAMI ===================== */}
        {activeTab === "about" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1917] border border-[#2F2C2A] space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-white mb-1">
                Pengaturan Section Tentang Kami
              </h3>
              <p className="text-xs text-[#8C827A]">
                Sesuaikan cerita sejarah, kutipan chef, dan 4 pilar komitmen
                boga.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Badge
                </label>
                <input
                  type="text"
                  value={content.about.badge}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, badge: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Judul Section
                </label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Subjudul Section
                </label>
                <input
                  type="text"
                  value={content.about.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, subtitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-[#2F2C2A] bg-[#141211] px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Cerita Perjalanan
                </label>
                <textarea
                  rows={4}
                  value={content.about.story}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, story: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Kutipan Filosofi Dapur
                </label>
                <textarea
                  rows={2}
                  value={content.about.quote}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, quote: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Nama Pengutip
                </label>
                <input
                  type="text"
                  value={content.about.quoteAuthor || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, quoteAuthor: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-[#2F2C2A] bg-[#141211] px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Jabatan Pengutip
                </label>
                <input
                  type="text"
                  value={content.about.quoteRole || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, quoteRole: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-[#2F2C2A] bg-[#141211] px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#2F2C2A]">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#DFC69F] mb-4">
                4 Pilar Nilai Pelayanan:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {content.about.features.map((feat, idx) => (
                  <div
                    key={feat.id}
                    className="p-4 rounded-xl bg-[#141211] border border-[#2F2C2A] space-y-2"
                  >
                    <span className="text-[10px] font-mono text-[#8C827A]">
                      Pilar #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Judul Pilar"
                      value={feat.title}
                      onChange={(e) => {
                        const updated = [...content.about.features];
                        updated[idx].title = e.target.value;
                        setContent({
                          ...content,
                          about: { ...content.about, features: updated },
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded bg-[#201E1C] border border-[#3D3835] text-white text-xs font-medium"
                    />
                    <textarea
                      rows={3}
                      placeholder="Deskripsi pilar..."
                      value={feat.description}
                      onChange={(e) => {
                        const updated = [...content.about.features];
                        updated[idx].description = e.target.value;
                        setContent({
                          ...content,
                          about: { ...content.about, features: updated },
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded bg-[#201E1C] border border-[#3D3835] text-[#A8A29E] text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs uppercase tracking-wider"
            >
              Simpan Tentang Kami
            </button>
          </div>
        )}

        {/* ===================== TAB 4: KLIEN & REKANAN ===================== */}
        {activeTab === "partners" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1917] border border-[#2F2C2A] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-white mb-1">
                  Pengaturan Klien Korporat &amp; Mitra
                </h3>
                <p className="text-xs text-[#8C827A]">
                  Kelola daftar logo dan nama klien (seperti Telkomsel, Indosat,
                  XL, BCA, Mandiri, Pertamina, dll.)
                </p>
              </div>

              <button
                onClick={() => {
                  const newClient: PartnerItem = {
                    id: "client-" + Date.now(),
                    name: "Nama Perusahaan Baru",
                    category: "Korporat & Instansi",
                    logoUrl: "",
                  };
                  const updated = [...content.partners, newClient];
                  setContent({ ...content, partners: updated });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] text-[#1C1917] text-xs font-semibold uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Klien</span>
              </button>
            </div>

            {/* Section Header Editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#141211] border border-[#2F2C2A]">
              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Badge Section Klien
                </label>
                <input
                  type="text"
                  value={content.partnersSection?.badge || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      partnersSection: {
                        badge: e.target.value,
                        title: content.partnersSection?.title || "",
                        subtitle: content.partnersSection?.subtitle || "",
                        footnote: content.partnersSection?.footnote,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Judul Section Klien
                </label>
                <input
                  type="text"
                  value={
                    content.partnersSection?.title ||
                    "Klien Korporat & Mitra Terpercaya"
                  }
                  onChange={(e) =>
                    setContent({
                      ...content,
                      partnersSection: {
                        badge:
                          content.partnersSection?.badge ||
                          "04 • KLIEN & REKANAN",
                        title: e.target.value,
                        subtitle: content.partnersSection?.subtitle || "",
                        footnote: content.partnersSection?.footnote,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Sub-judul Section
                </label>
                <input
                  type="text"
                  value={
                    content.partnersSection?.subtitle ||
                    "Dipercaya oleh korporasi telekomunikasi terdepan, perbankan nasional, BUMN, dan institusi terkemuka."
                  }
                  onChange={(e) =>
                    setContent({
                      ...content,
                      partnersSection: {
                        badge:
                          content.partnersSection?.badge ||
                          "04 • KLIEN & REKANAN",
                        title:
                          content.partnersSection?.title ||
                          "Klien Korporat & Mitra Terpercaya",
                        subtitle: e.target.value,
                        footnote: content.partnersSection?.footnote,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Catatan di Bawah Daftar Klien
                </label>
                <input
                  type="text"
                  value={content.partnersSection?.footnote || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      partnersSection: {
                        badge: content.partnersSection?.badge || "",
                        title: content.partnersSection?.title || "",
                        subtitle: content.partnersSection?.subtitle || "",
                        footnote: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                />
              </div>
            </div>

            {/* Client Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.partners.map((partner, idx) => (
                <div
                  key={partner.id}
                  className="p-5 rounded-2xl bg-[#141211] border border-[#2F2C2A] space-y-3 relative group"
                >
                  <button
                    onClick={() => {
                      const updated = content.partners.filter(
                        (_, i) => i !== idx,
                      );
                      setContent({ ...content, partners: updated });
                    }}
                    className="absolute top-3 right-3 text-[#78716C] hover:text-rose-400 p-1"
                    title="Hapus Klien"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="text-[10px] font-mono text-[#DFC69F]">
                    Klien #{idx + 1}
                  </span>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Nama Perusahaan / Instansi
                    </label>
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => {
                        const updated = [...content.partners];
                        updated[idx].name = e.target.value;
                        setContent({ ...content, partners: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Kategori Industri
                    </label>
                    <input
                      type="text"
                      value={partner.category}
                      onChange={(e) => {
                        const updated = [...content.partners];
                        updated[idx].category = e.target.value;
                        setContent({ ...content, partners: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Link URL Logo (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://... atau unggah file"
                      value={partner.logoUrl || ""}
                      onChange={(e) => {
                        const updated = [...content.partners];
                        updated[idx].logoUrl = e.target.value;
                        setContent({ ...content, partners: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSave()}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs uppercase tracking-wider"
            >
              Simpan Daftar Klien
            </button>
          </div>
        )}

        {/* ===================== TAB 5: TESTIMONI ===================== */}
        {activeTab === "testimonials" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1917] border border-[#2F2C2A] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-white mb-1">
                  Ulasan &amp; Testimoni Klien
                </h3>
                <p className="text-xs text-[#8C827A]">
                  Tambah, sunting, atau hapus testimoni dari pasangan pengantin
                  dan instansi.
                </p>
              </div>

              <button
                onClick={() => {
                  const newTesti: TestimonialItem = {
                    id: "testi-" + Date.now(),
                    name: "Nama Klien Baru",
                    role: "Resepsi di Venue Pilihan",
                    rating: 5,
                    comment:
                      "Pelayanan katering sangat memuaskan, pramusaji sigap, dan rasa makanan lezat.",
                    event: "Pernikahan",
                    avatarUrl:
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                  };
                  const updated = [...content.testimonials, newTesti];
                  setContent({ ...content, testimonials: updated });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] text-[#1C1917] text-xs font-semibold uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Ulasan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#2F2C2A] bg-[#141211] p-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Badge Section Testimoni
                </label>
                <input
                  type="text"
                  value={content.testimonialsSection?.badge || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      testimonialsSection: {
                        badge: e.target.value,
                        title: content.testimonialsSection?.title || "",
                        subtitle: content.testimonialsSection?.subtitle || "",
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#3D3835] bg-[#201E1C] px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Judul Section Testimoni
                </label>
                <input
                  type="text"
                  value={content.testimonialsSection?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      testimonialsSection: {
                        badge: content.testimonialsSection?.badge || "",
                        title: e.target.value,
                        subtitle: content.testimonialsSection?.subtitle || "",
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#3D3835] bg-[#201E1C] px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Deskripsi Section Testimoni
                </label>
                <textarea
                  rows={2}
                  value={content.testimonialsSection?.subtitle || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      testimonialsSection: {
                        badge: content.testimonialsSection?.badge || "",
                        title: content.testimonialsSection?.title || "",
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#3D3835] bg-[#201E1C] px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.testimonials.map((testi, idx) => (
                <div
                  key={testi.id}
                  className="p-5 rounded-2xl bg-[#141211] border border-[#2F2C2A] space-y-3 relative group"
                >
                  <button
                    onClick={() => {
                      const updated = content.testimonials.filter(
                        (_, i) => i !== idx,
                      );
                      setContent({ ...content, testimonials: updated });
                    }}
                    className="absolute top-3 right-3 text-[#78716C] hover:text-rose-400 p-1"
                    title="Hapus Ulasan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="text-[10px] font-mono text-[#DFC69F]">
                    Testimoni #{idx + 1}
                  </span>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Nama Pengulas
                    </label>
                    <input
                      type="text"
                      value={testi.name}
                      onChange={(e) => {
                        const updated = [...content.testimonials];
                        updated[idx].name = e.target.value;
                        setContent({ ...content, testimonials: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Peran / Lokasi Acara
                    </label>
                    <input
                      type="text"
                      value={testi.role}
                      onChange={(e) => {
                        const updated = [...content.testimonials];
                        updated[idx].role = e.target.value;
                        setContent({ ...content, testimonials: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Detail Acara
                    </label>
                    <input
                      type="text"
                      value={testi.event}
                      onChange={(e) => {
                        const updated = [...content.testimonials];
                        updated[idx].event = e.target.value;
                        setContent({ ...content, testimonials: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={testi.rating}
                      onChange={(e) => {
                        const updated = [...content.testimonials];
                        updated[idx].rating = Math.min(
                          5,
                          Math.max(1, Number(e.target.value)),
                        );
                        setContent({ ...content, testimonials: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      URL Foto Profil
                    </label>
                    <input
                      type="url"
                      value={testi.avatarUrl}
                      onChange={(e) => {
                        const updated = [...content.testimonials];
                        updated[idx].avatarUrl = e.target.value;
                        setContent({ ...content, testimonials: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Komentar Ulasan
                    </label>
                    <textarea
                      rows={3}
                      value={testi.comment}
                      onChange={(e) => {
                        const updated = [...content.testimonials];
                        updated[idx].comment = e.target.value;
                        setContent({ ...content, testimonials: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSave()}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs uppercase tracking-wider"
            >
              Simpan Testimoni
            </button>
          </div>
        )}

        {/* ===================== TAB 6: FAQ ===================== */}
        {activeTab === "faqs" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1917] border border-[#2F2C2A] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-white mb-1">
                  Tanya Jawab (FAQ)
                </h3>
                <p className="text-xs text-[#8C827A]">
                  Pertanyaan yang sering diajukan seputar booking dan food
                  tasting.
                </p>
              </div>

              <button
                onClick={() => {
                  const newFaq: FaqItem = {
                    id: "faq-" + Date.now(),
                    question: "Pertanyaan Baru...",
                    answer: "Jawaban penjelasan...",
                  };
                  const updated = [...content.faqs, newFaq];
                  setContent({ ...content, faqs: updated });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] text-[#1C1917] text-xs font-semibold uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah FAQ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#2F2C2A] bg-[#141211] p-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Badge Section FAQ
                </label>
                <input
                  type="text"
                  value={content.faqsSection?.badge || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      faqsSection: {
                        badge: e.target.value,
                        title: content.faqsSection?.title || "",
                        subtitle: content.faqsSection?.subtitle || "",
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#3D3835] bg-[#201E1C] px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Judul Section FAQ
                </label>
                <input
                  type="text"
                  value={content.faqsSection?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      faqsSection: {
                        badge: content.faqsSection?.badge || "",
                        title: e.target.value,
                        subtitle: content.faqsSection?.subtitle || "",
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#3D3835] bg-[#201E1C] px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-mono text-[#A8A29E]">
                  Deskripsi Section FAQ
                </label>
                <textarea
                  rows={2}
                  value={content.faqsSection?.subtitle || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      faqsSection: {
                        badge: content.faqsSection?.badge || "",
                        title: content.faqsSection?.title || "",
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#3D3835] bg-[#201E1C] px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              {content.faqs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className="p-5 rounded-2xl bg-[#141211] border border-[#2F2C2A] space-y-3 relative group"
                >
                  <button
                    onClick={() => {
                      const updated = content.faqs.filter((_, i) => i !== idx);
                      setContent({ ...content, faqs: updated });
                    }}
                    className="absolute top-3 right-3 text-[#78716C] hover:text-rose-400 p-1"
                    title="Hapus Pertanyaan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="text-[10px] font-mono text-[#DFC69F]">
                    FAQ #{idx + 1}
                  </span>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Pertanyaan
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...content.faqs];
                        updated[idx].question = e.target.value;
                        setContent({ ...content, faqs: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#8C827A] block mb-1">
                      Jawaban
                    </label>
                    <textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...content.faqs];
                        updated[idx].answer = e.target.value;
                        setContent({ ...content, faqs: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#201E1C] border border-[#3D3835] text-white text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSave()}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs uppercase tracking-wider"
            >
              Simpan FAQ
            </button>
          </div>
        )}

        {/* ===================== TAB 7: KONTAK & SOSMED ===================== */}
        {activeTab === "company" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1917] border border-[#2F2C2A] space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-white mb-1">
                Profil &amp; Saluran Kontak
              </h3>
              <p className="text-xs text-[#8C827A]">
                Kelola nomor WhatsApp, pesan default, tautan Instagram &amp;
                Facebook, serta alamat kantor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Nama Brand
                </label>
                <input
                  type="text"
                  value={content.company.name}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, name: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Tahun Berdiri
                </label>
                <input
                  type="number"
                  value={content.company.establishedYear}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: {
                        ...content.company,
                        establishedYear: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Deskripsi Brand
                </label>
                <textarea
                  rows={3}
                  value={content.company.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: {
                        ...content.company,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Nomor WhatsApp (Format: 628...)
                </label>
                <input
                  type="text"
                  value={content.company.whatsapp}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, whatsapp: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-emerald-400 font-mono text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Pesan Pembuka Otomatis WhatsApp (Prefilled Text)
                </label>
                <input
                  type="text"
                  value={content.company.whatsappPrefilledMessage}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: {
                        ...content.company,
                        whatsappPrefilledMessage: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Link Instagram
                </label>
                <input
                  type="url"
                  value={content.company.instagram}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: {
                        ...content.company,
                        instagram: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Link Facebook
                </label>
                <input
                  type="url"
                  value={content.company.facebook}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, facebook: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={content.company.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, email: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Telepon
                </label>
                <input
                  type="text"
                  value={content.company.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, phone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Alamat Kantor
                </label>
                <input
                  type="text"
                  value={content.company.address}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, address: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Kota
                </label>
                <input
                  type="text"
                  value={content.company.city}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, city: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Jam Operasional
                </label>
                <input
                  type="text"
                  value={content.company.openingHours}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: {
                        ...content.company,
                        openingHours: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A8A29E] mb-1">
                  Teks Hak Cipta
                </label>
                <input
                  type="text"
                  value={content.company.copyrightText || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: {
                        ...content.company,
                        copyrightText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141211] border border-[#2F2C2A] text-white text-xs"
                />
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs uppercase tracking-wider"
            >
              Simpan Profil Kontak
            </button>
          </div>
        )}

        {/* ===================== TAB 8: LOGO ===================== */}
        {activeTab === "logo" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1917] border border-[#2F2C2A] space-y-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-white mb-1">
                Logo
              </h3>
              <p className="text-xs text-[#8C827A]">
                Unggah logo brand yang akan digunakan bersama di navbar dan
                footer.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-[#4A4541] bg-[#FAF8F5] p-5">
                {content.company.logoUrl ? (
                  <img
                    src={content.company.logoUrl}
                    alt={`Pratinjau logo ${content.company.name}`}
                    className="h-12 max-h-12 w-auto max-w-[180px] object-contain"
                  />
                ) : (
                  <span className="text-xs text-[#8C827A]">
                    Belum ada gambar logo. Logo teks akan tetap ditampilkan
                    sampai gambar diunggah.
                  </span>
                )}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#4A4541] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#2F2C2A]">
                <Upload className="h-4 w-4" />
                <span>
                  {isUploading ? "Mengunggah..." : "Pilih gambar logo"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  disabled={isUploading}
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setIsUploading(true);
                    try {
                      const logoUrl = await uploadImageFile(file);
                      setContent({
                        ...content,
                        company: { ...content.company, logoUrl },
                      });
                    } catch (err) {
                      alert((err as Error).message);
                    } finally {
                      setIsUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </div>

            <button
              onClick={() => handleSave()}
              disabled={isSaving || isUploading}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs uppercase tracking-wider"
            >
              Simpan Logo
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
