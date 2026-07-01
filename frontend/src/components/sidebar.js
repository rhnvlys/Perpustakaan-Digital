import { icon } from '../utils/icons.js';
import { authStore } from '../state/authStore.js';

function navItems() {
    if (authStore.role === 'admin') {
        return [
            ['admin-dashboard', 'Beranda Admin', 'home'],
            ['admin-requests', 'Manajemen Pengajuan', 'request'],
            ['admin-books', 'Kelola Buku', 'catalog'],
            ['admin-loans', 'Data Peminjaman', 'loans'],
            ['admin-profile', 'Profil Admin', 'profile']
        ];
    }
    return [
        ['student-dashboard', 'Beranda', 'home'],
        ['catalog', 'Katalog Buku', 'catalog'],
        ['student-requests', 'Pengajuan Peminjaman', 'request'],
        ['student-loans', 'Pinjaman Saya', 'loans'],
        ['student-profile', 'Profil Saya', 'profile']
    ];
}

export function renderSidebar(state) {
    const user = authStore.user;
    const role = authStore.role;
    return `
        <div class="sidebar-backdrop ${state.sidebarOpen ? 'open' : ''}" data-action="close-sidebar"></div>
        <aside class="sidebar ${state.sidebarOpen ? 'open' : ''}" aria-label="Menu navigasi">
            <div class="menu-title">${role === 'admin' ? 'Menu Admin' : 'Menu Utama'}</div>
            <nav class="nav-list">
                ${navItems().map(([route, label, iconName]) => `
                    <button class="nav-link ${state.route === route ? 'active' : ''}" type="button" data-route="${route}">
                        <span class="nav-icon">${icon(iconName)}</span>
                        <span>${label}</span>
                    </button>
                `).join('')}
                <button class="nav-link" type="button" data-action="logout">
                    <span class="nav-icon">${icon('logout')}</span>
                    <span>Keluar</span>
                </button>
            </nav>
            <div class="sidebar-user">
                <span class="avatar">${user?.initials || 'U'}</span>
                <div>
                    <p class="user-name">${user?.name || 'User'}</p>
                    <p class="user-role">${role === 'admin' ? 'Administrator' : 'Mahasiswa'}</p>
                </div>
            </div>
        </aside>
    `;
}