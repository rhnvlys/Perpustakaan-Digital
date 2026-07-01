const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

let authToken = null;

export function setAuthToken(token) { authToken = token; }
export function clearAuthToken() { authToken = null; }

export async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
        if (response.status === 401 && !window.location.hash.startsWith('#login')) {
            clearAuthToken();
            window.location.hash = '#login';
        }
        throw new Error(payload.message || 'Request failed');
    }
    return payload.data;
}
