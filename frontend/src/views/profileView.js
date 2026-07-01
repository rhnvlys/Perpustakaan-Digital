import { authStore } from '../state/authStore.js';
import { escapeHTML } from '../utils/sanitizer.js';
import { initialsFromName } from '../utils/formatter.js';

export function renderStudentProfile(state) {
    const user = authStore.user || {};
    const returned = state.loans.filter(l => l.status === 'returned').length;
    const total = state.loans.filter(l => l.borrower === user.name).length;
    const initials = user.initials || initialsFromName(user.name);
    
    return renderProfileCard('Profil Saya', 'Kelola informasi akun Anda', [
        ['Nama Lengkap', user.name],
        ['Email', user.email],
        ['Status Akun', user.role === 'admin' ? 'Administrator' : 'Mahasiswa'],
        ['Anggota Sejak', user.memberSince || '-'],
        ['Buku Selesai', returned],
        ['Total Pinjaman', total]
    ], initials, user.name, user.role === 'admin' ? 'Administrator' : 'Mahasiswa');
}

export function renderAdminProfile(state) {
    const user = authStore.user || {};
    const waiting = state.requests.filter(r => r.status === 'waiting').length;
    const initials = user.initials || initialsFromName(user.name);
    
    return renderProfileCard('Profil Admin', 'Kelola informasi akun administrator', [
        ['Nama Lengkap', user.name],
        ['Email', user.email],
        ['Status Akun', 'Administrator'],
        ['Bertugas Sejak', user.memberSince || '-'],
        ['Pengajuan Menunggu', waiting],
        ['Total Buku', state.books.length]
    ], initials, user.name, 'Administrator');
}

function renderProfileCard(title, subtitle, facts, initials, name, roleLabel) {
    return `
        <section class="hero-panel">
            <h1>${escapeHTML(title)}</h1>
            <p>${escapeHTML(subtitle)}</p>
        </section>
        <section class="section profile-card">
            <div class="profile-head">
                <span class="avatar large">${escapeHTML(initials)}</span>
                <div>
                    <p class="row-title">${escapeHTML(name)}</p>
                    <p class="row-subtitle">${escapeHTML(roleLabel)}</p>
                </div>
            </div>
            <div class="profile-facts">
                ${facts.map(([label, value]) => `
                    <div class="fact-row">
                        <span>${escapeHTML(label)}</span>
                        <strong>${escapeHTML(value)}</strong>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}