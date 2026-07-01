import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';
import { bookCover } from '../utils/formatter.js';
import { renderEmptyState } from '../components/emptyState.js';
import { categories } from '../state/appState.js';

export function renderCatalog(state) {
    const query = state.search.trim().toLowerCase();
    const filtered = state.books.filter(book => {
        const matchCategory = state.category === 'Semua' || book.category === state.category;
        const matchQuery = !query || [book.title, book.author, book.isbn, book.category].join(' ').toLowerCase().includes(query);
        return matchCategory && matchQuery;
    });
    
    return `
        <section class="hero-panel">
            <h1>Katalog Buku</h1>
            <p>Jelajahi dan cari koleksi perpustakaan kami</p>
        </section>
        <section class="search-box" role="search">
            <span class="search-icon">${icon('search')}</span>
            <label class="sr-only" for="catalogSearch">Cari buku</label>
            <input class="text-input" id="catalogSearch" data-input="catalog-search" type="search" value="${escapeHTML(state.search)}" placeholder="Cari berdasarkan judul, penulis, atau ISBN">
        </section>
        <div class="chip-row" aria-label="Filter kategori">
            ${categories.map(category => `
                <button class="chip ${state.category === category ? 'active' : ''}" type="button" data-category="${category}">
                    ${category}
                </button>
            `).join('')}
        </div>
        <div class="result-note">Menampilkan ${filtered.length} buku</div>
        <section class="book-grid" aria-label="Daftar buku">
            ${filtered.length ? filtered.map(renderBookCard).join('') : renderEmptyState('Buku tidak ditemukan', 'Coba kata kunci atau kategori lain.')}
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
                ${icon('send')}
                Ajukan Peminjaman
            </button>
        </article>
    `;
}

export function renderBookDetail(state) {
    const book = state.books.find(b => b.id === state.selectedBookId);
    if (!book) return renderEmptyState('Buku tidak ditemukan', 'Kembali ke katalog.');
    
    return `
        <button class="button button-secondary" type="button" data-route="catalog">${icon('arrowLeft')} Kembali ke Katalog</button>
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
                    <p>${escapeHTML(book.description || '')}</p>
                </div>
            </div>
            <div class="detail-grid">
                <div class="detail-row"><span>ISBN</span><strong>${escapeHTML(book.isbn || '-')}</strong></div>
                <div class="detail-row"><span>Penerbit</span><strong>${escapeHTML(book.publisher || '-')}</strong></div>
                <div class="detail-row"><span>Tahun Terbit</span><strong>${escapeHTML(book.year || '-')}</strong></div>
                <div class="detail-row"><span>Total Eksemplar</span><strong>${book.total}</strong></div>
                <div class="detail-row"><span>Ketersediaan</span><strong>${book.available} dari ${book.total} eksemplar tersedia</strong></div>
            </div>
        </section>
        <section class="section">
            <button class="button button-primary button-wide" type="button" data-action="request-loan" ${book.available === 0 ? 'disabled' : ''}>
                ${icon('send')} Ajukan Peminjaman
            </button>
        </section>
    `;
}