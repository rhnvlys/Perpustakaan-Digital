import { apiRequest } from './client.js';

export async function getNotifications() {
    return await apiRequest('/api/notifications');
}