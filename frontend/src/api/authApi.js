import { apiRequest } from './client.js';

export async function login(email, password) {
    return await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password }
    });
}

export async function register(name, email, password, nim) {
    return await apiRequest('/api/auth/register', {
        method: 'POST',
        body: { name, email, password, nim }
    });
}