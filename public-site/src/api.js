const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getHouses() {
    const res = await fetch(`${API_URL}/api/houses`);
    if (!res.ok) throw new Error('Failed to load houses');
    return res.json();
}

export async function getCredibility() {
    const res = await fetch(`${API_URL}/api/credibility`);
    if (!res.ok) throw new Error('Failed to load credibility entries');
    return res.json();
}

export async function getFaces() {
    const res = await fetch(`${API_URL}/api/faces`);
    if (!res.ok) throw new Error('Failed to load faces');
    return res.json();
}
