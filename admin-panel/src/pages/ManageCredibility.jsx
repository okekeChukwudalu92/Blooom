import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function ManageCredibility() {
    const [entries, setEntries] = useState([]);
    const [personName, setPersonName] = useState('');
    const [company, setCompany] = useState('');
    const [service, setService] = useState('');
    const [remarkText, setRemarkText] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [remarkImageFile, setRemarkImageFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function refresh() {
        api.listCredibility().then(setEntries).catch((e) => setError(e.message));
    }

    useEffect(refresh, []);

    async function handleAdd(e) {
        e.preventDefault();
        setError('');
        if (!personName.trim()) return setError('Person name is required');
        setLoading(true);
        try {
            const photo_url = photoFile ? await api.uploadFile(photoFile) : null;
            const remark_image_url = remarkImageFile ? await api.uploadFile(remarkImageFile) : null;

            await api.createCredibility({
                person_name: personName,
                company,
                service_rendered: service,
                remark_text: remarkText || null,
                remark_image_url,
                photo_url
            });

            setPersonName('');
            setCompany('');
            setService('');
            setRemarkText('');
            setPhotoFile(null);
            setRemarkImageFile(null);
            refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        await api.deleteCredibility(id);
        refresh();
    }

    return (
        <div className="manage-section">
            <form className="manage-form" onSubmit={handleAdd}>
                <h2>Add a testimonial</h2>
                <input placeholder="Person's name" value={personName} onChange={(e) => setPersonName(e.target.value)} />
                <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                <input placeholder="Service rendered" value={service} onChange={(e) => setService(e.target.value)} />

                <label className="field-label">Person's photo</label>
                <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />

                <label className="field-label">Remark — text</label>
                <textarea
                    placeholder='e.g. "Nice job on the campaign"'
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                />

                <label className="field-label">Or remark — screenshot/image (used instead of text if provided)</label>
                <input type="file" accept="image/*" onChange={(e) => setRemarkImageFile(e.target.files[0])} />

                {error && <p className="auth-error">{error}</p>}
                <button className="btn-primary" disabled={loading}>{loading ? 'Adding…' : 'Add testimonial'}</button>
            </form>

            <div className="manage-list">
                <h2>Existing testimonials</h2>
                {entries.length === 0 && <p className="muted">None yet.</p>}
                {entries.map((c) => (
                    <div className="manage-row" key={c.id}>
                        <div>
                            <strong>{c.person_name}</strong>
                            <span className="muted"> — {c.company} {c.service_rendered}</span>
                        </div>
                        <button className="link-red" onClick={() => handleDelete(c.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
