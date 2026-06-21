# Perpustakaan Digital - Backend

Backend API untuk Sistem Informasi Perpustakaan Digital. Project ini dibuat sebagai bagian backend dari tugas mata kuliah Layanan Web Kelompok 1.

API dibuat menggunakan Node.js bawaan tanpa dependency tambahan agar ringan, mudah dijalankan, dan cocok sebagai fondasi awal sebelum dihubungkan ke database.

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

## Fitur Backend

- Login dan registrasi akun demo.
- Token session sederhana untuk akses endpoint protected.
- Katalog buku dengan pencarian, filter kategori, dan filter ketersediaan.
- Detail buku.
- Tambah, edit, dan hapus buku untuk admin.
- Pengajuan peminjaman buku oleh mahasiswa.
- Persetujuan atau penolakan pengajuan oleh admin.
- Data pinjaman mahasiswa dan admin.
- Konfirmasi pengembalian buku.
- Perpanjangan masa pinjaman.
- Notifikasi.
- Dashboard ringkasan mahasiswa dan admin.

## Teknologi

- Node.js
- JavaScript
- HTTP module bawaan Node.js
- Node Test Runner

## Cara Menjalankan

1. Clone repository.

```bash
git clone https://github.com/rhnvlys/Perpustakaan-Digital-BE.git
```

2. Masuk ke folder project.

```bash
cd Perpustakaan-Digital-BE
```

3. Jalankan server.

```bash
npm start
```

Server berjalan di:

```text
http://127.0.0.1:3000
```

Port dapat diganti dengan environment variable:

```bash
PORT=4000 npm start
```

Pada Windows PowerShell:

```powershell
$env:PORT=4000; npm start
```

## Menjalankan Test

```bash
npm test
```

Test akan menjalankan server sementara dan memeriksa health endpoint, katalog buku, login, pengajuan peminjaman, approval admin, dan dashboard admin.

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Mahasiswa | siswa@perpustakaan.com | siswa123 |
| Admin | admin@perpustakaan.com | admin123 |

## Format Response

Response sukses:

```json
{
  "success": true,
  "message": "success",
  "data": {}
}
```

Response error:

```json
{
  "success": false,
  "message": "Pesan error",
  "errors": null
}
```

## Endpoint Umum

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | Informasi service backend |
| GET | `/api/health` | Health check API |

## Endpoint Auth

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/auth/login` | Login mahasiswa atau admin |
| POST | `/api/auth/register` | Registrasi akun mahasiswa |

Contoh login:

```bash
curl -X POST http://127.0.0.1:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@perpustakaan.com\",\"password\":\"admin123\"}"
```

Gunakan token dari response login:

```text
Authorization: Bearer TOKEN_DARI_RESPONSE_LOGIN
```

## Endpoint Buku

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/books` | Publik | Daftar buku |
| GET | `/api/books?search=laskar` | Publik | Cari buku |
| GET | `/api/books?category=Fiksi` | Publik | Filter kategori |
| GET | `/api/books?available=true` | Publik | Filter buku tersedia |
| GET | `/api/books/:id` | Publik | Detail buku |
| POST | `/api/books` | Admin | Tambah buku |
| PUT | `/api/books/:id` | Admin | Edit buku |
| DELETE | `/api/books/:id` | Admin | Hapus buku |
| GET | `/api/categories` | Publik | Daftar kategori |

## Endpoint Pengajuan

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/requests` | Login | Daftar pengajuan |
| POST | `/api/requests` | Mahasiswa | Ajukan peminjaman buku |
| PATCH | `/api/requests/:id/approve` | Admin | Setujui pengajuan |
| PATCH | `/api/requests/:id/reject` | Admin | Tolak pengajuan |

Contoh pengajuan:

```bash
curl -X POST http://127.0.0.1:3000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_MAHASISWA" \
  -d "{\"bookId\":\"atomic-habits\"}"
```

## Endpoint Pinjaman

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/loans` | Login | Daftar pinjaman |
| PATCH | `/api/loans/:id/return` | Login | Konfirmasi pengembalian |
| PATCH | `/api/loans/:id/extend` | Login | Perpanjang pinjaman |

## Endpoint Dashboard dan Notifikasi

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/dashboard/student` | Mahasiswa | Ringkasan dashboard mahasiswa |
| GET | `/api/dashboard/admin` | Admin | Ringkasan dashboard admin |
| GET | `/api/notifications` | Login | Daftar notifikasi |

## Struktur Project

```text
Perpustakaan-Digital-BE/
|-- index.js
|-- index.test.js
|-- package.json
|-- README.md
`-- .gitignore
```

## Catatan Pengembangan

- Data saat ini masih disimpan di memory server, sehingga akan kembali ke data awal saat server restart.
- Token session juga masih disimpan di memory.
- Tahap berikutnya dapat menambahkan database, validasi lebih lengkap, password hashing, dan integrasi langsung dengan frontend.
