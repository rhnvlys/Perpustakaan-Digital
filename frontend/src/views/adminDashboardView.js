import { authStore } from '../state/authStore.js';
import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';
import { metricCard, bookCover } from '../utils/formatter.js';

export function renderAdminDashboard(state) {
    const waiting = state.requests.filter(r => r.status === 'waiting').length;
    const active = state.loans.filter(l => l.status === 'active' || l.status === 'late').length;
    const late = state.loans.filter(l => l.status === 'late').length;
    const returned = state.loans.filter(l => l.status === 'returned').length;
    const available = state.books.reduce((sum, b) => sum + b.available, 0);
    const totalBooks = state.books.reduce((sum, b) => sum + b.total, 0);
    
    return `
        <section class="hero-panel with-action">
            <div>
                <h1>Beranda Admin</h1>
                <p>Ringkasan manajemen perpustakaan</p>
            </div>
            <button class="button button-secondary" type="button" data-action="send-notification">${icon('send')} Kirim Notifikasi</button>
        </section>
        <section class="section metric-grid three">
            ${metricCard('Total Buku', totalBooks, 'book', 'cyan', `${state.books.length} judul unik`)}
            ${metricCard('Pengajuan Menunggu', waiting, 'clock', 'yellow', 'Perlu ditindaklanjuti')}
            ${metricCard('Peminjaman Aktif', active, 'chart', 'green', 'Buku dipinjam')}
            ${metricCard('Buku Tersedia', available, 'file', 'purple', 'Siap dipinjam')}
            ${metricCard('Pinjaman Terlambat', late, 'alert', 'rose', 'Perlu perhatian')}
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Buku Populer</h2>
                    <p>Koleksi dengan peminjaman aktif</p>
                </div>
            </div>
            <div class="book-list">
                ${state.books.slice(0, 4).map(book => `
                    <article class="compact-row">
                        ${bookCover(book, true)}
                        <div>
                            <p class="row-title">${escapeHTML(book.title)}</p>
                            <p class="row-subtitle">${escapeHTML(book.author)} - ${escapeHTML(book.category)}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    `;
}