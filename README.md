# Sistem Informasi Perpustakaan Digital

Repository ini adalah monorepo untuk tugas Layanan Web Kelompok 1. Frontend dan backend dipisahkan dalam folder masing-masing, terhubung melalui arsitektur REST API dengan database relasional MySQL.

---

## 👥 Identitas Kelompok

| Keterangan | Isi |
|---|---|
| **Nama Project** | Sistem Informasi Perpustakaan Digital |
| **Mata Kuliah** | Layanan Web |
| **Kelompok** | Kelompok 1 |
| **Dosen Pengampu** | Teguh Ikhlas Ramadhan, S.Kom., M.Kom. |
| **UI/UX** | Muhammad Aldian Nurrahman |
| **Frontend** | Muhammad Zulfa Septiawan |
| **Backend** | Raihan Nouval Yashir |
| **Universitas** | Universitas Perjuangan Tasikmalaya |
| **Tahun** | 2026 |

---

## 📂 Struktur Folder Utama & Lokasi File Fitur

### 💻 1. Frontend (`/frontend`)
Tampilan web single-page application (SPA) yang dinamis menggunakan HTML, Vanilla CSS, dan JavaScript modern (Vite).
* **Entry Point:** `frontend/index.html` & `frontend/app.js`
* **Styling & Desain:** `frontend/style.css` (menggunakan CSS Variables untuk tema gelap/terang, layout bento grid, ornamen modern)
* **Konfigurasi Environment:** `frontend/.env`
* **File Pengujian DOM:** `frontend/app.test.js` (menggunakan Vitest & JSDOM)

### ⚙️ 2. Backend (`/backend`)
Server REST API berbasis Node.js Express dengan basis data MySQL.
* **Entry Point Server:** `backend/src/app.js`
* **Konfigurasi Database & Koneksi:** `backend/src/config/database.js`
* **Skema DDL & Seed SQL Database:** `backend/database/schema.sql`
* **Folder Router & Endpoint:** `backend/src/routes/`
* **Folder Controller & Logika Bisnis:** `backend/src/controllers/`
  * `authController.js` — Registrasi & Login (Bcrypt + JWT)
  * `bookController.js` — Manajemen CRUD Katalog Buku
  * `loanController.js` — Alur Pengajuan, Persetujuan, Perpanjangan, & Pengembalian Pinjaman
  * `notificationController.js` — Notifikasi Realtime Database
* **Folder Validator Input (Joi Schema):** `backend/src/validators/`
* **Folder Pengujian REST API & CRUD Mandiri:** `backend/tests/`
  * `authSmoke.js` — Smoke test alur otentikasi & proteksi route.
  * `booksLoansSmoke.js` — Smoke test alur peminjaman buku, persetujuan admin, & kalkulasi stok.
  * `crudSmoke.js` — Test mandiri operasi CRUD (Create, Read, Update, Delete) langsung ke API database tanpa frontend.

---

## 🔐 Akun Uji Coba (Demo Accounts)

| Peran (Role) | Email | Sandi (Password) | Keterangan |
|---|---|---|---|
| **Mahasiswa** | `siswa@perpustakaan.com` | `siswa123` | Akses katalog, ajukan pinjaman, lihat riwayat |
| **Admin** | `admin@perpustakaan.com` | `admin123` | Kelola buku, setujui/tolak peminjaman, kelola dashboard |

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

### 1. Prasyarat (Prerequisites)
Pastikan Laragon atau XAMPP berjalan dengan layanan **MySQL**. Buat database baru bernama `perpus_db` dan impor file database seeder:
```bash
# Impor database (bisa melalui phpMyAdmin atau terminal)
mysql -u root -p perpus_db < backend/database/schema.sql
```

### 2. Jalankan Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Buat file `.env` dan pastikan konfigurasi database sudah benar:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=perpus_db
   JWT_SECRET=supersecretjwtkeyperpustakaandigital2026
   FRONTEND_URL=http://localhost:5173
   ```
3. Instal dependencies & jalankan server:
   ```bash
   npm install
   npm start
   ```
   *Backend akan berjalan di `http://localhost:3000`.*

### 3. Jalankan Frontend
1. Masuk ke folder frontend:
   ```bash
   cd ../frontend
   ```
2. Buat file `.env` untuk mengarahkan request ke backend:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_DEMO_MODE=false
   ```
3. Jalankan server lokal:
   ```bash
   npm install
   npm run dev
   ```
   *Buka browser pada alamat `http://localhost:5173`.*

---

## 🧪 Panduan Menjalankan Pengujian (Testing)

### 🛡️ 1. Pengujian DOM Frontend (Unit/UI Testing)
Menggunakan **Vitest** dan **jsdom** untuk mensimulasikan DOM browser dan memverifikasi interaksi state/UI.
* **Lokasi File:** `frontend/app.test.js`
* **Cara Menjalankan:**
  ```bash
  cd frontend
  npm run test
  ```

### ⚙️ 2. Pengujian Backend REST API & CRUD Mandiri
Backend menyediakan pengujian fungsional terintegrasi yang langsung mengakses database MySQL secara terisolasi tanpa memerlukan interface frontend.

* **Lokasi File:** di dalam folder `backend/tests/`
* **Cara Menjalankan:**
  ```bash
  cd backend
  
  # A. Menjalankan pengujian Autentikasi & Proteksi Endpoint JWT:
  node tests/authSmoke.js
  
  # B. Menjalankan pengujian Siklus Peminjaman Buku, Persetujuan, Perpanjangan, & Pengembalian:
  node tests/booksLoansSmoke.js
  
  # C. Menjalankan pengujian operasi CRUD Buku langsung ke database REST API:
  node tests/crudSmoke.js
  ```
