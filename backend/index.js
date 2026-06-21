const http = require("http");
const { randomUUID } = require("crypto");

const hostname = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);

const seed = {
    users: [
        {
            id: "user-student",
            name: "Budi Santoso",
            email: "siswa@perpustakaan.com",
            password: "siswa123",
            role: "student",
            roleLabel: "Mahasiswa",
            nim: "2024001234",
            memberSince: "15 Januari 2024"
        },
        {
            id: "user-admin",
            name: "Raihan Nouval Yashir",
            email: "admin@perpustakaan.com",
            password: "admin123",
            role: "admin",
            roleLabel: "Administrator",
            memberSince: "10 Januari 2024"
        }
    ],
    books: [
        {
            id: "laskar-pelangi",
            title: "Laskar Pelangi",
            author: "Andrea Hirata",
            category: "Fiksi",
            isbn: "978-602-0301-74-1",
            publisher: "Bentang Pustaka",
            year: "2005",
            total: 5,
            available: 2,
            description: "Novel tentang perjuangan anak-anak Belitung dalam mengejar pendidikan."
        },
        {
            id: "bumi-manusia",
            title: "Bumi Manusia",
            author: "Pramoedya Ananta Toer",
            category: "Fiksi Sejarah",
            isbn: "978-602-0301-88-8",
            publisher: "Lentera Dipantara",
            year: "1980",
            total: 3,
            available: 1,
            description: "Kisah sejarah dan kemanusiaan pada masa kolonial Hindia Belanda."
        },
        {
            id: "negeri-5-menara",
            title: "Negeri 5 Menara",
            author: "Ahmad Fuadi",
            category: "Fiksi",
            isbn: "978-979-22-4861-6",
            publisher: "Gramedia",
            year: "2009",
            total: 4,
            available: 3,
            description: "Cerita persahabatan dan semangat belajar para santri."
        },
        {
            id: "ronggeng-dukuh-paruk",
            title: "Ronggeng Dukuh Paruk",
            author: "Ahmad Tohari",
            category: "Fiksi",
            isbn: "978-979-22-1963-0",
            publisher: "Gramedia",
            year: "1982",
            total: 2,
            available: 0,
            description: "Novel sosial tentang desa, budaya, dan perubahan hidup."
        },
        {
            id: "cantik-itu-luka",
            title: "Cantik Itu Luka",
            author: "Eka Kurniawan",
            category: "Fiksi Sejarah",
            isbn: "978-979-91-0526-4",
            publisher: "Gramedia",
            year: "2002",
            total: 4,
            available: 2,
            description: "Kisah keluarga dan sejarah Indonesia dalam gaya realisme magis."
        },
        {
            id: "sapiens",
            title: "Sapiens",
            author: "Yuval Noah Harari",
            category: "Sejarah",
            isbn: "978-602-6577-75-1",
            publisher: "KPG",
            year: "2017",
            total: 5,
            available: 4,
            description: "Ringkasan sejarah manusia dari masa purba sampai era modern."
        },
        {
            id: "atomic-habits",
            title: "Atomic Habits",
            author: "James Clear",
            category: "Pengembangan Diri",
            isbn: "978-602-06-3317-6",
            publisher: "Gramedia",
            year: "2019",
            total: 6,
            available: 4,
            description: "Panduan membangun kebiasaan kecil yang berdampak besar."
        },
        {
            id: "filosofi-teras",
            title: "Filosofi Teras",
            author: "Henry Manampiring",
            category: "Pengembangan Diri",
            isbn: "978-623-346-303-4",
            publisher: "Kompas",
            year: "2018",
            total: 4,
            available: 3,
            description: "Pengenalan stoisisme untuk kehidupan sehari-hari."
        },
        {
            id: "sejarah-indonesia-modern",
            title: "Sejarah Indonesia Modern",
            author: "M. C. Ricklefs",
            category: "Sejarah",
            isbn: "978-979-024-115-2",
            publisher: "Serambi",
            year: "2008",
            total: 3,
            available: 2,
            description: "Rujukan sejarah Indonesia dari masa kolonial sampai modern."
        },
        {
            id: "biografi-bj-habibie",
            title: "Habibie dan Ainun",
            author: "B. J. Habibie",
            category: "Biografi",
            isbn: "978-979-1255-13-6",
            publisher: "THC Mandiri",
            year: "2010",
            total: 3,
            available: 2,
            description: "Memoar tentang kehidupan, teknologi, dan keluarga."
        }
    ],
    requests: [
        {
            id: "request-laskar",
            bookId: "laskar-pelangi",
            userId: "user-student",
            borrower: "Budi Santoso",
            requestedAt: "30 Mei 2026",
            status: "waiting"
        }
    ],
    loans: [
        {
            id: "loan-laskar",
            bookId: "laskar-pelangi",
            userId: "user-student",
            borrower: "Budi Santoso",
            borrowedAt: "15/4/2026",
            dueAt: "29/4/2026",
            status: "active",
            fine: 0
        },
        {
            id: "loan-bumi",
            bookId: "bumi-manusia",
            userId: "user-student",
            borrower: "Budi Santoso",
            borrowedAt: "15/2/2026",
            dueAt: "25/3/2026",
            status: "late",
            fine: 62000
        },
        {
            id: "loan-ronggeng",
            bookId: "ronggeng-dukuh-paruk",
            userId: "user-student",
            borrower: "Budi Santoso",
            borrowedAt: "10/1/2026",
            dueAt: "24/1/2026",
            status: "returned",
            fine: 0
        },
        {
            id: "loan-negeri",
            bookId: "negeri-5-menara",
            userId: "user-siti",
            borrower: "Siti Apriani",
            borrowedAt: "9/6/2026",
            dueAt: "23/6/2026",
            status: "active",
            fine: 0
        }
    ],
    notifications: [
        {
            id: "notif-1",
            userId: "user-student",
            title: "Buku Laskar Pelangi akan jatuh tempo dalam 3 hari",
            createdAt: "2 jam yang lalu",
            read: false
        },
        {
            id: "notif-2",
            userId: "user-student",
            title: "Peminjaman Bumi Manusia tercatat terlambat",
            createdAt: "5 jam yang lalu",
            read: false
        }
    ]
};

let state = clone(seed);
const sessions = new Map();

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function resetData() {
    state = clone(seed);
    sessions.clear();
}

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `item-${Date.now()}`;
}

function publicUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
}

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Content-Type": "application/json; charset=utf-8"
    });
    res.end(JSON.stringify(payload, null, 2));
}

function sendSuccess(res, data, message = "success", statusCode = 200) {
    sendJson(res, statusCode, { success: true, message, data });
}

function sendError(res, statusCode, message, errors = null) {
    sendJson(res, statusCode, { success: false, message, errors });
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", (chunk) => {
            raw += chunk;
            if (raw.length > 1_000_000) {
                reject(new Error("Payload terlalu besar."));
                req.destroy();
            }
        });
        req.on("end", () => {
            if (!raw) {
                resolve({});
                return;
            }
            try {
                resolve(JSON.parse(raw));
            } catch {
                reject(new Error("Format JSON tidak valid."));
            }
        });
        req.on("error", reject);
    });
}

function getSessionUser(req) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const userId = sessions.get(token);
    return state.users.find((user) => user.id === userId) || null;
}

function requireAuth(req, res) {
    const user = getSessionUser(req);
    if (!user) {
        sendError(res, 401, "Token tidak valid atau belum login.");
        return null;
    }
    return user;
}

function requireAdmin(req, res) {
    const user = requireAuth(req, res);
    if (!user) return null;
    if (user.role !== "admin") {
        sendError(res, 403, "Akses hanya untuk admin.");
        return null;
    }
    return user;
}

function bookWithMeta(book) {
    const activeLoans = state.loans.filter((loan) => loan.bookId === book.id && loan.status !== "returned").length;
    return {
        ...book,
        activeLoans
    };
}

function loanWithBook(loan) {
    return {
        ...loan,
        fineFormatted: formatRupiah(loan.fine),
        book: state.books.find((book) => book.id === loan.bookId) || null
    };
}

function requestWithBook(request) {
    return {
        ...request,
        book: state.books.find((book) => book.id === request.bookId) || null
    };
}

function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(value || 0));
}

function formatDateId(date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function formatShortDate(date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    }).format(date);
}

function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function dashboardForStudent(user) {
    const mine = state.loans.filter((loan) => loan.userId === user.id);
    const active = mine.filter((loan) => loan.status === "active" || loan.status === "late");
    const returned = mine.filter((loan) => loan.status === "returned");
    const late = mine.filter((loan) => loan.status === "late");
    return {
        metrics: {
            activeLoans: active.length,
            lateLoans: late.length,
            finishedBooks: returned.length,
            availableBooks: state.books.reduce((sum, book) => sum + book.available, 0)
        },
        activeLoans: active.map(loanWithBook),
        latestBooks: state.books.slice(0, 4).map(bookWithMeta)
    };
}

function dashboardForAdmin() {
    const active = state.loans.filter((loan) => loan.status === "active" || loan.status === "late");
    return {
        metrics: {
            totalBooks: state.books.reduce((sum, book) => sum + book.total, 0),
            uniqueTitles: state.books.length,
            waitingRequests: state.requests.filter((request) => request.status === "waiting").length,
            activeLoans: active.length,
            availableBooks: state.books.reduce((sum, book) => sum + book.available, 0),
            lateLoans: state.loans.filter((loan) => loan.status === "late").length
        },
        popularBooks: state.books.slice(0, 4).map(bookWithMeta)
    };
}

async function route(req, res) {
    if (req.method === "OPTIONS") {
        sendJson(res, 204, {});
        return;
    }

    const baseUrl = `http://${req.headers.host || `${hostname}:${port}`}`;
    const url = new URL(req.url, baseUrl);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const parts = pathname.split("/").filter(Boolean);

    try {
        if (req.method === "GET" && pathname === "/") {
            sendSuccess(res, {
                project: "Sistem Informasi Perpustakaan Digital",
                service: "Backend API",
                version: "1.0.0",
                endpoints: [
                    "GET /api/health",
                    "POST /api/auth/login",
                    "GET /api/books",
                    "POST /api/requests",
                    "PATCH /api/requests/:id/approve"
                ]
            }, "Backend Perpustakaan Digital siap digunakan.");
            return;
        }

        if (req.method === "GET" && pathname === "/api/health") {
            sendSuccess(res, {
                status: "ok",
                uptime: process.uptime(),
                timestamp: new Date().toISOString()
            });
            return;
        }

        if (req.method === "POST" && pathname === "/api/auth/login") {
            const body = await parseBody(req);
            const email = String(body.email || "").toLowerCase().trim();
            const password = String(body.password || "");
            const user = state.users.find((item) => item.email.toLowerCase() === email && item.password === password);
            if (!user) {
                sendError(res, 401, "Email atau password salah.");
                return;
            }
            const token = randomUUID();
            sessions.set(token, user.id);
            sendSuccess(res, { token, user: publicUser(user) }, "Login berhasil.");
            return;
        }

        if (req.method === "POST" && pathname === "/api/auth/register") {
            const body = await parseBody(req);
            const name = String(body.name || "").trim();
            const email = String(body.email || "").toLowerCase().trim();
            const password = String(body.password || "").trim();
            const nim = String(body.nim || "").trim();
            if (!name || !email || password.length < 6) {
                sendError(res, 422, "Nama, email, dan password minimal 6 karakter wajib diisi.");
                return;
            }
            if (state.users.some((user) => user.email.toLowerCase() === email)) {
                sendError(res, 409, "Email sudah terdaftar.");
                return;
            }
            const user = {
                id: `user-${slugify(name)}-${Date.now()}`,
                name,
                email,
                password,
                role: "student",
                roleLabel: "Mahasiswa",
                nim,
                memberSince: formatDateId(new Date())
            };
            state.users.push(user);
            const token = randomUUID();
            sessions.set(token, user.id);
            sendSuccess(res, { token, user: publicUser(user) }, "Registrasi berhasil.", 201);
            return;
        }

        if (req.method === "GET" && pathname === "/api/categories") {
            const categories = [...new Set(state.books.map((book) => book.category))];
            sendSuccess(res, categories);
            return;
        }

        if (parts[0] === "api" && parts[1] === "books") {
            await handleBooks(req, res, url, parts);
            return;
        }

        if (parts[0] === "api" && parts[1] === "requests") {
            await handleRequests(req, res, parts);
            return;
        }

        if (parts[0] === "api" && parts[1] === "loans") {
            await handleLoans(req, res, parts);
            return;
        }

        if (req.method === "GET" && pathname === "/api/notifications") {
            const user = requireAuth(req, res);
            if (!user) return;
            const notifications = user.role === "admin"
                ? state.notifications
                : state.notifications.filter((notification) => notification.userId === user.id);
            sendSuccess(res, notifications);
            return;
        }

        if (req.method === "GET" && pathname === "/api/dashboard/student") {
            const user = requireAuth(req, res);
            if (!user) return;
            sendSuccess(res, dashboardForStudent(user));
            return;
        }

        if (req.method === "GET" && pathname === "/api/dashboard/admin") {
            const user = requireAdmin(req, res);
            if (!user) return;
            sendSuccess(res, dashboardForAdmin());
            return;
        }

        sendError(res, 404, "Endpoint tidak ditemukan.");
    } catch (error) {
        sendError(res, 400, error.message || "Request tidak dapat diproses.");
    }
}

async function handleBooks(req, res, url, parts) {
    if (req.method === "GET" && parts.length === 2) {
        const search = String(url.searchParams.get("search") || "").toLowerCase().trim();
        const category = String(url.searchParams.get("category") || "").trim();
        const availableOnly = url.searchParams.get("available") === "true";
        const books = state.books
            .filter((book) => {
                const matchesSearch = !search || [book.title, book.author, book.isbn, book.category].join(" ").toLowerCase().includes(search);
                const matchesCategory = !category || category === "Semua" || book.category === category;
                const matchesAvailable = !availableOnly || book.available > 0;
                return matchesSearch && matchesCategory && matchesAvailable;
            })
            .map(bookWithMeta);
        sendSuccess(res, books);
        return;
    }

    if (req.method === "GET" && parts.length === 3) {
        const book = state.books.find((item) => item.id === parts[2]);
        if (!book) {
            sendError(res, 404, "Buku tidak ditemukan.");
            return;
        }
        sendSuccess(res, bookWithMeta(book));
        return;
    }

    if (req.method === "POST" && parts.length === 2) {
        const user = requireAdmin(req, res);
        if (!user) return;
        const body = await parseBody(req);
        const book = buildBookPayload(body);
        state.books.unshift(book);
        sendSuccess(res, bookWithMeta(book), "Buku berhasil ditambahkan.", 201);
        return;
    }

    if (req.method === "PUT" && parts.length === 3) {
        const user = requireAdmin(req, res);
        if (!user) return;
        const book = state.books.find((item) => item.id === parts[2]);
        if (!book) {
            sendError(res, 404, "Buku tidak ditemukan.");
            return;
        }
        const body = await parseBody(req);
        const updated = buildBookPayload({ ...book, ...body }, book.id);
        Object.assign(book, updated);
        sendSuccess(res, bookWithMeta(book), "Buku berhasil diperbarui.");
        return;
    }

    if (req.method === "DELETE" && parts.length === 3) {
        const user = requireAdmin(req, res);
        if (!user) return;
        const index = state.books.findIndex((item) => item.id === parts[2]);
        if (index < 0) {
            sendError(res, 404, "Buku tidak ditemukan.");
            return;
        }
        const hasActiveLoan = state.loans.some((loan) => loan.bookId === parts[2] && loan.status !== "returned");
        if (hasActiveLoan) {
            sendError(res, 409, "Buku masih memiliki pinjaman aktif.");
            return;
        }
        const [book] = state.books.splice(index, 1);
        sendSuccess(res, book, "Buku berhasil dihapus.");
        return;
    }

    sendError(res, 405, "Method tidak diizinkan untuk endpoint buku.");
}

function buildBookPayload(body, existingId = null) {
    const title = String(body.title || "").trim();
    const author = String(body.author || "").trim();
    const category = String(body.category || "Fiksi").trim();
    const total = Math.max(1, Number(body.total || 1));
    const available = Math.max(0, Math.min(total, Number(body.available ?? total)));
    if (!title || !author) {
        throw new Error("Judul dan penulis wajib diisi.");
    }
    return {
        id: existingId || `${slugify(title)}-${Date.now()}`,
        title,
        author,
        category,
        isbn: String(body.isbn || "ISBN baru").trim(),
        publisher: String(body.publisher || "Perpustakaan Digital").trim(),
        year: String(body.year || new Date().getFullYear()).trim(),
        total,
        available,
        description: String(body.description || "Buku koleksi Perpustakaan Digital.").trim()
    };
}

async function handleRequests(req, res, parts) {
    if (req.method === "GET" && parts.length === 2) {
        const user = requireAuth(req, res);
        if (!user) return;
        const requests = user.role === "admin"
            ? state.requests
            : state.requests.filter((request) => request.userId === user.id);
        sendSuccess(res, requests.map(requestWithBook));
        return;
    }

    if (req.method === "POST" && parts.length === 2) {
        const user = requireAuth(req, res);
        if (!user) return;
        const body = await parseBody(req);
        const book = state.books.find((item) => item.id === body.bookId);
        if (!book) {
            sendError(res, 404, "Buku tidak ditemukan.");
            return;
        }
        if (book.available <= 0) {
            sendError(res, 409, "Buku belum tersedia untuk dipinjam.");
            return;
        }
        const duplicate = state.requests.some((request) => request.userId === user.id && request.bookId === book.id && request.status === "waiting");
        if (duplicate) {
            sendError(res, 409, "Pengajuan untuk buku ini masih menunggu persetujuan.");
            return;
        }
        const request = {
            id: `request-${book.id}-${Date.now()}`,
            bookId: book.id,
            userId: user.id,
            borrower: user.name,
            requestedAt: formatDateId(new Date()),
            status: "waiting"
        };
        state.requests.unshift(request);
        sendSuccess(res, requestWithBook(request), "Pengajuan peminjaman berhasil dikirim.", 201);
        return;
    }

    if (req.method === "PATCH" && parts.length === 4 && parts[3] === "approve") {
        const user = requireAdmin(req, res);
        if (!user) return;
        const request = state.requests.find((item) => item.id === parts[2]);
        if (!request) {
            sendError(res, 404, "Pengajuan tidak ditemukan.");
            return;
        }
        if (request.status !== "waiting") {
            sendError(res, 409, "Pengajuan sudah diproses.");
            return;
        }
        const book = state.books.find((item) => item.id === request.bookId);
        if (!book || book.available <= 0) {
            sendError(res, 409, "Stok buku tidak tersedia.");
            return;
        }
        request.status = "approved";
        book.available -= 1;
        const borrowedAt = new Date();
        const loan = {
            id: `loan-${request.bookId}-${Date.now()}`,
            bookId: request.bookId,
            userId: request.userId,
            borrower: request.borrower,
            borrowedAt: formatShortDate(borrowedAt),
            dueAt: formatShortDate(addDays(borrowedAt, 14)),
            status: "active",
            fine: 0
        };
        state.loans.unshift(loan);
        sendSuccess(res, { request: requestWithBook(request), loan: loanWithBook(loan) }, "Pengajuan disetujui.");
        return;
    }

    if (req.method === "PATCH" && parts.length === 4 && parts[3] === "reject") {
        const user = requireAdmin(req, res);
        if (!user) return;
        const request = state.requests.find((item) => item.id === parts[2]);
        if (!request) {
            sendError(res, 404, "Pengajuan tidak ditemukan.");
            return;
        }
        if (request.status !== "waiting") {
            sendError(res, 409, "Pengajuan sudah diproses.");
            return;
        }
        request.status = "rejected";
        sendSuccess(res, requestWithBook(request), "Pengajuan ditolak.");
        return;
    }

    sendError(res, 405, "Method tidak diizinkan untuk endpoint pengajuan.");
}

async function handleLoans(req, res, parts) {
    if (req.method === "GET" && parts.length === 2) {
        const user = requireAuth(req, res);
        if (!user) return;
        const loans = user.role === "admin"
            ? state.loans
            : state.loans.filter((loan) => loan.userId === user.id);
        sendSuccess(res, loans.map(loanWithBook));
        return;
    }

    if (req.method === "PATCH" && parts.length === 4 && parts[3] === "return") {
        const user = requireAuth(req, res);
        if (!user) return;
        const loan = state.loans.find((item) => item.id === parts[2]);
        if (!loan) {
            sendError(res, 404, "Pinjaman tidak ditemukan.");
            return;
        }
        if (user.role !== "admin" && loan.userId !== user.id) {
            sendError(res, 403, "Pinjaman bukan milik akun ini.");
            return;
        }
        if (loan.status === "returned") {
            sendError(res, 409, "Buku sudah dikembalikan.");
            return;
        }
        loan.status = "returned";
        loan.fine = 0;
        const book = state.books.find((item) => item.id === loan.bookId);
        if (book) {
            book.available = Math.min(book.total, book.available + 1);
        }
        sendSuccess(res, loanWithBook(loan), "Pengembalian buku berhasil dikonfirmasi.");
        return;
    }

    if (req.method === "PATCH" && parts.length === 4 && parts[3] === "extend") {
        const user = requireAuth(req, res);
        if (!user) return;
        const loan = state.loans.find((item) => item.id === parts[2]);
        if (!loan) {
            sendError(res, 404, "Pinjaman tidak ditemukan.");
            return;
        }
        if (user.role !== "admin" && loan.userId !== user.id) {
            sendError(res, 403, "Pinjaman bukan milik akun ini.");
            return;
        }
        if (loan.status === "returned") {
            sendError(res, 409, "Pinjaman yang sudah selesai tidak dapat diperpanjang.");
            return;
        }
        loan.dueAt = formatShortDate(addDays(new Date(), 7));
        loan.status = "active";
        sendSuccess(res, loanWithBook(loan), "Pinjaman berhasil diperpanjang 7 hari.");
        return;
    }

    sendError(res, 405, "Method tidak diizinkan untuk endpoint pinjaman.");
}

function createServer() {
    return http.createServer(route);
}

if (require.main === module) {
    const server = createServer();
    server.listen(port, hostname, () => {
        console.log(`Server berjalan di http://${hostname}:${port}`);
    });
}

module.exports = {
    createServer,
    resetData
};
