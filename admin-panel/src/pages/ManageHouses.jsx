import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function ManageHouses() {
    const [houses, setHouses] = useState([]);
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function refresh() {
        api.listHouses().then(setHouses).catch((e) => setError(e.message));
    }

    useEffect(refresh, []);

    async function handleAdd(e) {
        e.preventDefault();
        setError('');
        if (!name.trim()) return setError('House name is required');
        setLoading(true);
        try {
            await api.createHouse({
                name,
                tagline,
                description,
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean)
            });
            setName('');
            setTagline('');
            setDescription('');
            setTags('');
            refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        await api.deleteHouse(id);
        refresh();
    }

    return (
        <div className="manage-section">
            <form className="manage-form" onSubmit={handleAdd}>
                <h2>Add a house</h2>
                <input placeholder="Name (e.g. BlooomLabs)" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    placeholder="Tags, comma separated (e.g. Design, Development)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                {error && <p className="auth-error">{error}</p>}
                <button className="btn-primary" disabled={loading}>{loading ? 'Adding…' : 'Add house'}</button>
            </form>

            <div className="manage-list">
                <h2>Existing houses</h2>
                {houses.length === 0 && <p className="muted">None yet.</p>}
                {houses.map((h) => (
                    <div className="manage-row" key={h.id}>
                        <div>
                            <strong>{h.name}</strong>
                            {h.tagline && <span className="muted"> — {h.tagline}</span>}
                        </div>
                        <button className="link-red" onClick={() => handleDelete(h.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
