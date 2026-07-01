import { authStore } from '../state/authStore.js';
import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';
import { metricCard, bookCover } from '../utils/formatter.js';
import { renderEmptyState } from '../components/emptyState.js';

export function renderStudentDashboard(state) {
    const active = state.loans.filter(l => l.status === 'active' || l.status === 'late');
    const late = active.filter(l => l.status === 'late');
    const returned = state.loans.filter(l => l.status === 'returned');
    const latest = state.books.slice(0, 4);
    
    return `
        <section class="hero-panel">
            <h1>Selamat Datang, ${escapeHTML(authStore.user?.name || 'Mahasiswa')}!</h1>
            <p>Berikut adalah ringkasan perpustakaan Anda</p>
        </section>
        <section class="section metric-grid">
            ${metricCard('Pinjaman Aktif', active.length, 'book', 'cyan')}
            ${metricCard('Buku Terlambat', late.length, 'alert', 'rose')}
            ${metricCard('Buku Dibaca', returned.length, 'check', 'green')}
            ${metricCard('Buku Tersedia', state.books.reduce((sum, b) => sum + b.available, 0), 'file', 'purple')}
        </section>
        <section class="section panel-card">
            <div class="section-heading">
                <div>
                    <h2>Pinjaman Saat Ini</h2>
                    <p>Buku yang sedang Anda pinjam</p>
                </div>
            </div>
            <div class="list-stack">
                ${active.length ? active.map(loan => {
                    const book = state.books.find(b => b.id === loan.bookId) || { title: '-', author: '-' };
                    return `
                        <article class="loan-row">
                            <div>
                                <p class="row-title">${escapeHTML(book.title)}</p>
                                <p class="row-subtitle">Jatuh tempo: ${escapeHTML(loan.dueAt)}</p>
                            </div>
                            ${loan.status === 'late' ? '<span class="badge late">Terlambat</span>' : '<span class="badge active">Aktif</span>'}
                        </article>
                    `;
                }).join('') : renderEmptyState('Tidak ada pinjaman aktif', 'Ajukan peminjaman dari katalog buku.')}
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
                ${latest.map(book => `
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