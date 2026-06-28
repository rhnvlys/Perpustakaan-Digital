const app = document.querySelector("#app");

const icons = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5z"/><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5zM8 6h8"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
    catalog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"/></svg>',
    request: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11l2 2 4-4"/><path d="M5 3h14v18H5z"/></svg>',
    loans: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h14"/><path d="M3 4h18v16H3z"/></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6v18h12V7l-4-4z"/><path d="M14 3v4h4M8 13h8M8 17h5"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/><path d="M10 11v6M14 11v6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 8.5 4.5 10 8a13.3 13.3 0 0 1-2.3 3.6"/><path d="M6.6 6.6A13.3 13.3 0 0 0 2 12c1.5 3.5 5 8 10 8 1.6 0 3.1-.4 4.4-1.1"/></svg>'
};

const books = [
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
        image: "https://picsum.photos/seed/laskar-pelangi-books/360/280",
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
        image: "https://picsum.photos/seed/bumi-manusia-book/360/280",
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
        image: "https://picsum.photos/seed/negeri-lima-menara-library/360/280",
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
        image: "https://picsum.photos/seed/ronggeng-dukuh-paruk/360/280",
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
        image: "https://picsum.photos/seed/cantik-itu-luka-novel/360/280",
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
        image: "https://picsum.photos/seed/sapiens-history-book/360/280",
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
        image: "https://picsum.photos/seed/atomic-habits-reading/360/280",
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
        image: "https://picsum.photos/seed/filosofi-teras-book/360/280",
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
        image: "https://picsum.photos/seed/indonesia-history-library/360/280",
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
        image: "https://picsum.photos/seed/habibie-biography-book/360/280",
        description: "Memoar tentang kehidupan, teknologi, dan keluarga."
    }
];

const state = {
    user: null,
    role: null,
    apiToken: "",
    apiConnected: false,
    authMode: "login",
    route: "student-dashboard",
    sidebarOpen: false,
    search: "",
    adminSearch: "",
    category: "Semua",
    selectedBookId: "laskar-pelangi",
    loanTab: "active",
    bookFormOpen: false,
    editingBookId: null,
    toast: "",
    loans: [
        {
            id: "loan-laskar",
            bookId: "laskar-pelangi",
            borrower: "Budi Santoso",
            borrowedAt: "15/4/2026",
            dueAt: "29/4/2026",
            status: "active",
            fine: "Rp0"
        },
        {
            id: "loan-bumi",
            bookId: "bumi-manusia",
            borrower: "Budi Santoso",
            borrowedAt: "15/2/2026",
            dueAt: "25/3/2026",
            status: "late",
            fine: "Rp62.000"
        },
        {
            id: "loan-ronggeng",
            bookId: "ronggeng-dukuh-paruk",
            borrower: "Budi Santoso",
            borrowedAt: "10/1/2026",
            dueAt: "24/1/2026",
            status: "returned",
            fine: "Rp0"
        },
        {
            id: "loan-negeri",
            bookId: "negeri-5-menara",
            borrower: "Siti Apriani",
            borrowedAt: "9/6/2026",
            dueAt: "23/6/2026",
            status: "active",
            fine: "Rp0"
        }
    ],
    requests: [
        {
            id: "request-laskar",
            bookId: "laskar-pelangi",
            borrower: "Budi Santoso",
            requestedAt: "30 Mei 2026",
            status: "waiting"
        }
    ]
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000";

const users = {
    student: {
        name: "Budi Santoso",
        email: "siswa@perpustakaan.com",
        roleLabel: "Mahasiswa",
        initials: "BS",
        memberSince: "15 Januari 2024"
    },
    admin: {
        name: "Ibu Ani Wijaya",
        email: "admin@perpustakaan.com",
        roleLabel: "Administrator",
        initials: "IA",
        memberSince: "10 Januari 2024"
    }
};

function icon(name) {
    return icons[name] || icons.book;
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function findBook(id) {
    return books.find((book) => book.id === id) || books[0];
}

function initialsFromName(name) {
    return String(name || "User")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "U";
}

function toFrontendUser(user) {
    return {
        name: user.name,
        email: user.email,
        roleLabel: user.roleLabel || (user.role === "admin" ? "Administrator" : "Mahasiswa"),
        initials: initialsFromName(user.name),
        memberSince: user.memberSince || "21 Juni 2026"
    };
}

function normalizeBook(book) {
    const existing = books.find((item) => item.id === book.id);
    return {
        ...(existing || {}),
        ...book,
        image: book.image || existing?.image || `https://picsum.photos/seed/${encodeURIComponent(book.id || book.title)}/360/280`
    };
}

function formatRupiah(value) {
    if (value === null || value === undefined) return "Rp0";
    if (typeof value === "string" && value.startsWith("Rp")) return value;
    const num = Number(value);
    if (isNaN(num)) return "Rp0";
    return "Rp" + num.toLocaleString("id-ID");
}

function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function normalizeLoan(loan) {
    return {
        ...loan,
        borrowedAt: formatDate(loan.borrowedAt),
        dueAt: formatDate(loan.dueAt),
        fine: formatRupiah(loan.fine)
    };
}

function normalizeRequest(request) {
    return {
        ...request,
        borrower: request.borrower || state.user?.name || "Mahasiswa",
        requestedAt: formatDate(request.createdAt || request.requestedAt)
    };
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(state.apiToken ? { Authorization: `Bearer ${state.apiToken}` } : {}),
            ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Request API gagal.");
    }
    return payload.data;
}

async function syncPublicCatalog() {
    try {
        const apiBooks = await apiRequest("/api/books");
        const booksList = apiBooks.books || [];
        books.splice(0, books.length, ...booksList.map(normalizeBook));
        state.apiConnected = true;
        render();
    } catch {
        state.apiConnected = false;
    }
}

async function syncPrivateData() {
    if (!state.apiToken) return;
    const [apiBooks, apiLoans] = await Promise.all([
        apiRequest("/api/books"),
        apiRequest("/api/loans")
    ]);
    const booksList = apiBooks.books || [];
    books.splice(0, books.length, ...booksList.map(normalizeBook));
    
    state.requests = apiLoans
        .filter((l) => l.status === "waiting" || l.status === "approved" || l.status === "rejected")
        .map(normalizeRequest);
    state.loans = apiLoans
        .filter((l) => l.status === "active" || l.status === "late" || l.status === "returned")
        .map(normalizeLoan);
        
    state.apiConnected = true;
}

function showToast(message) {
    state.toast = message;
    render();
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        state.toast = "";
        render();
    }, 2800);
}

function setRoute(route) {
    state.route = route;
    state.sidebarOpen = false;
    state.bookFormOpen = false;
    state.editingBookId = null;
    render();
}

function setRole(role) {
    state.role = role;
    state.user = users[role];
    state.route = role === "admin" ? "admin-dashboard" : "student-dashboard";
    state.sidebarOpen = false;
    render();
}

function logout() {
    state.user = null;
    state.role = null;
    state.apiToken = "";
    state.apiConnected = false;
    state.authMode = "login";
    state.sidebarOpen = false;
    state.toast = "";
    render();
}

function metricCard(title, value, iconName, tone, note = "") {
    return `
        <article class="metric-card ${tone}">
            <div class="metric-head">
                <p class="metric-title">${escapeHTML(title)}</p>
                <span class="metric-icon ${tone}">${icon(iconName)}</span>
            </div>
            <div>
                <p class="metric-value">${escapeHTML(value)}</p>
                ${note ? `<p class="metric-note">${escapeHTML(note)}</p>` : ""}
            </div>
        </article>
    `;
}

function statusBadge(status) {
    const labels = {
        active: "Aktif",
        late: "Terlambat",
        returned: "Dikembalikan",
        waiting: "Menunggu Persetujuan",
        approved: "Disetujui",
        rejected: "Ditolak"
    };
    const classes = {
        active: "active",
        late: "late",
        returned: "done",
        waiting: "waiting",
        approved: "approved",
        rejected: "rejected"
    };
    return `<span class="badge ${classes[status] || "active"}">${labels[status] || status}</span>`;
}

function bookCover(book, tall = false) {
    return `
        <div class="book-cover ${tall ? "tall" : ""}">
            <img src="${book.image}" alt="Sampul buku ${escapeHTML(book.title)}" loading="eager">
        </div>
    `;
}

function renderAuth() {
    const isRegister = state.authMode === "register";
    return `
        <main class="auth-screen" id="mainContent">
            <section class="auth-card" aria-labelledby="authTitle">
                <div class="auth-header">
                    <span class="brand-orb">${icon("book")}</span>
                    <h1 class="auth-title" id="authTitle">${isRegister ? "Daftar Akun Baru" : "Perpustakaan Digital"}</h1>
                    <p class="auth-subtitle">${isRegister ? "Buat akun perpustakaan digital Anda" : "Masuk ke akun Anda"}</p>
                </div>
                <div class="auth-body">
                    ${isRegister ? renderRegisterForm() : renderLoginForm()}
                </div>
            </section>
        </main>
    `;
}

function renderLoginForm() {
    return `
        <form class="form-stack" data-form="login">
            <div class="field">
                <label for="loginEmail">Email</label>
                <input class="text-input" id="loginEmail" name="email" type="email" placeholder="email@anda.com" autocomplete="email">
            </div>
            <div class="field">
                <label for="loginPassword">Kata Sandi</label>
                <div class="input-wrap has-icon">
                    <input class="text-input" id="loginPassword" name="password" type="password" placeholder="Masukkan kata sandi" autocomplete="current-password">
                    <span class="field-icon">${icon("eyeOff")}</span>
                </div>
            </div>
            <button class="button button-primary button-wide" type="submit">Masuk</button>
        </form>
        <p class="auth-switch">Tidak punya akun? <button class="link-button" type="button" data-auth-mode="register">Daftar di sini</button></p>
        <div class="demo-box">
            <p>Akun Demo:</p>
            <div><strong>Siswa:</strong> siswa@perpustakaan.com / siswa123</div>
            <div><strong>Admin:</strong> admin@perpustakaan.com / admin123</div>
        </div>
    `;
}

function renderRegisterForm() {
    return `
        <form class="form-stack" data-form="register">
            <div class="field">
                <label for="registerName">Nama Lengkap</label>
                <input class="text-input" id="registerName" name="name" type="text" placeholder="Masukkan nama lengkap" required>
            </div>
            <div class="field">
                <label for="registerNim">NIM / ID Siswa</label>
                <input class="text-input" id="registerNim" name="nim" type="text" placeholder="Contoh: 2024001234" required>
            </div>
            <div class="field">
                <label for="registerEmail">Email</label>
                <input class="text-input" id="registerEmail" name="email" type="email" placeholder="email@anda.com" required>
            </div>
            <div class="field">
                <label for="registerPassword">Kata Sandi</label>
                <input class="text-input" id="registerPassword" name="password" type="password" placeholder="Minimal 6 karakter" required minlength="6">
            </div>
            <button class="button button-primary button-wide" type="submit">Daftar Sekarang</button>
        </form>
        <p class="auth-switch">Sudah punya akun? <button class="link-button" type="button" data-auth-mode="login">Masuk di sini</button></p>
    `;
}

function navItems() {
    if (state.role === "admin") {
        return [
            ["admin-dashboard", "Beranda Admin", "home"],
            ["admin-requests", "Manajemen Pengajuan", "request"],
            ["admin-books", "Kelola Buku", "catalog"],
            ["admin-loans", "Data Peminjaman", "loans"],
            ["admin-profile", "Profil Admin", "profile"]
        ];
    }
    return [
        ["student-dashboard", "Beranda", "home"],
        ["catalog", "Katalog Buku", "catalog"],
        ["student-requests", "Pengajuan Peminjaman", "request"],
        ["student-loans", "Pinjaman Saya", "loans"],
        ["student-profile", "Profil Saya", "profile"]
    ];
}

function renderTopbar() {
    return `
        <header class="topbar">
            <div class="topbar-left">
                <button class="icon-btn" type="button" data-action="toggle-sidebar" aria-label="${state.sidebarOpen ? "Tutup menu" : "Buka menu"}">
                    ${state.sidebarOpen ? icon("close") : icon("menu")}
                </button>
                <span class="topbar-brand" aria-label="Perpustakaan Digital">${icon("book")}</span>
            </div>
            <div class="topbar-right">
                <button class="icon-btn" type="button" data-route="notifications" aria-label="Buka notifikasi">
                    ${icon("bell")}
                    <span class="notification-dot">2</span>
                </button>
                <button class="icon-btn" type="button" data-route="${state.role === "admin" ? "admin-profile" : "student-profile"}" aria-label="Buka profil">
                    ${icon("user")}
                </button>
            </div>
        </header>
    `;
}

function renderSidebar() {
    const user = state.user;
    return `
        <div class="sidebar-backdrop ${state.sidebarOpen ? "open" : ""}" data-action="close-sidebar"></div>
        <aside class="sidebar ${state.sidebarOpen ? "open" : ""}" aria-label="Menu navigasi">
            <div class="menu-title">${state.role === "admin" ? "Menu Admin" : "Menu Utama"}</div>
            <nav class="nav-list">
                ${navItems().map(([route, label, iconName]) => `
                    <button class="nav-link ${state.route === route ? "active" : ""}" type="button" data-route="${route}">
                        <span class="nav-icon">${icon(iconName)}</span>
                        <span>${label}</span>
                    </button>
                `).join("")}
                <button class="nav-link" type="button" data-action="logout">
                    <span class="nav-icon">${icon("logout")}</span>
                    <span>Keluar</span>
                </button>
            </nav>
            <div class="sidebar-user">
                <span class="avatar">${user.initials}</span>
                <div>
                    <p class="user-name">${escapeHTML(user.name)}</p>
                    <p class="user-role">${escapeHTML(user.roleLabel)}</p>
                </div>
            </div>
        </aside>
    `;
}

function renderShell() {
    return `
        <div class="app-screen">
            ${renderTopbar()}
            <main class="content" id="mainContent">
                <div class="view">${renderCurrentView()}</div>
            </main>
            ${renderSidebar()}
            ${state.toast ? renderToast(state.toast) : ""}
        </div>
    `;
}

function renderToast(message) {
    return `
        <div class="toast" role="status">
            <span class="metric-icon green">${icon("check")}</span>
            <span>${escapeHTML(message)}</span>
        </div>
    `;
}

function renderCurrentView() {
    const routes = {
        "student-dashboard": renderStudentDashboard,
        catalog: renderCatalog,
        "book-detail": renderBookDetail,
        "student-requests": renderStudentRequests,
        "student-loans": renderStudentLoans,
        "return-book": renderReturnBook,
        "student-profile": renderStudentProfile,
        notifications: renderNotifications,
        "admin-dashboard": renderAdminDashboard,
        "admin-requests": renderAdminRequests,
        "admin-books": renderAdminBooks,
        "admin-loans": renderAdminLoans,
        "admin-profile": renderAdminProfile
    };
    return (routes[state.route] || routes["student-dashboard"])();
}

function activeLoans(borrower = null) {
    return state.loans.filter((loan) => {
        const isActive = loan.status === "active" || loan.status === "late";
        return isActive && (!borrower || loan.borrower === borrower);
    });
}

function returnedLoans(borrower = null) {
    return state.loans.filter((loan) => loan.status === "returned" && (!borrower || loan.borrower === borrower));
}

function renderStudentDashboard() {
    const active = activeLoans(state.user.name);
    const late = active.filter((loan) => loan.status === "late");
    const latest = books.slice(0, 4);
    return `
        <section class="hero-panel">
            <h1>Selamat Datang, ${escapeHTML(state.user.name)}!</h1>
            <p>Berikut adalah ringkasan perpustakaan Anda</p>
        </section>
        <section class="section metric-grid">
            ${metricCard("Pinjaman Aktif", active.length, "book", "cyan")}
            ${metricCard("Buku Terlambat", late.length, "alert", "rose")}
            ${metricCard("Buku Dibaca", returnedLoans(state.user.name).length, "check", "green")}
            ${metricCard("Buku Tersedia", books.reduce((sum, book) => sum + book.available, 0), "file", "purple")}
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Pinjaman Saat Ini</h2>
                    <p>Buku yang sedang Anda pinjam</p>
                </div>
            </div>
            <div class="list-stack">
                ${active.length ? active.map(renderLoanRow).join("") : renderEmptyState("Tidak ada pinjaman aktif", "Ajukan peminjaman dari katalog buku.")}
            </div>
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Buku Terbaru</h2>
                    <p>Koleksi yang bisa Anda pinjam</p>
                </div>
                <button class="link-button" type="button" data-route="catalog">Lihat</button>
            </div>
            <div class="book-list">
                ${latest.map((book) => renderCompactBook(book)).join("")}
            </div>
        </section>
    `;
}

function renderLoanRow(loan) {
    const book = findBook(loan.bookId);
    return `
        <article class="loan-row">
            <div>
                <p class="row-title">${escapeHTML(book.title)}</p>
                <p class="row-subtitle">Jatuh tempo: ${escapeHTML(loan.dueAt)}</p>
            </div>
            ${statusBadge(loan.status)}
        </article>
    `;
}

function renderCompactBook(book) {
    return `
        <article class="compact-row">
            ${bookCover(book, true)}
            <div>
                <p class="row-title">${escapeHTML(book.title)}</p>
                <p class="row-subtitle">${escapeHTML(book.author)} - ${escapeHTML(book.category)}</p>
            </div>
        </article>
    `;
}

function renderCatalog() {
    const categories = ["Semua", "Fiksi", "Fiksi Sejarah", "Sejarah", "Pengembangan Diri", "Biografi"];
    const query = state.search.trim().toLowerCase();
    const filtered = books.filter((book) => {
        const matchCategory = state.category === "Semua" || book.category === state.category;
        const matchQuery = !query || [book.title, book.author, book.isbn, book.category].join(" ").toLowerCase().includes(query);
        return matchCategory && matchQuery;
    });
    return `
        <section class="hero-panel">
            <h1>Katalog Buku</h1>
            <p>Jelajahi dan cari koleksi perpustakaan kami</p>
        </section>
        <section class="search-box" role="search">
            <span class="search-icon">${icon("search")}</span>
            <label class="sr-only" for="catalogSearch">Cari buku</label>
            <input class="text-input" id="catalogSearch" data-input="catalog-search" type="search" value="${escapeHTML(state.search)}" placeholder="Cari berdasarkan judul, penulis, atau ISBN">
        </section>
        <div class="chip-row" aria-label="Filter kategori">
            ${categories.map((category) => `
                <button class="chip ${state.category === category ? "active" : ""}" type="button" data-category="${category}">
                    ${category}
                </button>
            `).join("")}
        </div>
        <div class="result-note">Menampilkan ${filtered.length} buku</div>
        <section class="book-grid" aria-label="Daftar buku">
            ${filtered.length ? filtered.map(renderBookCard).join("") : renderEmptyState("Buku tidak ditemukan", "Coba kata kunci atau kategori lain.")}
        </section>
    `;
}

function renderBookCard(book) {
    return `
        <article class="book-card">
            ${bookCover(book)}
            <h3>${escapeHTML(book.title)}</h3>
            <p>${escapeHTML(book.author)}</p>
            <div class="book-meta">
                <span class="category-pill">${escapeHTML(book.category)}</span>
                <span class="availability">${book.available} tersedia</span>
            </div>
            <button class="book-action" type="button" data-action="detail-book" data-book-id="${book.id}">
                ${icon("send")}
                Ajukan Peminjaman
            </button>
        </article>
    `;
}

function renderBookDetail() {
    const book = findBook(state.selectedBookId);
    return `
        <button class="button button-secondary" type="button" data-route="catalog">${icon("arrowLeft")} Kembali ke Katalog</button>
        <section class="section detail-hero">
            <div class="detail-cover">
                <img src="${book.image}" alt="Sampul buku ${escapeHTML(book.title)}">
            </div>
            <div class="detail-title">
                <span class="badge active">${book.available} eksemplar tersedia</span>
                <h1>${escapeHTML(book.title)}</h1>
                <p>${escapeHTML(book.author)}</p>
                <div class="book-meta">
                    <span class="category-pill">${escapeHTML(book.category)}</span>
                </div>
            </div>
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Detail Buku</h2>
                    <p>${escapeHTML(book.description)}</p>
                </div>
            </div>
            <div class="detail-grid">
                <div class="detail-row"><span>ISBN</span><strong>${escapeHTML(book.isbn)}</strong></div>
                <div class="detail-row"><span>Penerbit</span><strong>${escapeHTML(book.publisher)}</strong></div>
                <div class="detail-row"><span>Tahun Terbit</span><strong>${escapeHTML(book.year)}</strong></div>
                <div class="detail-row"><span>Total Eksemplar</span><strong>${book.total}</strong></div>
                <div class="detail-row"><span>Ketersediaan</span><strong>${book.available} dari ${book.total} eksemplar tersedia</strong></div>
            </div>
        </section>
        <section class="section">
            <button class="button button-primary button-wide" type="button" data-action="request-loan" ${book.available === 0 ? "disabled" : ""}>
                ${icon("send")} Ajukan Peminjaman
            </button>
        </section>
    `;
}

function renderStudentRequests() {
    const mine = state.requests.filter((request) => request.borrower === state.user.name);
    const waiting = mine.filter((request) => request.status === "waiting").length;
    const approved = mine.filter((request) => request.status === "approved").length;
    const rejected = mine.filter((request) => request.status === "rejected").length;
    return `
        <section class="hero-panel">
            <h1>Pengajuan Peminjaman</h1>
            <p>Lacak status pengajuan peminjaman buku Anda</p>
        </section>
        <section class="section metric-grid three">
            ${metricCard("Menunggu", waiting, "clock", "yellow")}
            ${metricCard("Disetujui", approved, "check", "green")}
            ${metricCard("Ditolak", rejected, "alert", "rose")}
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Daftar Pengajuan</h2>
                    <p>${mine.length} pengajuan ditemukan</p>
                </div>
            </div>
            <div class="list-stack">
                ${mine.length ? mine.map(renderRequestCard).join("") : renderEmptyState("Belum ada pengajuan", "Pilih buku di katalog lalu ajukan peminjaman.")}
            </div>
        </section>
    `;
}

function renderRequestCard(request) {
    const book = findBook(request.bookId);
    return `
        <article class="request-card ${request.status === "waiting" ? "pending" : ""}">
            <div class="request-main">
                ${bookCover(book, true)}
                <div>
                    <p class="row-title">${escapeHTML(book.title)}</p>
                    <p class="row-subtitle">${escapeHTML(book.author)}</p>
                    <p class="row-subtitle">Diajukan: ${escapeHTML(request.requestedAt)}</p>
                </div>
            </div>
            ${statusBadge(request.status)}
        </article>
    `;
}

function renderStudentLoans() {
    const active = activeLoans(state.user.name);
    const returned = returnedLoans(state.user.name);
    const items = state.loanTab === "active" ? active : returned;
    return `
        <section class="hero-panel">
            <h1>Pinjaman Saya</h1>
            <p>Lacak buku yang Anda pinjam</p>
        </section>
        <section class="section tabs" aria-label="Tab pinjaman">
            <button class="tab-button ${state.loanTab === "active" ? "active" : ""}" type="button" data-tab="active">Pinjaman Aktif (${active.length})</button>
            <button class="tab-button ${state.loanTab === "history" ? "active" : ""}" type="button" data-tab="history">Riwayat (${returned.length})</button>
        </section>
        <section class="section list-stack">
            ${items.length ? items.map(renderLoanCard).join("") : renderEmptyState("Tidak ada data", "Data pinjaman akan tampil di sini.")}
        </section>
    `;
}

function renderLoanCard(loan) {
    const book = findBook(loan.bookId);
    const late = loan.status === "late";
    return `
        <article class="panel-card">
            <div class="request-main">
                ${bookCover(book, true)}
                <div>
                    <p class="row-title">${escapeHTML(book.title)}</p>
                    <p class="row-subtitle">Dipinjam: ${escapeHTML(loan.borrowedAt)}</p>
                    <p class="row-subtitle">Jatuh tempo: ${escapeHTML(loan.dueAt)}</p>
                </div>
            </div>
            <div class="book-meta">
                ${statusBadge(loan.status)}
                ${late ? '<span class="badge rejected">Anda terlambat 31 hari</span>' : ""}
            </div>
            ${late ? `<div class="warning-box section">Total denda: <strong>${loan.fine}</strong></div>` : ""}
            ${loan.status !== "returned" ? `
                <div class="actions-row">
                    <button class="button button-primary" type="button" data-action="return-book" data-loan-id="${loan.id}">Kembalikan Buku</button>
                    <button class="button button-secondary" type="button" data-action="extend-loan" data-loan-id="${loan.id}">Perpanjang</button>
                </div>
            ` : ""}
        </article>
    `;
}

function renderReturnBook() {
    const loan = state.loans.find((item) => item.id === state.selectedLoanId && item.borrower === state.user.name) || activeLoans(state.user.name)[0] || state.loans[0];
    const book = findBook(loan.bookId);
    return `
        <button class="button button-secondary" type="button" data-route="student-loans">${icon("arrowLeft")} Kembali</button>
        <section class="section hero-panel">
            <h1>Pengembalian Buku</h1>
            <p>Konfirmasi pengembalian buku perpustakaan</p>
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Informasi Buku</h2>
                    <p>Periksa data sebelum konfirmasi</p>
                </div>
            </div>
            <div class="detail-grid">
                <div class="detail-row"><span>Judul Buku</span><strong>${escapeHTML(book.title)}</strong></div>
                <div class="detail-row"><span>Tanggal Pinjam</span><strong>${escapeHTML(loan.borrowedAt)}</strong></div>
                <div class="detail-row"><span>Jatuh Tempo</span><strong>${escapeHTML(loan.dueAt)}</strong></div>
                <div class="detail-row"><span>Denda</span><strong>${escapeHTML(loan.fine)}</strong></div>
            </div>
        </section>
        <section class="section">
            <button class="button button-primary button-wide" type="button" data-action="confirm-return" data-loan-id="${loan.id}">
                ${icon("check")} Konfirmasi Pengembalian
            </button>
        </section>
    `;
}

function renderStudentProfile() {
    const mine = state.loans.filter((loan) => loan.borrower === state.user.name);
    return renderProfileCard("Profil Saya", "Kelola informasi akun Anda", [
        ["Nama Lengkap", state.user.name],
        ["Email", state.user.email],
        ["Status Akun", state.user.roleLabel],
        ["Anggota Sejak", state.user.memberSince],
        ["Buku Selesai", returnedLoans(state.user.name).length],
        ["Total Pinjaman", mine.length]
    ]);
}

function renderAdminProfile() {
    return renderProfileCard("Profil Admin", "Kelola informasi akun administrator", [
        ["Nama Lengkap", state.user.name],
        ["Email", state.user.email],
        ["Status Akun", state.user.roleLabel],
        ["Bertugas Sejak", state.user.memberSince],
        ["Pengajuan Menunggu", state.requests.filter((request) => request.status === "waiting").length],
        ["Total Buku", books.length]
    ]);
}

function renderProfileCard(title, subtitle, facts) {
    return `
        <section class="hero-panel">
            <h1>${escapeHTML(title)}</h1>
            <p>${escapeHTML(subtitle)}</p>
        </section>
        <section class="section profile-card">
            <div class="profile-head">
                <span class="avatar large">${escapeHTML(state.user.initials)}</span>
                <div>
                    <p class="row-title">${escapeHTML(state.user.name)}</p>
                    <p class="row-subtitle">${escapeHTML(state.user.roleLabel)}</p>
                </div>
            </div>
            <div class="profile-facts">
                ${facts.map(([label, value]) => `
                    <div class="fact-row">
                        <span>${escapeHTML(label)}</span>
                        <strong>${escapeHTML(value)}</strong>
                    </div>
                `).join("")}
            </div>
        </section>
    `;
}

function renderNotifications() {
    const items = [
        ["Buku \"Laskar Pelangi\" akan jatuh tempo dalam 3 hari", "2 jam yang lalu"],
        ["Peminjaman buku \"Bumi Manusia\" telah disetujui", "5 jam yang lalu"],
        ["Terima kasih telah mengembalikan \"Ronggeng Dukuh Paruk\"", "1 hari yang lalu"],
        ["Buku baru \"Cantik Itu Luka\" telah tersedia", "2 hari yang lalu"],
        ["Perpustakaan tutup pada tanggal 20 Mei 2026", "3 hari yang lalu"]
    ];
    return `
        <section class="hero-panel">
            <h1>Notifikasi</h1>
            <p>2 notifikasi belum dibaca</p>
        </section>
        <section class="section actions-row">
            <button class="button button-secondary" type="button" data-action="mark-notifications">Tandai Semua</button>
            <button class="button button-danger" type="button" data-action="clear-notifications">Hapus Semua</button>
        </section>
        <section class="section list-stack">
            ${items.map(([title, time], index) => `
                <article class="notification-row">
                    <span class="metric-icon ${index < 2 ? "rose" : "cyan"}">${index < 2 ? icon("bell") : icon("check")}</span>
                    <div>
                        <p class="row-title">${escapeHTML(title)}</p>
                        <p class="row-subtitle">${escapeHTML(time)}</p>
                    </div>
                </article>
            `).join("")}
        </section>
    `;
}

function renderAdminDashboard() {
    const waiting = state.requests.filter((request) => request.status === "waiting").length;
    const active = activeLoans().length;
    const available = books.reduce((sum, book) => sum + book.available, 0);
    return `
        <section class="hero-panel with-action">
            <div>
                <h1>Beranda Admin</h1>
                <p>Ringkasan manajemen perpustakaan</p>
            </div>
            <button class="button button-secondary" type="button" data-action="send-notification">${icon("send")} Kirim Notifikasi</button>
        </section>
        <section class="section metric-grid three">
            ${metricCard("Total Buku", books.reduce((sum, book) => sum + book.total, 0), "book", "cyan", `${books.length} judul unik`)}
            ${metricCard("Pengajuan Menunggu", waiting, "clock", "yellow", "Perlu ditindaklanjuti")}
            ${metricCard("Peminjaman Aktif", active, "chart", "green", "Buku dipinjam")}
            ${metricCard("Buku Tersedia", available, "file", "purple", "Siap dipinjam")}
            ${metricCard("Pinjaman Terlambat", state.loans.filter((loan) => loan.status === "late").length, "alert", "rose", "Perlu perhatian")}
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Buku Populer</h2>
                    <p>Koleksi dengan peminjaman aktif</p>
                </div>
            </div>
            <div class="book-list">
                ${books.slice(0, 4).map(renderCompactBook).join("")}
            </div>
        </section>
    `;
}

function renderAdminRequests() {
    const query = state.adminSearch.trim().toLowerCase();
    const filtered = state.requests.filter((request) => {
        const book = findBook(request.bookId);
        return !query || [book.title, book.author, request.borrower, request.status].join(" ").toLowerCase().includes(query);
    });
    return `
        <section class="hero-panel">
            <h1>Manajemen Pengajuan</h1>
            <p>Kelola pengajuan peminjaman buku dari mahasiswa</p>
        </section>
        <section class="section metric-grid two">
            ${metricCard("Menunggu", state.requests.filter((request) => request.status === "waiting").length, "clock", "yellow")}
            ${metricCard("Disetujui", state.requests.filter((request) => request.status === "approved").length, "check", "green")}
            ${metricCard("Ditolak", state.requests.filter((request) => request.status === "rejected").length, "alert", "rose")}
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Daftar Pengajuan</h2>
                    <p>${filtered.length} pengajuan ditemukan</p>
                </div>
            </div>
            <div class="search-box" role="search">
                <span class="search-icon">${icon("search")}</span>
                <label class="sr-only" for="adminSearch">Cari pengajuan</label>
                <input class="text-input" id="adminSearch" data-input="admin-search" type="search" value="${escapeHTML(state.adminSearch)}" placeholder="Cari nama mahasiswa atau judul buku">
            </div>
            <div class="section list-stack">
                ${filtered.length ? filtered.map(renderAdminRequestCard).join("") : renderEmptyState("Tidak ada pengajuan", "Pengajuan akan muncul saat mahasiswa mengirim permintaan.")}
            </div>
        </section>
    `;
}

function renderAdminRequestCard(request) {
    const book = findBook(request.bookId);
    const canAct = request.status === "waiting";
    return `
        <article class="request-card ${canAct ? "pending" : ""}">
            <div class="request-main">
                ${bookCover(book, true)}
                <div>
                    <p class="row-title">${escapeHTML(book.title)}</p>
                    <p class="row-subtitle">${escapeHTML(book.author)}</p>
                    <p class="row-subtitle">Oleh: ${escapeHTML(request.borrower)} - ${escapeHTML(request.requestedAt)}</p>
                </div>
            </div>
            ${statusBadge(request.status)}
            ${canAct ? `
                <div class="request-actions">
                    <button class="button button-success button-small" type="button" data-action="approve-request" data-request-id="${request.id}">${icon("check")} Setujui</button>
                    <button class="button button-danger button-small" type="button" data-action="reject-request" data-request-id="${request.id}">${icon("close")} Tolak</button>
                </div>
            ` : ""}
        </article>
    `;
}

function renderAdminBooks() {
    const query = state.adminSearch.trim().toLowerCase();
    const filtered = books.filter((book) => {
        return !query || [book.title, book.author, book.isbn, book.category].join(" ").toLowerCase().includes(query);
    });
    return `
        <section class="hero-panel">
            <h1>Kelola Buku</h1>
            <p>${books.length} buku dalam katalog</p>
        </section>
        <section class="section admin-toolbar">
            <button class="button button-primary" type="button" data-action="toggle-book-form">${icon("plus")} ${state.editingBookId ? "Edit Buku" : "Tambah"}</button>
            <button class="button button-secondary" type="button" data-action="reset-book-form">Reset</button>
        </section>
        ${state.bookFormOpen ? renderBookForm() : ""}
        <section class="search-box" role="search">
            <span class="search-icon">${icon("search")}</span>
            <label class="sr-only" for="bookSearch">Cari buku admin</label>
            <input class="text-input" id="bookSearch" data-input="admin-search" type="search" value="${escapeHTML(state.adminSearch)}" placeholder="Cari judul, penulis, atau ISBN">
        </section>
        <div class="result-note">Menampilkan ${filtered.length} dari ${books.length} buku</div>
        <section class="book-list">
            ${filtered.map(renderAdminBookRow).join("")}
        </section>
    `;
}

function renderBookForm() {
    const editing = state.editingBookId ? findBook(state.editingBookId) : null;
    return `
        <form class="inline-form section" data-form="book">
            <div class="form-grid">
                <div class="field full-span">
                    <label for="bookTitle">Judul</label>
                    <input class="text-input" id="bookTitle" name="title" type="text" value="${editing ? escapeHTML(editing.title) : ""}" required>
                </div>
                <div class="field">
                    <label for="bookAuthor">Penulis</label>
                    <input class="text-input" id="bookAuthor" name="author" type="text" value="${editing ? escapeHTML(editing.author) : ""}" required>
                </div>
                <div class="field">
                    <label for="bookCategory">Kategori</label>
                    <select class="select-input" id="bookCategory" name="category">
                        ${["Fiksi", "Fiksi Sejarah", "Sejarah", "Pengembangan Diri", "Biografi"].map((category) => `
                            <option value="${category}" ${editing && editing.category === category ? "selected" : ""}>${category}</option>
                        `).join("")}
                    </select>
                </div>
                <div class="field">
                    <label for="bookTotal">Eksemplar</label>
                    <input class="text-input" id="bookTotal" name="total" type="number" min="1" value="${editing ? editing.total : 1}" required>
                </div>
                <div class="field">
                    <label for="bookAvailable">Tersedia</label>
                    <input class="text-input" id="bookAvailable" name="available" type="number" min="0" value="${editing ? editing.available : 1}" required>
                </div>
            </div>
            <button class="button button-primary button-wide" type="submit">${editing ? "Simpan Perubahan" : "Tambah Buku"}</button>
        </form>
    `;
}

function renderAdminBookRow(book) {
    return `
        <article class="request-card">
            <div class="request-main">
                ${bookCover(book, true)}
                <div>
                    <p class="row-title">${escapeHTML(book.title)}</p>
                    <p class="row-subtitle">${escapeHTML(book.author)}</p>
                    <p class="row-subtitle">${escapeHTML(book.category)} - ${escapeHTML(book.isbn)}</p>
                    <p class="row-subtitle">Total: ${book.total} - Tersedia: ${book.available}</p>
                </div>
            </div>
            <div class="request-actions">
                <button class="button button-secondary button-small" type="button" data-action="edit-book" data-book-id="${book.id}">${icon("edit")} Edit</button>
                <button class="button button-danger button-small" type="button" data-action="delete-book" data-book-id="${book.id}">${icon("trash")} Hapus</button>
            </div>
        </article>
    `;
}

function renderAdminLoans() {
    const allLoans = state.loans;
    return `
        <section class="hero-panel">
            <h1>Data Peminjaman</h1>
            <p>Lihat dan kelola semua catatan peminjaman</p>
        </section>
        <section class="section metric-grid two">
            ${metricCard("Total", allLoans.length, "loans", "cyan")}
            ${metricCard("Aktif", activeLoans().length, "chart", "green")}
            ${metricCard("Telat", allLoans.filter((loan) => loan.status === "late").length, "alert", "rose")}
            ${metricCard("Dikembalikan", returnedLoans().length, "check", "purple")}
        </section>
        <section class="section table-card">
            <div class="table-header">
                <span>Buku</span>
                <span>Peminjam</span>
                <span>Status</span>
            </div>
            ${allLoans.map((loan) => {
                const book = findBook(loan.bookId);
                return `
                    <div class="table-row">
                        <span><strong>${escapeHTML(book.title)}</strong>${escapeHTML(loan.borrowedAt)}</span>
                        <span>${escapeHTML(loan.borrower)}</span>
                        <span>${statusBadge(loan.status)}</span>
                    </div>
                `;
            }).join("")}
        </section>
    `;
}

function renderEmptyState(title, text) {
    return `
        <div class="empty-state">
            <strong>${escapeHTML(title)}</strong>
            <span>${escapeHTML(text)}</span>
        </div>
    `;
}

async function requestLoan() {
    const book = findBook(state.selectedBookId);
    if (book.available <= 0) {
        showToast("Buku belum tersedia untuk dipinjam.");
        return;
    }
    if (state.apiToken) {
        try {
            await apiRequest("/api/loans", {
                method: "POST",
                body: { bookId: book.id }
            });
            await syncPrivateData();
            state.route = "student-requests";
            showToast("Pengajuan peminjaman dikirim ke backend.");
        } catch (error) {
            showToast(error.message);
        }
        return;
    }
    const exists = state.requests.some((request) => request.bookId === book.id && request.borrower === state.user.name && request.status === "waiting");
    if (!exists) {
        state.requests.unshift({
            id: `request-${book.id}-${Date.now()}`,
            bookId: book.id,
            borrower: state.user.name,
            requestedAt: "21 Juni 2026",
            status: "waiting"
        });
    }
    state.route = "student-requests";
    showToast("Pengajuan peminjaman dikirim.");
}

async function approveRequest(id) {
    if (state.apiToken) {
        try {
            await apiRequest(`/api/loans/${id}/approve`, { method: "PATCH" });
            await syncPrivateData();
            showToast("Pengajuan disetujui di backend.");
        } catch (error) {
            showToast(error.message);
        }
        return;
    }
    const request = state.requests.find((item) => item.id === id);
    if (!request) return;
    request.status = "approved";
    const book = findBook(request.bookId);
    if (book.available > 0) {
        book.available -= 1;
    }
    state.loans.unshift({
        id: `loan-${request.bookId}-${Date.now()}`,
        bookId: request.bookId,
        borrower: request.borrower,
        borrowedAt: "21/6/2026",
        dueAt: "5/7/2026",
        status: "active",
        fine: "Rp0"
    });
    showToast("Pengajuan disetujui.");
}

async function rejectRequest(id) {
    if (state.apiToken) {
        try {
            await apiRequest(`/api/loans/${id}/reject`, { method: "PATCH" });
            await syncPrivateData();
            showToast("Pengajuan ditolak di backend.");
        } catch (error) {
            showToast(error.message);
        }
        return;
    }
    const request = state.requests.find((item) => item.id === id);
    if (!request) return;
    request.status = "rejected";
    showToast("Pengajuan ditolak.");
}

async function markReturned(id) {
    if (state.apiToken) {
        try {
            await apiRequest(`/api/loans/${id}/return`, { method: "PATCH" });
            await syncPrivateData();
            state.route = "student-loans";
            state.loanTab = "history";
            showToast("Pengembalian berhasil dikonfirmasi di backend.");
        } catch (error) {
            showToast(error.message);
        }
        return;
    }
    const loan = state.loans.find((item) => item.id === id);
    if (!loan) return;
    loan.status = "returned";
    loan.fine = "Rp0";
    const book = findBook(loan.bookId);
    book.available += 1;
    state.route = "student-loans";
    state.loanTab = "history";
    showToast("Pengembalian berhasil dikonfirmasi.");
}

async function extendLoan(id) {
    if (state.apiToken) {
        try {
            await apiRequest(`/api/loans/${id}/extend`, { method: "PATCH" });
            await syncPrivateData();
            showToast("Pinjaman berhasil diperpanjang di backend.");
        } catch (error) {
            showToast(error.message);
        }
        return;
    }
    showToast("Permintaan perpanjangan dicatat.");
}

async function addOrUpdateBook(form) {
    const data = new FormData(form);
    const title = String(data.get("title") || "").trim();
    const author = String(data.get("author") || "").trim();
    const category = String(data.get("category") || "Fiksi");
    const total = Math.max(1, Number(data.get("total") || 1));
    const available = Math.max(0, Math.min(total, Number(data.get("available") || 0)));
    if (!title || !author) return;
    const payload = { title, author, category, total, available };

    if (state.apiToken) {
        try {
            if (state.editingBookId) {
                await apiRequest(`/api/books/${state.editingBookId}`, {
                    method: "PUT",
                    body: payload
                });
                showToast("Data buku diperbarui di backend.");
            } else {
                await apiRequest("/api/books", {
                    method: "POST",
                    body: payload
                });
                showToast("Buku baru ditambahkan ke backend.");
            }
            await syncPrivateData();
            state.bookFormOpen = false;
            state.editingBookId = null;
        } catch (error) {
            showToast(error.message);
        }
        return;
    }

    if (state.editingBookId) {
        const book = findBook(state.editingBookId);
        book.title = title;
        book.author = author;
        book.category = category;
        book.total = total;
        book.available = available;
        showToast("Data buku diperbarui.");
    } else {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `buku-${Date.now()}`;
        books.unshift({
            id: `${slug}-${Date.now()}`,
            title,
            author,
            category,
            isbn: "ISBN baru",
            publisher: "Perpustakaan Digital",
            year: "2026",
            total,
            available,
            image: `https://picsum.photos/seed/${encodeURIComponent(slug)}/360/280`,
            description: "Buku tambahan dari admin perpustakaan."
        });
        showToast("Buku baru ditambahkan.");
    }

    state.bookFormOpen = false;
    state.editingBookId = null;
}

async function deleteBook(id) {
    if (state.apiToken) {
        try {
            await apiRequest(`/api/books/${id}`, { method: "DELETE" });
            await syncPrivateData();
            showToast("Buku dihapus dari backend.");
        } catch (error) {
            showToast(error.message);
        }
        return;
    }
    const index = books.findIndex((book) => book.id === id);
    if (index < 0) return;
    books.splice(index, 1);
    showToast("Buku dihapus dari katalog.");
}

function handleClick(event) {
    const target = event.target.closest("[data-action], [data-route], [data-auth-mode], [data-category], [data-tab]");
    if (!target) return;

    if (target.dataset.authMode) {
        state.authMode = target.dataset.authMode;
        render();
        return;
    }

    if (target.dataset.route) {
        setRoute(target.dataset.route);
        return;
    }

    if (target.dataset.category) {
        state.category = target.dataset.category;
        render();
        return;
    }

    if (target.dataset.tab) {
        state.loanTab = target.dataset.tab;
        render();
        return;
    }

    const { action } = target.dataset;

    if (action === "toggle-sidebar") {
        state.sidebarOpen = !state.sidebarOpen;
        render();
    }
    if (action === "close-sidebar") {
        state.sidebarOpen = false;
        render();
    }
    if (action === "logout") {
        logout();
    }
    if (action === "detail-book") {
        state.selectedBookId = target.dataset.bookId;
        setRoute("book-detail");
    }
    if (action === "request-loan") {
        requestLoan();
    }
    if (action === "return-book") {
        state.selectedLoanId = target.dataset.loanId;
        setRoute("return-book");
    }
    if (action === "confirm-return") {
        markReturned(target.dataset.loanId);
    }
    if (action === "extend-loan") {
        extendLoan(target.dataset.loanId);
    }
    if (action === "approve-request") {
        approveRequest(target.dataset.requestId);
    }
    if (action === "reject-request") {
        rejectRequest(target.dataset.requestId);
    }
    if (action === "toggle-book-form") {
        state.bookFormOpen = true;
        render();
    }
    if (action === "reset-book-form") {
        state.bookFormOpen = false;
        state.editingBookId = null;
        render();
    }
    if (action === "edit-book") {
        state.editingBookId = target.dataset.bookId;
        state.bookFormOpen = true;
        render();
    }
    if (action === "delete-book") {
        deleteBook(target.dataset.bookId);
    }
    if (action === "send-notification") {
        showToast("Notifikasi contoh dikirim.");
    }
    if (action === "mark-notifications") {
        showToast("Semua notifikasi ditandai terbaca.");
    }
    if (action === "clear-notifications") {
        showToast("Notifikasi contoh dihapus.");
    }
}

function handleInput(event) {
    const target = event.target;
    if (target.dataset.input === "catalog-search") {
        state.search = target.value;
        render();
    }
    if (target.dataset.input === "admin-search") {
        state.adminSearch = target.value;
        render();
    }
}

async function handleSubmit(event) {
    const form = event.target.closest("form");
    if (!form) return;
    event.preventDefault();

    if (form.dataset.form === "login") {
        const data = new FormData(form);
        const email = String(data.get("email") || "").toLowerCase();
        const password = String(data.get("password") || "");
        try {
            const result = await apiRequest("/api/auth/login", {
                method: "POST",
                body: { email, password }
            });
            const role = result.user.role === "admin" ? "admin" : "student";
            state.apiToken = result.token;
            state.role = role;
            state.user = toFrontendUser(result.user);
            users[role] = state.user;
            state.route = role === "admin" ? "admin-dashboard" : "student-dashboard";
            state.sidebarOpen = false;
            await syncPrivateData();
            showToast("Berhasil masuk dan terhubung ke backend.");
        } catch (error) {
            showToast(error.message || "Gagal masuk. Periksa kembali email dan password.");
        }
    }

    if (form.dataset.form === "register") {
        const data = new FormData(form);
        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        const password = String(data.get("password") || "").trim();
        const nim = String(data.get("nim") || "").trim();
        try {
            await apiRequest("/api/auth/register", {
                method: "POST",
                body: { name, email, password, nim }
            });
            state.authMode = "login";
            showToast("Registrasi berhasil. Silakan masuk.");
            render();
        } catch (error) {
            showToast(error.message || "Registrasi gagal.");
        }
    }

    if (form.dataset.form === "book") {
        await addOrUpdateBook(form);
        render();
    }
}

function render() {
    app.innerHTML = state.user ? renderShell() : renderAuth();
}

app.addEventListener("click", handleClick);
app.addEventListener("input", handleInput);
app.addEventListener("submit", handleSubmit);

render();
syncPublicCatalog();
