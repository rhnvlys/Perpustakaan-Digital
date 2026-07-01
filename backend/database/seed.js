const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

async function seed() {
  const pool = await mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS || '',
    multipleStatements: true,
  });

  try {
    console.log('Dropping and recreating database...');
    await pool.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
    await pool.query(`CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await pool.query(`USE \`${DB_NAME}\``);

    console.log('Running schema.sql...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);

    console.log('Hashing passwords...');
    const adminPass = await bcrypt.hash('admin123', 10);
    const siswaPass = await bcrypt.hash('siswa123', 10);

    const adminId = 'a0000000-0000-0000-0000-000000000001';
    const studentId1 = 'b0000000-0000-0000-0000-000000000001';
    const studentId2 = 'b0000000-0000-0000-0000-000000000002';

    const bookIds = [
      'c0000000-0000-0000-0000-000000000001',
      'c0000000-0000-0000-0000-000000000002',
      'c0000000-0000-0000-0000-000000000003',
      'c0000000-0000-0000-0000-000000000004',
      'c0000000-0000-0000-0000-000000000005',
      'c0000000-0000-0000-0000-000000000006',
      'c0000000-0000-0000-0000-000000000007',
      'c0000000-0000-0000-0000-000000000008',
      'c0000000-0000-0000-0000-000000000009',
      'c0000000-0000-0000-0000-000000000010',
    ];

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      console.log('Seeding users...');
      await conn.execute(
        `INSERT INTO users (id, name, email, password, role, nim) VALUES (?, ?, ?, ?, ?, ?)`,
        [adminId, 'Raihan Nouval Yashir', 'admin@perpustakaan.com', adminPass, 'admin', '19992024001']
      );
      await conn.execute(
        `INSERT INTO users (id, name, email, password, role, nim) VALUES (?, ?, ?, ?, ?, ?)`,
        [studentId1, 'Budi Santoso', 'siswa@perpustakaan.com', siswaPass, 'student', '2024001234']
      );
      await conn.execute(
        `INSERT INTO users (id, name, email, password, role, nim) VALUES (?, ?, ?, ?, ?, ?)`,
        [studentId2, 'Siti Apriani', 'siti@perpustakaan.com', siswaPass, 'student', '2024001235']
      );

      console.log('Seeding books...');
      const books = [
        [bookIds[0], 'Laskar Pelangi', 'Andrea Hirata', 'Fiksi', '9789793062792', 'Bentang Pustaka', '2005', 5, 2, 'Novel pertama karya Andrea Hirata yang diterbitkan tahun 2005. Novel ini bercerita tentang kehidupan 10 anak dari keluarga miskin yang bersekolah di sebuah sekolah Muhammadiyah di Belitung.', 'https://picsum.photos/seed/laskar/400/600'],
        [bookIds[1], 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Fiksi', '9789799731234', 'Hasta Mitra', '1980', 5, 3, 'Novel pertama dari Tetralogi Buru karya Pramoedya Ananta Toer. Mengisahkan kehidupan Minke, seorang pribumi yang mendapat pendidikan Eropa di masa kolonial Belanda.', 'https://picsum.photos/seed/bumi/400/600'],
        [bookIds[2], 'Negeri 5 Menara', 'Ahmad Fuadi', 'Fiksi', '9789792233476', 'Gramedia', '2009', 5, 4, 'Novel pertama trilogi Negeri 5 Menara. Bercerita tentang Alif Fikri yang menempuh pendidikan di sebuah pesantren di Jawa Timur.', 'https://picsum.photos/seed/menara/400/600'],
        [bookIds[3], 'Ronggeng Dukuh Paruk', 'Ahmad Tohari', 'Fiksi', '9789790150027', 'Gramedia', '1982', 5, 5, 'Novel karya Ahmad Tohari yang mengisahkan kehidupan Srintil, seorang ronggeng dari Dukuh Paruk, sebuah dusun kecil yang terpencil.', 'https://picsum.photos/seed/ronggeng/400/600'],
        [bookIds[4], 'Cantik Itu Luka', 'Eka Kurniawan', 'Fiksi', '9789795263418', 'Gramedia', '2002', 5, 3, 'Novel karya Eka Kurniawan yang bercerita tentang Dewi Ayu, seorang pelacur cantik di sebuah kota pesisir fiksi bernama Halimunda.', 'https://picsum.photos/seed/cantik/400/600'],
        [bookIds[5], 'Sapiens', 'Yuval Noah Harari', 'Non-Fiksi', '9786020331195', 'Gramedia', '2011', 5, 2, 'Buku yang membahas sejarah umat manusia dari zaman batu hingga abad ke-21 secara komprehensif dan menarik.', 'https://picsum.photos/seed/sapiens/400/600'],
        [bookIds[6], 'Atomic Habits', 'James Clear', 'Non-Fiksi', '9786020633176', 'Gramedia', '2018', 5, 1, 'Buku panduan praktis tentang bagaimana membangun kebiasaan baik dan menghilangkan kebiasaan buruk melalui perubahan kecil.', 'https://picsum.photos/seed/atomic/400/600'],
        [bookIds[7], 'Filosofi Teras', 'Henry Manampiring', 'Non-Fiksi', '9786024526986', 'Kompas', '2018', 5, 4, 'Buku yang membahas filosofi Stoisisme dan penerapannya dalam kehidupan sehari-hari masyarakat Indonesia modern.', 'https://picsum.photos/seed/filosofi/400/600'],
        [bookIds[8], 'Sejarah Indonesia Modern', 'M.C. Ricklefs', 'Sejarah', '9789795263678', 'Gadjah Mada University Press', '2005', 5, 5, 'Buku referensi komprehensif tentang sejarah Indonesia dari abad ke-13 hingga era reformasi.', 'https://picsum.photos/seed/sejarah/400/600'],
        [bookIds[9], 'Habibie dan Ainun', 'B.J. Habibie', 'Biografi', '9789797806125', 'THC Mandiri', '2010', 5, 3, 'Kisah cinta sejati antara presiden ketiga Republik Indonesia B.J. Habibie dan istrinya Hasri Ainun Besari.', 'https://picsum.photos/seed/habibie/400/600'],
      ];

      for (const book of books) {
        await conn.execute(
          `INSERT INTO books (id, title, author, category, isbn, publisher, year, total, available, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          book
        );
      }

      console.log('Seeding loans...');
      const now = new Date();
      const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString().slice(0, 19).replace('T', ' ');
      const daysLater = (d) => new Date(now.getTime() + d * 86400000).toISOString().slice(0, 19).replace('T', ' ');

      await conn.execute(
        `INSERT INTO loans (id, book_id, user_id, status, requested_at, borrowed_at, due_at, returned_at, fine) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['d0000000-0000-0000-0000-000000000001', bookIds[0], studentId1, 'returned', daysAgo(30), daysAgo(28), daysAgo(14), daysAgo(15), 0]
      );
      await conn.execute(
        `INSERT INTO loans (id, book_id, user_id, status, requested_at, borrowed_at, due_at, returned_at, fine) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['d0000000-0000-0000-0000-000000000002', bookIds[1], studentId1, 'active', daysAgo(10), daysAgo(8), daysLater(6), null, 0]
      );
      await conn.execute(
        `INSERT INTO loans (id, book_id, user_id, status, requested_at, borrowed_at, due_at, returned_at, fine) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['d0000000-0000-0000-0000-000000000003', bookIds[5], studentId2, 'late', daysAgo(25), daysAgo(23), daysAgo(9), null, 9000]
      );
      await conn.execute(
        `INSERT INTO loans (id, book_id, user_id, status, requested_at, borrowed_at, due_at, returned_at, fine) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['d0000000-0000-0000-0000-000000000004', bookIds[6], studentId2, 'approved', daysAgo(2), null, null, null, 0]
      );
      await conn.execute(
        `INSERT INTO loans (id, book_id, user_id, status, requested_at, borrowed_at, due_at, returned_at, fine) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['d0000000-0000-0000-0000-000000000005', bookIds[2], studentId1, 'waiting', daysAgo(1), null, null, null, 0]
      );

      console.log('Seeding notifications...');
      await conn.execute(
        `INSERT INTO notifications (id, user_id, title, is_read, created_at) VALUES (?, ?, ?, ?, ?)`,
        ['e0000000-0000-0000-0000-000000000001', studentId1, 'Peminjaman buku "Bumi Manusia" telah disetujui', false, daysAgo(8)]
      );
      await conn.execute(
        `INSERT INTO notifications (id, user_id, title, is_read, created_at) VALUES (?, ?, ?, ?, ?)`,
        ['e0000000-0000-0000-0000-000000000002', studentId2, 'Buku "Sapiens" sudah melewati batas waktu pengembalian', true, daysAgo(9)]
      );

      await conn.commit();
      console.log('Seed completed successfully!');
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
