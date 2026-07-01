import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';
import { bookCover } from '../utils/formatter.js';
import { renderEmptyState } from '../components/emptyState.js';
import { categories } from '../state/appState.js';

export function renderAdminBooks(state) {
    const query = state.adminSearch.trim().toLowerCase();
    const filtered = state.books.filter(book => {
        return !query || [book.title, book.author, book.isbn, book.category].join(' ').toLowerCase().includes(query);
    });
    const editing = state.editingBookId ? state.books.find(b => b.id === state.editingBookId) : null;
    
    return `
        <section class="hero-panel">
            <h1>Kelola Buku</h1>
            <p>${state.books.length} buku dalam katalog</p>
        </section>
        <section class="section admin-toolbar">
            <button class="button button-primary" type="button" data-action="toggle-book-form">${icon('plus')} ${editing ? 'Edit Buku' : 'Tambah'}</button>
            <button class="button button-secondary" type="button" data-action="reset-book-form">Reset</button>
        </section>
        ${state.bookFormOpen ? renderBookForm(state, editing) : ''}
        <section class="search-box" role="search">
            <span class="search-icon">${icon('search')}</span>
            <label class="sr-only" for="adminSearch">Cari buku admin</label>
            <input class="text-input" id="adminSearch" data-input="admin-search" type="search" value="${escapeHTML(state.adminSearch)}" placeholder="Cari judul, penulis, atau ISBN">
        </section>
        <div class="result-note">Menampilkan ${filtered.length} dari ${state.books.length} buku</div>
        <section class="book-list">
            ${filtered.map(book => `
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
                        <button class="button button-secondary button-small" type="button" data-action="edit-book" data-book-id="${book.id}">${icon('edit')} Edit</button>
                        <button class="button button-danger button-small" type="button" data-action="delete-book" data-book-id="${book.id}">${icon('trash')} Hapus</button>
                    </div>
                </article>
            `).join('')}
        </section>
    `;
}

function renderBookForm(state, editing) {
    return `
        <form class="inline-form section" data-form="book">
            <div class="form-grid">
                <div class="field full-span">
                    <label for="bookTitle">Judul</label>
                    <input class="text-input" id="bookTitle" name="title" type="text" value="${editing ? escapeHTML(editing.title) : ''}" required>
                </div>
                <div class="field">
                    <label for="bookAuthor">Penulis</label>
                    <input class="text-input" id="bookAuthor" name="author" type="text" value="${editing ? escapeHTML(editing.author) : ''}" required>
                </div>
                <div class="field">
                    <label for="bookCategory">Kategori</label>
                    <select class="select-input" id="bookCategory" name="category">
                        ${categories.filter(c => c !== 'Semua').map(category => `
                            <option value="${category}" ${editing && editing.category === category ? 'selected' : ''}>${category}</option>
                        `).join('')}
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
            <button class="button button-primary button-wide" type="submit">${editing ? 'Simpan Perubahan' : 'Tambah Buku'}</button>
        </form>
    `;
}