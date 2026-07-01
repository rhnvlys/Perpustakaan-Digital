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
    returned_at DATE,
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

-- Seeder
INSERT IGNORE INTO users (id, name, email, password, role, nim) VALUES 
('user-admin', 'Admin Perpus', 'admin@perpustakaan.com', '$2a$10$mXSNvY8UqGgSEg.NvKzWselcNXXp.nKg/j8jYbkeBfU.6FeCMsHmK', 'admin', '-');

INSERT IGNORE INTO books (id, title, author, category, isbn, publisher, year, total, available, description) VALUES
('book-1', 'Laskar Pelangi', 'Andrea Hirata', 'Sastra', '9787999086', 'Bentang Pustaka', '2005', 5, 5, 'Novel tentang perjuangan sepuluh anak Belitong.'),
('book-2', 'Bumi', 'Tere Liye', 'Fiksi', '9786020332', 'Gramedia Pustaka Utama', '2014', 3, 3, 'Petualangan remaja berkekuatan unik di dunia paralel.'),
('book-3', 'Clean Code', 'Robert C. Martin', 'Teknologi', '9780132350', 'Prentice Hall', '2008', 2, 2, 'Panduan menulis kode yang rapi dan mudah dipelihara.');
