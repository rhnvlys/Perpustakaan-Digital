import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';
import { formatDate } from '../utils/formatter.js';

export function renderNotifications(state) {
    return `
        <section class="hero-panel">
            <h1>Notifikasi</h1>
            <p>${state.notifications.length} notifikasi${state.notifications.length ? '' : ' - belum ada notifikasi'}</p>
        </section>
        <section class="section actions-row">
            <button class="button button-secondary" type="button" data-action="mark-notifications">Tandai Semua</button>
            <button class="button button-danger" type="button" data-action="clear-notifications">Hapus Semua</button>
        </section>
        <section class="section list-stack">
            ${state.notifications.length ? state.notifications.map((notif, index) => `
                <article class="notification-row">
                    <span class="metric-icon ${notif.type === 'alert' ? 'rose' : 'cyan'}">${icon(notif.type === 'alert' ? 'bell' : 'check')}</span>
                    <div>
                        <p class="row-title">${escapeHTML(notif.message || notif.title)}</p>
                        <p class="row-subtitle">${formatDate(notif.createdAt)}</p>
                    </div>
                </article>
            `).join('') : `
                <div class="empty-state">
                    <strong>Belum ada notifikasi</strong>
                    <span>Notifikasi akan muncul di sini.</span>
                </div>
            `}
        </section>
    `;
}