import { apiRequest } from './client.js';

export async function getBooks(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.available !== undefined) searchParams.append('available', params.available);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    const query = searchParams.toString();
    return await apiRequest(query ? `/api/books?${query}` : '/api/books');
}

export async function getBook(id) {
    return await apiRequest(`/api/books/${id}`);
}

export async function getCategories() {
    return await apiRequest('/api/categories');
}

export async function createBook(data) {
    return await apiRequest('/api/books', {
        method: 'POST',
        body: data
    });
}

export async function updateBook(id, data) {
    return await apiRequest(`/api/books/${id}`, {
        method: 'PUT',
        body: data
    });
}

export async function deleteBook(id) {
    return await apiRequest(`/api/books/${id}`, {
        method: 'DELETE'
    });
}