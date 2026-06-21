# Sistem Informasi Perpustakaan Digital

Repository ini adalah monorepo untuk tugas Layanan Web Kelompok 1. Frontend dan backend tetap dipisah dalam folder masing-masing, tetapi keduanya berada dalam satu link GitHub agar mudah dikumpulkan.

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

## Struktur Repository

```text
Perpustakaan-Digital/
|-- frontend/
|   |-- index.html
|   |-- style.css
|   |-- app.js
|   |-- config.js
|   `-- README.md
|-- backend/
|   |-- index.js
|   |-- index.test.js
|   |-- package.json
|   `-- README.md
`-- README.md
```

## Frontend dan Backend

- `frontend/` berisi tampilan website sesuai prototype Figma.
- `backend/` berisi REST API Node.js untuk auth, buku, pengajuan, pinjaman, dashboard, dan notifikasi.
- Frontend otomatis mencoba terhubung ke backend di `http://127.0.0.1:3000`.
- Jika backend belum berjalan, frontend tetap bisa demo memakai data lokal.

## Cara Menjalankan Backend

```bash
cd backend
npm start
```

Backend berjalan di:

```text
http://127.0.0.1:3000
```

## Cara Menjalankan Frontend

Buka file berikut di browser:

```text
frontend/index.html
```

Untuk koneksi default, frontend memakai konfigurasi di:

```text
frontend/config.js
```

```js
window.PERPUS_API_BASE_URL = "http://127.0.0.1:3000";
```

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Mahasiswa | siswa@perpustakaan.com | siswa123 |
| Admin | admin@perpustakaan.com | admin123 |

## Fitur Utama

### Mahasiswa

- Login dan registrasi.
- Dashboard ringkasan pinjaman.
- Katalog buku dengan pencarian dan filter kategori.
- Detail buku.
- Pengajuan peminjaman.
- Cek status pengajuan.
- Cek pinjaman dan riwayat.
- Konfirmasi pengembalian buku.
- Notifikasi dan profil.

### Admin

- Dashboard admin.
- Manajemen pengajuan peminjaman.
- Setujui atau tolak pengajuan.
- Kelola data buku.
- Tambah, edit, dan hapus buku.
- Lihat data peminjaman.
- Profil admin.

## Endpoint Backend Ringkas

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registrasi |
| GET | `/api/books` | Daftar buku |
| POST | `/api/requests` | Ajukan peminjaman |
| PATCH | `/api/requests/:id/approve` | Setujui pengajuan |
| PATCH | `/api/requests/:id/reject` | Tolak pengajuan |
| GET | `/api/loans` | Data pinjaman |
| PATCH | `/api/loans/:id/return` | Pengembalian buku |
| GET | `/api/dashboard/student` | Dashboard mahasiswa |
| GET | `/api/dashboard/admin` | Dashboard admin |

## Test Backend

```bash
cd backend
npm test
```

## Referensi Desain

Prototype Figma:

https://www.figma.com/design/gyH0YTUmAmgneDmB72n9iN/PerpusDigital-LayananWeb-Kelompok1

## Catatan

Data backend saat ini masih disimpan di memory server. Jika server restart, data kembali ke data awal. Struktur ini sudah siap dikembangkan ke database pada tahap berikutnya.
