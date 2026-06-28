# Perpustakaan Digital - Frontend

Sistem Informasi Perpustakaan Digital (Frontend). Aplikasi ini dibangun dengan antarmuka yang responsif untuk pengguna Mahasiswa dan Admin.

## Identitas Kelompok

| Keterangan | Isi |
|---|---|
| Nama Project | Sistem Informasi Perpustakaan Digital |
| Mata Kuliah | Layanan Web |
| Kelompok | Kelompok 1 |
| Dosen Pengampu | Teguh Ikhlas Ramadhan, S.Kom., M.Kom. |
| UI/UX | Muhammad Aldian Nurrahman |
| Frontend | Muhammad Zulfa Septiawan |
| Backend | Raihan Nouval Yashir |
| Universitas | Universitas Perjuangan Tasikmalaya |
| Tahun | 2026 |

## 1. Deskripsi Proyek
Frontend statis untuk layanan perpustakaan digital. Desain dibuat mobile-first dan berjalan baik di desktop. Proyek ini sudah dikonfigurasi untuk terhubung ke API backend.

## 2. Teknologi yang Digunakan
- HTML5
- CSS3 (Vanilla)
- JavaScript (ES6 Modules)
- Vite (Build Tool & Development Server)

## 3. Struktur Folder
```text
frontend/
├── index.html       # Entry point HTML
├── app.js           # Core JavaScript logic & API integration
├── style.css        # Styling and UI
├── package.json     # Vite dependencies & scripts
├── .env.example     # Contoh environment variables
├── .gitignore       # Git ignore rules
└── README.md        # Dokumentasi
```

## 4. Cara Instalasi
1. Clone repository:
   ```bash
   git clone https://github.com/rhnvlys/perpustakaan-digital-frontend.git
   ```
2. Masuk ke direktori:
   ```bash
   cd perpustakaan-digital-frontend
   ```
3. Install dependencies (Vite):
   ```bash
   npm install
   ```

## 5. Cara Menjalankan
Untuk menjalankan development server:
```bash
npm run dev
```
Untuk mem-build proyek untuk production:
```bash
npm run build
```

## 6. Konfigurasi Environment
Buat file `.env` di root folder proyek ini (sejajar dengan `package.json`) dengan referensi dari `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```
Ubah nilai `VITE_API_BASE_URL` sesuai dengan alamat endpoint backend Anda.

## 7. Screenshot Halaman Utama
*(Sertakan screenshot dashboard atau halaman utama aplikasi di sini bila tersedia).*

## Akun Demo
- Mahasiswa: `siswa@perpustakaan.com` / `siswa123`
- Admin: `admin@perpustakaan.com` / `admin123`
