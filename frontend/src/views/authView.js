import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';

export function renderAuth(authMode) {
    const isRegister = authMode === 'register';
    return `
        <main class="auth-screen" id="mainContent">
            <section class="auth-card" aria-labelledby="authTitle">
                <div class="auth-header">
                    <span class="brand-orb">${icon('book')}</span>
                    <h1 class="auth-title" id="authTitle">${isRegister ? 'Daftar Akun Baru' : 'Perpustakaan Digital'}</h1>
                    <p class="auth-subtitle">${isRegister ? 'Buat akun perpustakaan digital Anda' : 'Masuk ke akun Anda'}</p>
                </div>
                <div class="auth-body">
                    ${isRegister ? renderRegisterForm() : renderLoginForm()}
                </div>
            </section>
        </main>
    `;
}

export function renderLoginForm() {
    return `
        <form class="form-stack" data-form="login">
            <div class="field">
                <label for="loginEmail">Email</label>
                <input class="text-input" id="loginEmail" name="email" type="email" placeholder="email@anda.com" autocomplete="email">
            </div>
            <div class="field">
                <label for="loginPassword">Kata Sandi</label>
                <div class="input-wrap has-icon">
                    <input class="text-input" id="loginPassword" name="password" type="password" placeholder="Masukkan kata sandi" autocomplete="current-password">
                    <span class="field-icon">${icon('eyeOff')}</span>
                </div>
            </div>
            <button class="button button-primary button-wide" type="submit">Masuk</button>
        </form>
        <p class="auth-switch">Tidak punya akun? <button class="link-button" type="button" data-auth-mode="register">Daftar di sini</button></p>
        <div class="demo-box">
            <p>Akun Demo:</p>
            <div><strong>Siswa:</strong> siswa@perpustakaan.com / siswa123</div>
            <div><strong>Admin:</strong> admin@perpustakaan.com / admin123</div>
        </div>
    `;
}

export function renderRegisterForm() {
    return `
        <form class="form-stack" data-form="register">
            <div class="field">
                <label for="registerName">Nama Lengkap</label>
                <input class="text-input" id="registerName" name="name" type="text" placeholder="Masukkan nama lengkap" required>
            </div>
            <div class="field">
                <label for="registerNim">NIM / ID Siswa</label>
                <input class="text-input" id="registerNim" name="nim" type="text" placeholder="Contoh: 2024001234" required>
            </div>
            <div class="field">
                <label for="registerEmail">Email</label>
                <input class="text-input" id="registerEmail" name="email" type="email" placeholder="email@anda.com" required>
            </div>
            <div class="field">
                <label for="registerPassword">Kata Sandi</label>
                <input class="text-input" id="registerPassword" name="password" type="password" placeholder="Minimal 6 karakter" required minlength="6">
            </div>
            <button class="button button-primary button-wide" type="submit">Daftar Sekarang</button>
        </form>
        <p class="auth-switch">Sudah punya akun? <button class="link-button" type="button" data-auth-mode="login">Masuk di sini</button></p>
    `;
}