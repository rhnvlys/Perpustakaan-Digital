# Perpustakaan Digital - Backend API

Backend RESTful API untuk Sistem Informasi Perpustakaan Digital.

## 1. Deskripsi API
Backend API ini menyediakan layanan untuk authentication, manajemen buku, pengajuan peminjaman, tracking notifikasi, serta fungsi administratif. API ini didesain menggunakan arsitektur MVC (Model-View-Controller) dengan Express.js dan database MySQL.

## 2. Teknologi & Keamanan
- **Node.js** & **Express.js**
- **MySQL2** (Raw queries via Connection Pool & database transactions)
- **JWT** (Authentication & Role Authorization)
- **Bcrypt.js** (Password Hashing)
- **Joi** (Input payload schema validation)
- **Helmet**, **Cors**, **Express Rate Limit** (Security headers & DDoS protection)

## 3. Struktur Folder
```
backend/
├── database/
│   └── schema.sql       # Database schema, foreign keys & default seeder
├── src/
│   ├── config/          # Database connection pool config
│   ├── controllers/     # Controller logic handlers
│   ├── middlewares/     # Auth checks, global error handling & rate limiter
│   ├── routes/          # Express route bindings
│   ├── utils/           # Helper functions (standard responses helper)
│   ├── validators/      # Joi schemas for books and other payloads
│   └── app.js           # Express App Entry Point
├── tests/
│   ├── authSmoke.js       # Authentication & role authorization smoke tests
│   └── booksLoansSmoke.js # Book CRUD & Loan lifecycle smoke tests
├── .env.example         # Environment variables template
├── package.json         
└── README.md            
```

## 4. Instalasi
1. Clone repository atau buka folder proyek:
   ```bash
   cd D:/laragon/www/Perpustakaan-Digital/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## 5. Konfigurasi .env
Buat file `.env` di direktori `backend/` dengan nilai berikut:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=perpus_db
JWT_SECRET=perpus_digital_jwt_secret_2026_strong_key
FRONTEND_ORIGIN=http://127.0.0.1:5173
```

## 6. Database Setup & Seeder
1. Pastikan server MySQL Anda (misal via Laragon) telah berjalan pada port `3306`.
2. Buat database baru bernama `perpus_db`.
3. Jalankan command import berikut untuk memuat tabel dan seed data awal:
   ```bash
   mysql -u root perpus_db < database/schema.sql
   ```
   *(File ini secara otomatis menambahkan user admin default: `admin@perpustakaan.com` / password: `admin` dan beberapa katalog buku)*

4. Jalankan server backend:
   ```bash
   npm run dev
   ```

## 7. Role & Permissions Matrix

| Endpoint | Method | Deskripsi | Akses | JWT Token |
|----------|--------|-----------|-------|-----------|
| `/api/health` | GET | Health check API | Publik | Tidak |
| `/api/auth/register` | POST | Registrasi akun Student baru | Publik | Tidak |
| `/api/auth/login` | POST | Login Admin / Student | Publik | Tidak |
| `/api/books` | GET | List katalog buku dengan filter/search | Publik | Tidak |
| `/api/books/:id` | GET | Ambil detail satu buku | Publik | Tidak |
| `/api/categories` | GET | List kategori buku unik | Publik | Tidak |
| `/api/books` | POST | Tambah buku baru | Admin | Ya |
| `/api/books/:id` | PUT | Update data buku (dan stok) | Admin | Ya |
| `/api/books/:id` | DELETE | Hapus buku | Admin | Ya |
| `/api/loans` | GET | List peminjaman (Admin lihat semua, Student lihat miliknya saja) | Admin / Student | Ya |
| `/api/loans/:id` | GET | Detail peminjaman (Kepemilikan diverifikasi) | Admin / Student | Ya |
| `/api/loans` | POST | Ajukan peminjaman buku | Student | Ya |
| `/api/loans/:id/approve` | PATCH | Setujui peminjaman (mengurangi stok) | Admin | Ya |
| `/api/loans/:id/reject` | PATCH | Tolak peminjaman (dapat mengirim `{ "reason": "..." }`) | Admin | Ya |
| `/api/loans/:id/return` | PATCH | Kembalikan buku (menambah stok kembali) | Admin / Student | Ya |
| `/api/loans/:id/extend` | PATCH | Perpanjang peminjaman (+7 hari dari due_at) | Admin / Student | Ya |
| `/api/notifications` | GET | Ambil notifikasi milik akun aktif | Admin / Student | Ya |
| `/api/notifications/read-all` | PATCH | Tandai semua notifikasi milik akun aktif sudah dibaca | Admin / Student | Ya |
| `/api/notifications/:id/read` | PATCH | Tandai satu notifikasi tertentu sudah dibaca | Admin / Student | Ya |
| `/api/dashboard` | GET | Ambil metrik ringkasan dashboard sesuai role | Admin / Student | Ya |

## 8. Query Parameters untuk Endpoint `/api/books`
Endpoint `GET /api/books` mendukung parameter opsional berikut:
- `page`: Nomor halaman (Default: `1`)
- `limit`: Jumlah item per halaman (Default: `10`)
- `search`: Cari judul atau penulis buku
- `category`: Filter berdasarkan kategori tertentu
- `sortBy`: Urutkan berdasarkan kolom (`title`, `author`, `year`, `total`, `available`)
- `sortOrder`: Arah pengurutan (`asc` atau `desc`)

## 9. Query Parameters untuk Endpoint `/api/loans`
Endpoint `GET /api/loans` mendukung parameter opsional berikut:
- `page`: Nomor halaman (Default: `1`)
- `limit`: Jumlah item per halaman (Default: `10`)
- `status`: Filter berdasarkan status peminjaman (`waiting`, `approved`, `rejected`, `active`, `late`, `returned`)

## 10. Pengujian Otomatis (Smoke Tests)
Telah disediakan dua script smoke test berbasis Node.js yang berjalan secara independen tanpa dependensi pihak ketiga:

1. **Smoke Test Autentikasi & Otorisasi**:
   ```bash
   node tests/authSmoke.js
   ```
   *Menguji register student, login student/admin, pemblokiran token invalid, dan hak akses rute.*

2. **Smoke Test CRUD Buku & Siklus Peminjaman**:
   ```bash
   node tests/booksLoansSmoke.js
   ```
   *Menguji penambahan buku baru, validasi stok, peminjaman oleh student, persetujuan admin, perpanjangan masa pinjam, pengembalian buku, tracking perubahan stok secara realtime, dan penghapusan buku.*
