import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function ManageAdmins() {
    const [admins, setAdmins] = useState([]);
    const [name, setName] = useState('');
    const [question1, setQuestion1] = useState('');
    const [answer1, setAnswer1] = useState('');
    const [question2, setQuestion2] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [issuedOtp, setIssuedOtp] = useState(null); // { name, otp, expiresAt }

    function refresh() {
        api.listAdmins().then(setAdmins).catch((e) => setError(e.message));
    }

    useEffect(refresh, []);

    async function handleCreate(e) {
        e.preventDefault();
        setError('');
        if (!name || !question1 || !answer1 || !question2 || !answer2) {
            return setError('All fields are required');
        }
        setLoading(true);
        try {
            const { otp, expiresAt } = await api.createAdmin({ name, question1, answer1, question2, answer2 });
            setIssuedOtp({ name, otp, expiresAt });
            setName('');
            setQuestion1('');
            setAnswer1('');
            setQuestion2('');
            setAnswer2('');
            refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleReset(id) {
        try {
            const data = await api.resetAdmin(id);
            setIssuedOtp(data);
            refresh();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="manage-section">
            <form className="manage-form" onSubmit={handleCreate}>
                <h2>Invite a new admin</h2>
                <input placeholder="Their name" value={name} onChange={(e) => setName(e.target.value)} />
                <input
                    placeholder="Security question 1"
                    value={question1}
                    onChange={(e) => setQuestion1(e.target.value)}
                />
                <input
                    placeholder="Expected answer 1"
                    value={answer1}
                    onChange={(e) => setAnswer1(e.target.value)}
                />
                <input
                    placeholder="Security question 2"
                    value={question2}
                    onChange={(e) => setQuestion2(e.target.value)}
                />
                <input
                    placeholder="Expected answer 2"
                    value={answer2}
                    onChange={(e) => setAnswer2(e.target.value)}
                />
                {error && <p className="auth-error">{error}</p>}
                <button className="btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create invite'}</button>
            </form>

            {issuedOtp && (
                <div className="otp-banner">
                    <strong>OTP for {issuedOtp.name}:</strong> <code>{issuedOtp.otp}</code>
                    <div className="muted">
                        Send this to them yourself (DM, text, whichever). It expires at{' '}
                        {new Date(issuedOtp.expiresAt).toLocaleString()} and only works once.
                    </div>
                </div>
            )}

            <div className="manage-list">
                <h2>Existing admins</h2>
                {admins.map((a) => (
                    <div className="manage-row" key={a.id}>
                        <div>
                            <strong>{a.name}</strong>{' '}
                            <span className="muted">
                                — {a.role} · {a.onboarded ? 'active' : 'awaiting onboarding'}
                            </span>
                        </div>
                        {a.role !== 'god' && (
                            <button className="link-red" onClick={() => handleReset(a.id)}>
                                Reset access
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
