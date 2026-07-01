import { authStore } from '../state/authStore.js';
import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';
import { metricCard, bookCover, statusBadge } from '../utils/formatter.js';
import { renderEmptyState } from '../components/emptyState.js';

export function renderStudentRequests(state) {
    const mine = state.requests.filter(r => r.borrower === authStore.user?.name);
    const waiting = mine.filter(r => r.status === 'waiting').length;
    const approved = mine.filter(r => r.status === 'approved').length;
    const rejected = mine.filter(r => r.status === 'rejected').length;
    
    return `
        <section class="hero-panel">
            <h1>Pengajuan Peminjaman</h1>
            <p>Lacak status pengajuan peminjaman buku Anda</p>
        </section>
        <section class="section metric-grid three">
            ${metricCard('Menunggu', waiting, 'clock', 'yellow')}
            ${metricCard('Disetujui', approved, 'check', 'green')}
            ${metricCard('Ditolak', rejected, 'alert', 'rose')}
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Daftar Pengajuan</h2>
                    <p>${mine.length} pengajuan ditemukan</p>
                </div>
            </div>
            <div class="list-stack">
                ${mine.length ? mine.map(req => {
                    const book = state.books.find(b => b.id === req.bookId) || { title: '-', author: '-', image: '' };
                    return `
                        <article class="request-card ${req.status === 'waiting' ? 'pending' : ''}">
                            <div class="request-main">
                                ${bookCover(book, true)}
                                <div>
                                    <p class="row-title">${escapeHTML(book.title)}</p>
                                    <p class="row-subtitle">${escapeHTML(book.author)}</p>
                                    <p class="row-subtitle">Diajukan: ${escapeHTML(req.requestedAt)}</p>
                                </div>
                            </div>
                            ${statusBadge(req.status)}
                        </article>
                    `;
                }).join('') : renderEmptyState('Belum ada pengajuan', 'Pilih buku di katalog lalu ajukan peminjaman.')}
            </div>
        </section>
    `;
}

export function renderStudentLoans(state) {
    const active = state.loans.filter(l => l.status === 'active' || l.status === 'late');
    const returned = state.loans.filter(l => l.status === 'returned');
    const items = state.loanTab === 'active' ? active : returned;
    
    return `
        <section class="hero-panel">
            <h1>Pinjaman Saya</h1>
            <p>Lacak buku yang Anda pinjam</p>
        </section>
        <section class="section tabs" aria-label="Tab pinjaman">
            <button class="tab-button ${state.loanTab === 'active' ? 'active' : ''}" type="button" data-tab="active">Pinjaman Aktif (${active.length})</button>
            <button class="tab-button ${state.loanTab === 'history' ? 'active' : ''}" type="button" data-tab="history">Riwayat (${returned.length})</button>
        </section>
        <section class="section list-stack">
            ${items.length ? items.map(loan => {
                const book = state.books.find(b => b.id === loan.bookId) || { title: '-', author: '-', image: '' };
                const late = loan.status === 'late';
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
                            ${late ? '<span class="badge rejected">Anda terlambat</span>' : ''}
                        </div>
                        ${late ? `<div class="warning-box section">Total denda: <strong>${escapeHTML(loan.fine)}</strong></div>` : ''}
                        ${loan.status !== 'returned' ? `
                            <div class="actions-row">
                                <button class="button button-primary" type="button" data-action="return-book" data-loan-id="${loan.id}">Kembalikan Buku</button>
                                <button class="button button-secondary" type="button" data-action="extend-loan" data-loan-id="${loan.id}">Perpanjang</button>
                            </div>
                        ` : ''}
                    </article>
                `;
            }).join('') : renderEmptyState('Tidak ada data', 'Data pinjaman akan tampil di sini.')}
        </section>
    `;
}

export function renderAdminRequests(state) {
    const query = state.adminSearch.trim().toLowerCase();
    const filtered = state.requests.filter(req => {
        const book = state.books.find(b => b.id === req.bookId) || { title: '-', author: '-' };
        return !query || [book.title, book.author, req.borrower, req.status].join(' ').toLowerCase().includes(query);
    });
    const waiting = state.requests.filter(r => r.status === 'waiting').length;
    const approved = state.requests.filter(r => r.status === 'approved').length;
    const rejected = state.requests.filter(r => r.status === 'rejected').length;
    
    return `
        <section class="hero-panel">
            <h1>Manajemen Pengajuan</h1>
            <p>Kelola pengajuan peminjaman buku dari mahasiswa</p>
        </section>
        <section class="section metric-grid two">
            ${metricCard('Menunggu', waiting, 'clock', 'yellow')}
            ${metricCard('Disetujui', approved, 'check', 'green')}
            ${metricCard('Ditolak', rejected, 'alert', 'rose')}
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Daftar Pengajuan</h2>
                    <p>${filtered.length} pengajuan ditemukan</p>
                </div>
            </div>
            <div class="search-box" role="search">
                <span class="search-icon">${icon('search')}</span>
                <label class="sr-only" for="adminSearch">Cari pengajuan</label>
                <input class="text-input" id="adminSearch" data-input="admin-search" type="search" value="${escapeHTML(state.adminSearch)}" placeholder="Cari nama mahasiswa atau judul buku">
            </div>
            <div class="section list-stack">
                ${filtered.length ? filtered.map(req => {
                    const book = state.books.find(b => b.id === req.bookId) || { title: '-', author: '-', image: '' };
                    const canAct = req.status === 'waiting';
                    return `
                        <article class="request-card ${canAct ? 'pending' : ''}">
                            <div class="request-main">
                                ${bookCover(book, true)}
                                <div>
                                    <p class="row-title">${escapeHTML(book.title)}</p>
                                    <p class="row-subtitle">${escapeHTML(book.author)}</p>
                                    <p class="row-subtitle">Oleh: ${escapeHTML(req.borrower)} - ${escapeHTML(req.requestedAt)}</p>
                                </div>
                            </div>
                            ${statusBadge(req.status)}
                            ${canAct ? `
                                <div class="request-actions">
                                    <button class="button button-success button-small" type="button" data-action="approve-request" data-request-id="${req.id}">${icon('check')} Setujui</button>
                                    <button class="button button-danger button-small" type="button" data-action="reject-request" data-request-id="${req.id}">${icon('close')} Tolak</button>
                                </div>
                            ` : ''}
                        </article>
                    `;
                }).join('') : renderEmptyState('Tidak ada pengajuan', 'Pengajuan akan muncul saat mahasiswa mengirim permintaan.')}
            </div>
        </section>
    `;
}

export function renderAdminLoans(state) {
    const allLoans = state.loans;
    const active = allLoans.filter(l => l.status === 'active' || l.status === 'late').length;
    const late = allLoans.filter(l => l.status === 'late').length;
    const returned = allLoans.filter(l => l.status === 'returned').length;
    
    return `
        <section class="hero-panel">
            <h1>Data Peminjaman</h1>
            <p>Lihat dan kelola semua catatan peminjaman</p>
        </section>
        <section class="section metric-grid two">
            ${metricCard('Total', allLoans.length, 'loans', 'cyan')}
            ${metricCard('Aktif', active, 'chart', 'green')}
            ${metricCard('Telat', late, 'alert', 'rose')}
            ${metricCard('Dikembalikan', returned, 'check', 'purple')}
        </section>
        <section class="section table-card">
            <div class="table-header">
                <span>Buku</span>
                <span>Peminjam</span>
                <span>Status</span>
            </div>
            ${allLoans.map(loan => {
                const book = state.books.find(b => b.id === loan.bookId) || { title: '-' };
                return `
                    <div class="table-row">
                        <span><strong>${escapeHTML(book.title)}</strong> ${escapeHTML(loan.borrowedAt)}</span>
                        <span>${escapeHTML(loan.borrower)}</span>
                        <span>${loan.status === 'late' ? '<span class="badge late">Terlambat</span>' : loan.status === 'active' ? '<span class="badge active">Aktif</span>' : '<span class="badge done">Dikembalikan</span>'}</span>
                    </div>
                `;
            }).join('')}
        </section>
    `;
}

export function renderReturnBook(state) {
    const loan = state.loans.find(l => l.id === state.selectedLoanId && l.borrower === authStore.user?.name) || 
                 state.loans.find(l => l.status === 'active' || l.status === 'late') || 
                 state.loans[0];
    if (!loan) return renderEmptyState('Data tidak ditemukan', 'Kembali ke halaman pinjaman.');
    
    const book = state.books.find(b => b.id === loan.bookId) || { title: '-', author: '-' };
    
    return `
        <button class="button button-secondary" type="button" data-route="student-loans">${icon('arrowLeft')} Kembali</button>
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
                ${icon('check')} Konfirmasi Pengembalian
            </button>
        </section>
    `;
}