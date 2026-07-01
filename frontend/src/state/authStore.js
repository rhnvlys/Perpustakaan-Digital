export const authStore = {
    user: null,
    token: null,
    role: null,
    get isLoggedIn() { return !!this.token; }
};

export function setAuth(user, token) {
    authStore.user = user;
    authStore.token = token;
    authStore.role = user?.role || null;
    try {
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_token', token);
    } catch {}
}

export function clearAuth() {
    authStore.user = null;
    authStore.token = null;
    authStore.role = null;
    try {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
    } catch {}
}

export function loadAuth() {
    try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('auth_user');
        if (token && userData) {
            const user = JSON.parse(userData);
            authStore.user = user;
            authStore.token = token;
            authStore.role = user?.role || null;
            return true;
        }
    } catch {
        clearAuth();
    }
    return false;
}
