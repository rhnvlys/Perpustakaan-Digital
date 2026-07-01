import { icon } from '../utils/icons.js';
import { authStore } from '../state/authStore.js';

export function renderTopbar(state) {
    const role = authStore.role;
    return `
        <header class="topbar">
            <div class="topbar-left">
                <button class="icon-btn" type="button" data-action="toggle-sidebar" aria-label="${state.sidebarOpen ? 'Tutup menu' : 'Buka menu'}">
                    ${state.sidebarOpen ? icon('close') : icon('menu')}
                </button>
                <span class="topbar-brand" aria-label="Perpustakaan Digital">${icon('book')}</span>
            </div>
            <div class="topbar-right">
                <button class="icon-btn" type="button" data-route="notifications" aria-label="Buka notifikasi">
                    ${icon('bell')}
                    <span class="notification-dot">${state.notifications.length}</span>
                </button>
                <button class="icon-btn" type="button" data-route="${role === 'admin' ? 'admin-profile' : 'student-profile'}" aria-label="Buka profil">
                    ${icon('user')}
                </button>
            </div>
        </header>
    `;
}