import { apiRequest } from './client.js';

export async function getLoans(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    const query = searchParams.toString();
    return await apiRequest(query ? `/api/loans?${query}` : '/api/loans');
}

export async function getLoan(id) {
    return await apiRequest(`/api/loans/${id}`);
}

export async function requestLoan(bookId) {
    return await apiRequest('/api/loans', {
        method: 'POST',
        body: { bookId }
    });
}

export async function approveLoan(id) {
    return await apiRequest(`/api/loans/${id}/approve`, {
        method: 'PATCH'
    });
}

export async function rejectLoan(id) {
    return await apiRequest(`/api/loans/${id}/reject`, {
        method: 'PATCH'
    });
}

export async function returnLoan(id) {
    return await apiRequest(`/api/loans/${id}/return`, {
        method: 'PATCH'
    });
}

export async function extendLoan(id) {
    return await apiRequest(`/api/loans/${id}/extend`, {
        method: 'PATCH'
    });
}