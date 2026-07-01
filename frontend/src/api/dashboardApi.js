import { apiRequest } from './client.js';

export async function getDashboard() {
    return await apiRequest('/api/dashboard');
}