import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function ManageFaces() {
    const [faces, setFaces] = useState([]);
    const [houses, setHouses] = useState([]);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [houseId, setHouseId] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function refresh() {
        api.listFaces().then(setFaces).catch((e) => setError(e.message));
        api.listHouses().then(setHouses).catch(() => { });
    }

    useEffect(refresh, []);

    async function handleAdd(e) {
        e.preventDefault();
        setError('');
        if (!name.trim()) return setError('Name is required');
        setLoading(true);
        try {
            const photo_url = photoFile ? await api.uploadFile(photoFile) : null;
            await api.createFace({ name, role, house_id: houseId || null, photo_url });
            setName('');
            setRole('');
            setHouseId('');
            setPhotoFile(null);
            refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        await api.deleteFace(id);
        refresh();
    }

    return (
        <div className="manage-section">
            <form className="manage-form" onSubmit={handleAdd}>
                <h2>Add a team member</h2>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="Role / title" value={role} onChange={(e) => setRole(e.target.value)} />

                <label className="field-label">House</label>
                <select value={houseId} onChange={(e) => setHouseId(e.target.value)}>
                    <option value="">— none —</option>
                    {houses.map((h) => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                </select>

                <label className="field-label">Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />

                {error && <p className="auth-error">{error}</p>}
                <button className="btn-primary" disabled={loading}>{loading ? 'Adding…' : 'Add team member'}</button>
            </form>

            <div className="manage-list">
                <h2>Existing team members</h2>
                {faces.length === 0 && <p className="muted">None yet.</p>}
                {faces.map((f) => (
                    <div className="manage-row" key={f.id}>
                        <div>
                            <strong>{f.name}</strong>
                            <span className="muted"> — {f.role} {f.house_name ? `(${f.house_name})` : ''}</span>
                        </div>
                        <button className="link-red" onClick={() => handleDelete(f.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
