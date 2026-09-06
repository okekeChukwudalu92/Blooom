import { useState } from 'react';
import { api } from '../api.js';

export default function Login({ onLoggedIn, onOtpVerified }) {
    const [mode, setMode] = useState('password'); // 'password' | 'otp'
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'password') {
                const { role, name } = await api.login(value);
                onLoggedIn(role, name);
            } else {
                const data = await api.verifyOtp(value);
                onOtpVerified(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-screen">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Blooom Admin</h1>
                <input
                    type={mode === 'password' ? 'password' : 'text'}
                    placeholder={mode === 'password' ? 'Password' : 'Enter OTP'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoFocus
                />

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Please wait…' : mode === 'password' ? 'Log in' : 'Verify OTP'}
                </button>

                {mode === 'password' ? (
                    <button
                        type="button"
                        className="link-red"
                        onClick={() => {
                            setMode('otp');
                            setValue('');
                            setError('');
                        }}
                    >
                        Verify OTP
                    </button>
                ) : (
                    <button
                        type="button"
                        className="link-muted"
                        onClick={() => {
                            setMode('password');
                            setValue('');
                            setError('');
                        }}
                    >
                        Back to password login
                    </button>
                )}
            </form>
        </div>
    );
}
