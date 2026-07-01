import { icon } from './icons.js';
import { escapeHTML } from './sanitizer.js';

export { escapeHTML };

export function formatRupiah(value) {
    if (value === null || value === undefined) return 'Rp0';
    if (typeof value === 'string' && value.startsWith('Rp')) return value;
    const num = Number(value);
    if (isNaN(num)) return 'Rp0';
    return 'Rp' + num.toLocaleString('id-ID');
}

export function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function initialsFromName(name) {
    return String(name || 'User')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase() || 'U';
}

export const statusLabels = {
    active: 'Aktif',
    late: 'Terlambat',
    returned: 'Dikembalikan',
    waiting: 'Menunggu Persetujuan',
    approved: 'Disetujui',
    rejected: 'Ditolak'
};

export const statusClasses = {
    active: 'active',
    late: 'late',
    returned: 'done',
    waiting: 'waiting',
    approved: 'approved',
    rejected: 'rejected'
};

export function statusBadge(status) {
    return `<span class="badge ${statusClasses[status] || 'active'}">${statusLabels[status] || status}</span>`;
}

export function metricCard(title, value, iconName, tone, note = '') {
    return `
        <article class="metric-card ${tone}">
            <div class="metric-head">
                <p class="metric-title">${escapeHTML(title)}</p>
                <span class="metric-icon ${tone}">${icon(iconName)}</span>
            </div>
            <div>
                <p class="metric-value">${escapeHTML(value)}</p>
                ${note ? `<p class="metric-note">${escapeHTML(note)}</p>` : ''}
            </div>
        </article>
    `;
}

export function bookCover(book, tall = false) {
    const src = book.image || `https://picsum.photos/seed/${encodeURIComponent(book.id || book.title)}/360/280`;
    return `
        <div class="book-cover ${tall ? 'tall' : ''}">
            <img src="${src}" alt="Sampul buku ${escapeHTML(book.title)}" loading="eager">
        </div>
    `;
}
