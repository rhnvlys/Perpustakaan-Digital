# Perpustakaan Digital - Backend API

Backend RESTful API untuk Sistem Informasi Perpustakaan Digital.

## 1. Deskripsi API
Backend API ini menyediakan layanan untuk authentication, manajemen buku, pengajuan peminjaman, serta fungsi administratif. API ini didesain menggunakan arsitektur MVC (Model-View-Controller) dengan Express.js.

## 2. Teknologi
- **Node.js** & **Express.js**
- **MySQL2** (Raw queries via Connection Pool)
- **JWT** (Authentication)
- **Bcrypt.js** (Password Hashing)
- **Joi** (Input Validation)
- **Helmet**, **Cors**, **Express Rate Limit** (Security)

## 3. Struktur Folder
\`\`\`
backend/
├── database/
│   └── schema.sql       # Database schema & seeder
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # API logic handlers
│   ├── middlewares/     # Auth, error handler, rate limit
│   ├── models/          # Data layer abstractions (optional mapping)
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions (e.g., standard responses)
│   ├── validators/      # Joi schemas
│   └── app.js           # Express App Entry Point
├── .env.example         # Environment variables template
├── package.json         
└── README.md            
\`\`\`

## 4. Instalasi
1. Clone repository:
   \`\`\`bash
   git clone https://github.com/[USERNAME_GITHUB_BACKEND]/perpustakaan-digital-backend.git
   cd perpustakaan-digital-backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

## 5. Konfigurasi .env
Buat file \`.env\` di root direktori berdasarkan \`.env.example\`:
\`\`\`env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=perpus_db
JWT_SECRET=supersecretkey
\`\`\`

## 6. Database Setup
1. Buat database baru di MySQL bernama \`perpus_db\` (atau sesuai \`.env\`).
2. Import file \`database/schema.sql\` ke database Anda. File ini berisi struktur tabel (users, books, loans, notifications) beserta seeder akun Admin default.
3. Jalankan server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 7. Daftar Endpoint

**Auth**
- \`POST /api/auth/register\` : Registrasi User (Student)
- \`POST /api/auth/login\` : Login User/Admin

**Books**
- \`GET /api/books\` : List & search books (Pagination, search, category, sort)
- \`GET /api/categories\` : Daftar kategori unik
- \`POST /api/books\` : Tambah buku baru (Admin only)

**Loans (Peminjaman)**
- \`POST /api/loans\` : Ajukan peminjaman buku
- \`PATCH /api/loans/:id/approve\` : Setujui peminjaman (Admin only)
- \`PATCH /api/loans/:id/return\` : Konfirmasi pengembalian buku
- \`PATCH /api/loans/:id/extend\` : Perpanjang batas waktu peminjaman (7 hari)

## 8. Contoh Request & Response

### Login Request
\`POST /api/auth/login\`
\`\`\`json
{
  "email": "admin@perpustakaan.com",
  "password": "admin"
}
\`\`\`
### Login Response
\`\`\`json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "user-admin",
      "name": "Admin Perpus",
      "email": "admin@perpustakaan.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
\`\`\`

*(Catatan: Akun admin default adalah \`admin@perpustakaan.com\` / password: \`admin\`)*
