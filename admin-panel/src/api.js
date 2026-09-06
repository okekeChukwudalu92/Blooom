const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

export const api = {
    login: (password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
    verifyOtp: (otp) => request('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ otp }) }),
    completeOnboarding: (payload) =>
        request('/api/auth/complete-onboarding', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    me: () => request('/api/auth/me'),

    createAdmin: (payload) => request('/api/auth/admins', { method: 'POST', body: JSON.stringify(payload) }),
    listAdmins: () => request('/api/auth/admins'),
    resetAdmin: (id) => request(`/api/auth/admins/${id}/reset`, { method: 'POST' }),

    listHouses: () => request('/api/houses'),
    createHouse: (payload) => request('/api/houses', { method: 'POST', body: JSON.stringify(payload) }),
    deleteHouse: (id) => request(`/api/houses/${id}`, { method: 'DELETE' }),

    listCredibility: () => request('/api/credibility'),
    createCredibility: (payload) => request('/api/credibility', { method: 'POST', body: JSON.stringify(payload) }),
    deleteCredibility: (id) => request(`/api/credibility/${id}`, { method: 'DELETE' }),

    listFaces: () => request('/api/faces'),
    createFace: (payload) => request('/api/faces', { method: 'POST', body: JSON.stringify(payload) }),
    deleteFace: (id) => request(`/api/faces/${id}`, { method: 'DELETE' }),

    async uploadFile(file) {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            credentials: 'include',
            body: form
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        return data.url;
    }
};
