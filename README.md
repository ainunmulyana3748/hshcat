# Royal Rasa Catering & Event - Fullstack Next.js Website & CMS

Website Landing Page & Content Management System (CMS) Premium untuk usaha Jasa Boga & Catering, dibangun dengan standar Fullstack Next.js modern, ramah SEO, dan **100% Tanpa Database (Flat-File Storage)**.

---

## 🌟 Fitur Utama Website

1. **Desain Mewah & Responsif (Luxury Aesthetic):**
   - Palette warna *Dark Charcoal, Royal Amber Gold, & Emerald*.
   - Responsive di seluruh ukuran layar (Mobile, Tablet, Desktop).

2. **Koneksi Sosial Media Terintegrasi Penuh:**
   - **WhatsApp:** Tombol Live Chat langsung dengan pesan otomatis (*prefilled text*) untuk konsultasi menu dan floating button beranimasi.
   - **Instagram:** Direct button ke akun Instagram profil & feed.
   - **Facebook:** Direct button ke halaman Facebook resmi.

3. **Dokumentasi Event & Portofolio Carousel (Maksimal 10 Foto):**
   - Slider / Carousel otomatis dan interaktif.
   - Navigasi tombol panah, indikator titik, dan thumbnail selector.
   - Menampilkan detail acara: Tanggal, Skala Undangan (Tamu), Kategori, dan Deskripsi.
   - Fitur **Lightbox Fullscreen Zoom** untuk melihat foto resolusi tinggi.

4. **Section Mitra & Venue:**
   - Menampilkan mitra ballroom, hotel bintang 5, BUMN, dan wedding platform (Hotel Mulia, Balai Kartini, Bridestory, Mandiri, Telkom, Plataran, Ritz-Carlton).

5. **Paket Menu Interaktif:**
   - Paket Wedding Sultan, Prasmanan Executive, Nasi Box Premium, dan VIP Private Dining.
   - Tombol pesan langsung spesifik ke WhatsApp untuk setiap paket.

6. **SEO Kelas Atas (Technical SEO & Schema.org):**
   - Metadata lengkap (Title, Description, OpenGraph, Twitter Card).
   - Dynamic **JSON-LD Schema Markup** Google (`CateringService`, `LocalBusiness`, `FoodEstablishment`, `AggregateRating`, `OpeningHoursSpecification`).
   - Otomatis membuat `robots.txt` dan `sitemap.xml`.

---

## 🛠️ Penyimpanan CMS

Saat development lokal, konten CMS menggunakan file `src/data/catering-content.json` dan foto disimpan di `public/uploads/`.

Pada deployment serverless (seperti Vercel), filesystem aplikasi bersifat read-only dan tidak dapat digunakan untuk penyimpanan permanen. Hubungkan **Vercel Blob** dengan akses **Public** ke project untuk menyimpan konten CMS dan foto. URL foto perlu dapat dibuka oleh pengunjung website.

1. Buat Blob Store dengan akses **Public** dari dashboard Vercel dan hubungkan ke project ini. Tipe akses ditentukan saat store dibuat; jika store yang terhubung bertipe Private, buat atau hubungkan store Public.
2. Pastikan deployment memiliki `BLOB_READ_WRITE_TOKEN`, atau gunakan koneksi Blob dengan Vercel OIDC dan `BLOB_STORE_ID`.
3. Aktifkan environment Production (dan Preview jika diperlukan), lalu deploy ulang.

Untuk menggunakan penyimpanan cloud saat development lokal, tambahkan `BLOB_READ_WRITE_TOKEN` ke `.env.local`. Jangan commit token tersebut.

### Aturan Khusus Portofolio (Maksimal 10 Foto & Sistem Pengorbanan):
* Portofolio memiliki kuota ketat maksimal **10 foto**.
* Jika kuota sudah terisi penuh (10/10), form upload foto baru **otomatis terkunci** dengan peringatan:
  > *"⚠️ Kuota Portofolio Penuh (10/10). Untuk mengunggah foto baru, Anda harus MENGORBANKAN / MENGHAPUS salah satu foto yang ada terlebih dahulu."*
* Admin dapat:
  1. Menekan tombol merah **"Korbankan Foto"** pada salah satu slot untuk mengosongkan 1 slot.
  2. Atau menekan tombol **"Ganti Foto"** pada thumbnail slot tertentu untuk langsung menimpa foto lama dengan foto baru.
  3. Mengatur urutan foto (Naik / Turun).

---

## 🚀 Cara Menjalankan

Masuk ke folder `catering-web`:
```bash
cd catering-web
```

Jalankan Development Server:
```bash
npm run dev
```
Buka browser:
* **Website Utama:** [http://localhost:3000](http://localhost:3000)
* **Dashboard CMS:** [http://localhost:3000/admin](http://localhost:3000/admin)

> **Kredensial Akses CMS:**  
> Masukkan PIN Admin: `admin123`
