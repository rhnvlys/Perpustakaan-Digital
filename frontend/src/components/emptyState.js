import { escapeHTML } from '../utils/sanitizer.js';

export function renderEmptyState(title, text) {
    return `
        <div class="empty-state">
            <strong>${escapeHTML(title)}</strong>
            <span>${escapeHTML(text)}</span>
        </div>
    `;
}