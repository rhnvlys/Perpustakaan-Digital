# Perpustakaan Digital - Frontend

Frontend Sistem Informasi Perpustakaan Digital untuk tugas mata kuliah Layanan Web. Aplikasi ini dibuat mengikuti prototype Figma PerpusDigital dan berfokus pada tampilan serta interaksi awal untuk pengguna Mahasiswa dan Admin.

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

## Deskripsi

Repository ini berisi frontend statis untuk layanan perpustakaan digital. Pada tahap frontend ini, data masih menggunakan data lokal di sisi browser agar alur tampilan dapat dicoba tanpa backend.

Desain dibuat mobile-first dengan ukuran visual mengikuti prototype Figma, tetapi tetap dapat dibuka di desktop melalui frame aplikasi.

## Fitur Mahasiswa

- Login dan registrasi akun.
- Dashboard ringkasan pinjaman.
- Katalog buku dengan pencarian dan filter kategori.
- Detail buku dan pengajuan peminjaman.
- Halaman status pengajuan peminjaman.
- Halaman pinjaman aktif dan riwayat pengembalian.
- Konfirmasi pengembalian buku.
- Profil pengguna.
- Notifikasi.

## Fitur Admin

- Login sebagai admin.
- Dashboard ringkasan manajemen perpustakaan.
- Manajemen pengajuan peminjaman.
- Setujui atau tolak pengajuan mahasiswa.
- Kelola data buku.
- Tambah, edit, dan hapus buku.
- Lihat data peminjaman.
- Profil admin.

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Mahasiswa | siswa@perpustakaan.com | siswa123 |
| Admin | admin@perpustakaan.com | admin123 |

## Teknologi

- HTML
- CSS
- JavaScript
- Git
- GitHub

## Struktur Project

```text
Perpustakaan-Digital-FE/
|-- index.html
|-- style.css
|-- app.js
|-- PRODUCT.md
|-- README.md
`-- .gitignore
```

## Cara Menjalankan

1. Clone repository.

```bash
git clone https://github.com/rhnvlys/Perpustakaan-Digital-FE.git
```

2. Masuk ke folder project.

```bash
cd Perpustakaan-Digital-FE
```

3. Buka file `index.html` di browser.

Project ini belum membutuhkan instalasi dependency karena masih berupa frontend statis.

## Referensi Desain

Prototype Figma:

https://www.figma.com/design/gyH0YTUmAmgneDmB72n9iN/PerpusDigital-LayananWeb-Kelompok1

## Catatan Pengembangan

- Frontend saat ini belum terhubung ke backend.
- Data buku, pinjaman, dan pengajuan masih berupa data lokal di `app.js`.
- Integrasi API dapat ditambahkan pada tahap berikutnya tanpa mengubah struktur tampilan utama.
