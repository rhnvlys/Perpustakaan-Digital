import { setAuthToken, clearAuthToken, apiRequest } from './api/client.js';
import { login, register } from './api/authApi.js';
import { getBooks, getCategories, createBook, updateBook, deleteBook } from './api/bookApi.js';
import { getLoans, requestLoan as apiRequestLoan, approveLoan, rejectLoan, returnLoan, extendLoan } from './api/loanApi.js';
import { getDashboard } from './api/dashboardApi.js';
import { getNotifications } from './api/notificationApi.js';
import { authStore, setAuth, clearAuth as clearStoreAuth, loadAuth } from './state/authStore.js';
import { appState, setRoute, categories } from './state/appState.js';
import { icon } from './utils/icons.js';
import { escapeHTML, formatRupiah, formatDate, initialsFromName } from './utils/formatter.js';
import { showToast } from './components/toast.js';
import { renderTopbar } from './components/topbar.js';
import { renderSidebar } from './components/sidebar.js';
import { renderAuth, renderLoginForm, renderRegisterForm } from './views/authView.js';
import { renderStudentDashboard } from './views/studentDashboardView.js';
import { renderAdminDashboard } from './views/adminDashboardView.js';
import { renderCatalog, renderBookDetail } from './views/catalogView.js';
import { renderStudentRequests, renderStudentLoans, renderAdminRequests, renderAdminLoans, renderReturnBook } from './views/loansView.js';
import { renderStudentProfile, renderAdminProfile } from './views/profileView.js';
import { renderNotifications } from './views/notificationView.js';
import { renderAdminBooks } from './views/adminBooksView.js';

const app = document.getElementById('app');

async function syncAllData() {
    if (!authStore.isLoggedIn) return;
    
    try {
        const [booksData, categoriesData, loansData, dashboardData, notificationsData] = await Promise.all([
            getBooks(),
            getCategories(),
            getLoans(),
            getDashboard(),
            getNotifications()
        ]);
        
        appState.books = booksData.items || booksData || [];
        categories.splice(0, categories.length, 'Semua', ...(categoriesData || []));
        appState.dashboard = dashboardData;
        appState.notifications = notificationsData.notifications || notificationsData || [];
        
        const allLoans = loansData.loans || loansData || [];
        appState.requests = allLoans
            .filter(l => l.status === 'waiting' || l.status === 'approved' || l.status === 'rejected')
            .map(l => ({
                ...l,
                borrower: l.borrower || authStore.user?.name,
                requestedAt: formatDate(l.createdAt || l.requestedAt)
            }));
        appState.loans = allLoans
            .filter(l => l.status === 'active' || l.status === 'late' || l.status === 'returned')
            .map(l => ({
                ...l,
                borrowedAt: formatDate(l.borrowedAt),
                dueAt: formatDate(l.dueAt),
                fine: formatRupiah(l.fine)
            }));
    } catch (error) {
        console.error('Data sync error:', error);
    }
}

function renderShell(viewHtml) {
    return `
        <div class="app-screen">
            ${renderTopbar(appState)}
            <main class="content" id="mainContent">
                <div class="view">${viewHtml}</div>
            </main>
            ${renderSidebar(appState)}
        </div>
    `;
}

function renderCurrentView() {
    const role = authStore.role;
    const route = appState.route;
    
    if (role === 'admin') {
        switch (route) {
            case 'admin-dashboard': return renderAdminDashboard(appState);
            case 'admin-requests': return renderAdminRequests(appState);
            case 'admin-books': return renderAdminBooks(appState);
            case 'admin-loans': return renderAdminLoans(appState);
            case 'admin-profile': return renderAdminProfile(appState);
            default: return renderAdminDashboard(appState);
        }
    } else {
        switch (route) {
            case 'student-dashboard': return renderStudentDashboard(appState);
            case 'catalog': return renderCatalog(appState);
            case 'book-detail': return renderBookDetail(appState);
            case 'student-requests': return renderStudentRequests(appState);
            case 'student-loans': return renderStudentLoans(appState);
            case 'return-book': return renderReturnBook(appState);
            case 'student-profile': return renderStudentProfile(appState);
            case 'notifications': return renderNotifications(appState);
            default: return renderStudentDashboard(appState);
        }
    }
}

async function render() {
    if (!authStore.isLoggedIn) {
        app.innerHTML = renderAuth(appState.authMode);
    } else {
        app.innerHTML = renderShell(renderCurrentView());
    }
}

function toFrontendUser(user) {
    return {
        ...user,
        roleLabel: user.role === 'admin' ? 'Administrator' : 'Mahasiswa',
        initials: initialsFromName(user.name),
        memberSince: user.memberSince || '21 Juni 2026'
    };
}

async function handleClick(event) {
    const target = event.target.closest('[data-action], [data-route], [data-auth-mode], [data-category], [data-tab]');
    if (!target) return;

    if (target.dataset.authMode) {
        appState.authMode = target.dataset.authMode;
        render();
        return;
    }

    if (target.dataset.route) {
        setRoute(target.dataset.route);
        render();
        return;
    }

    if (target.dataset.category) {
        appState.category = target.dataset.category;
        render();
        return;
    }

    if (target.dataset.tab) {
        appState.loanTab = target.dataset.tab;
        render();
        return;
    }

    const { action } = target.dataset;

    if (action === 'toggle-sidebar') {
        appState.sidebarOpen = !appState.sidebarOpen;
        render();
    }
    if (action === 'close-sidebar') {
        appState.sidebarOpen = false;
        render();
    }
    if (action === 'logout') {
        clearAuthToken();
        clearStoreAuth();
        appState.route = 'login';
        appState.authMode = 'login';
        appState.user = null;
        appState.role = null;
        appState.books = [];
        appState.loans = [];
        appState.requests = [];
        appState.notifications = [];
        appState.dashboard = null;
        showToast('Berhasil keluar.');
        render();
    }
    if (action === 'detail-book') {
        appState.selectedBookId = target.dataset.bookId;
        setRoute('book-detail');
        render();
    }
    if (action === 'request-loan') {
        if (!appState.selectedBookId) return;
        const book = appState.books.find(b => b.id === appState.selectedBookId);
        if (!book || book.available <= 0) {
            showToast('Buku belum tersedia untuk dipinjam.');
            return;
        }
        try {
            await apiRequestLoan(book.id);
            await syncAllData();
            setRoute('student-requests');
            showToast('Pengajuan peminjaman dikirim.');
        } catch (error) {
            showToast(error.message);
        }
    }
    if (action === 'return-book') {
        appState.selectedLoanId = target.dataset.loanId;
        setRoute('return-book');
        render();
    }
    if (action === 'confirm-return') {
        try {
            await returnLoan(target.dataset.loanId);
            await syncAllData();
            appState.loanTab = 'history';
            setRoute('student-loans');
            showToast('Pengembalian berhasil dikonfirmasi.');
        } catch (error) {
            showToast(error.message);
        }
    }
    if (action === 'extend-loan') {
        try {
            await extendLoan(target.dataset.loanId);
            await syncAllData();
            showToast('Pinjaman berhasil diperpanjang.');
        } catch (error) {
            showToast(error.message);
        }
    }
    if (action === 'approve-request') {
        try {
            await approveLoan(target.dataset.requestId);
            await syncAllData();
            showToast('Pengajuan disetujui.');
        } catch (error) {
            showToast(error.message);
        }
    }
    if (action === 'reject-request') {
        try {
            await rejectLoan(target.dataset.requestId);
            await syncAllData();
            showToast('Pengajuan ditolak.');
        } catch (error) {
            showToast(error.message);
        }
    }
    if (action === 'toggle-book-form') {
        appState.bookFormOpen = true;
        render();
    }
    if (action === 'reset-book-form') {
        appState.bookFormOpen = false;
        appState.editingBookId = null;
        render();
    }
    if (action === 'edit-book') {
        appState.editingBookId = target.dataset.bookId;
        appState.bookFormOpen = true;
        render();
    }
    if (action === 'delete-book') {
        try {
            await deleteBook(target.dataset.bookId);
            await syncAllData();
            showToast('Buku dihapus dari katalog.');
        } catch (error) {
            showToast(error.message);
        }
    }
    if (action === 'send-notification') {
        showToast('Fitur notifikasi belum tersedia.');
    }
    if (action === 'mark-notifications') {
        showToast('Semua notifikasi ditandai terbaca.');
    }
    if (action === 'clear-notifications') {
        showToast('Notifikasi dihapus.');
    }
}

function handleInput(event) {
    const target = event.target;
    if (target.dataset.input === 'catalog-search') {
        appState.search = target.value;
        render();
    }
    if (target.dataset.input === 'admin-search') {
        appState.adminSearch = target.value;
        render();
    }
}

async function handleSubmit(event) {
    const form = event.target.closest('form');
    if (!form) return;
    event.preventDefault();

    if (form.dataset.form === 'login') {
        const data = new FormData(form);
        const email = String(data.get('email') || '').toLowerCase();
        const password = String(data.get('password') || '');
        try {
            const result = await login(email, password);
            const role = result.user.role === 'admin' ? 'admin' : 'student';
            setAuthToken(result.token);
            setAuth(result.user, result.token);
            authStore.user = toFrontendUser(result.user);
            await syncAllData();
            appState.route = role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
            appState.sidebarOpen = false;
            showToast('Berhasil masuk.');
        } catch (error) {
            showToast(error.message || 'Gagal masuk. Periksa kembali email dan password.');
        }
        render();
    }

    if (form.dataset.form === 'register') {
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const password = String(data.get('password') || '').trim();
        const nim = String(data.get('nim') || '').trim();
        try {
            await register(name, email, password, nim);
            appState.authMode = 'login';
            showToast('Registrasi berhasil. Silakan masuk.');
            render();
        } catch (error) {
            showToast(error.message || 'Registrasi gagal.');
        }
    }

    if (form.dataset.form === 'book') {
        const data = new FormData(form);
        const title = String(data.get('title') || '').trim();
        const author = String(data.get('author') || '').trim();
        const category = String(data.get('category') || 'Fiksi');
        const total = Math.max(1, Number(data.get('total') || 1));
        const available = Math.max(0, Math.min(total, Number(data.get('available') || 0)));
        if (!title || !author) {
            showToast('Judul dan penulis harus diisi.');
            return;
        }
        const payload = { title, author, category, total, available };
        try {
            if (appState.editingBookId) {
                await updateBook(appState.editingBookId, payload);
                showToast('Data buku diperbarui.');
            } else {
                await createBook(payload);
                showToast('Buku baru ditambahkan.');
            }
            await syncAllData();
            appState.bookFormOpen = false;
            appState.editingBookId = null;
        } catch (error) {
            showToast(error.message);
        }
        render();
    }
}

app.addEventListener('click', handleClick);
app.addEventListener('input', handleInput);
app.addEventListener('submit', handleSubmit);

async function init() {
    if (loadAuth()) {
        setAuthToken(authStore.token);
        appState.route = authStore.role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
        await syncAllData();
    }
    render();
}

init();