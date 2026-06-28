CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    nim VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    isbn VARCHAR(50),
    publisher VARCHAR(100),
    year VARCHAR(4),
    total INT DEFAULT 1,
    available INT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loans (
    id VARCHAR(50) PRIMARY KEY,
    book_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    status ENUM('waiting', 'approved', 'rejected', 'active', 'late', 'returned') DEFAULT 'waiting',
    borrowed_at DATE,
    due_at DATE,
    fine INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seeder Users
INSERT IGNORE INTO users (id, name, email, password, role, nim) VALUES 
('user-admin', 'Admin Perpus', 'admin@perpustakaan.com', '$2a$10$NWSjguGKrzY1zAWyolzGKeaFzIZagZHD0q2saLyvafb7hSCHWRj8O', 'admin', '-');

-- Seeder Books
INSERT IGNORE INTO books (id, title, author, category, isbn, publisher, year, total, available, description) VALUES
('book-1', 'Pemrograman JavaScript Modern', 'Rian Azam', 'Teknologi', '978-602-1234-56-1', 'Informatika', '2023', 5, 5, 'Buku panduan lengkap belajar JavaScript ES6 ke atas.'),
('book-2', 'Pengenalan Database MySQL', 'Budi Raharjo', 'Teknologi', '978-602-1234-56-2', 'Erlangga', '2022', 3, 3, 'Panduan praktis mengelola database relasional menggunakan MySQL.'),
('book-3', 'Fisika Dasar untuk Universitas', 'Halliday & Resnick', 'Sains', '978-602-1234-56-3', 'Salemba Teknika', '2018', 4, 4, 'Buku teks standar fisika dasar tingkat perguruan tinggi.'),
('book-4', 'Laskar Pelangi', 'Andrea Hirata', 'Fiksi', '978-602-1234-56-4', 'Bentang Pustaka', '2005', 6, 6, 'Novel terlaris karya Andrea Hirata tentang perjuangan anak Belitong.'),
('book-5', 'Seni Berbicara di Depan Umum', 'Dale Carnegie', 'Pengembangan Diri', '978-602-1234-56-5', 'Gramedia', '2020', 2, 2, 'Kiat-kiat sukses berkomunikasi secara efektif di depan publik.');

