import { useState } from 'react';
import { api } from '../api.js';

export default function SecurityQuestions({ onboarding, onDone }) {
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (newPassword.length < 8) {
            setError('Password should be at least 8 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { role, name } = await api.completeOnboarding({
                onboardingToken: onboarding.onboardingToken,
                answer1,
                answer2,
                newPassword
            });
            onDone(role, name);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-screen">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Welcome, {onboarding.name}</h1>
                <p className="auth-subtext">Answer your security questions, then set a permanent password.</p>

                <label className="field-label">Question 1: {onboarding.question1}</label>
                <input
                    type="text"
                    placeholder="Your answer"
                    value={answer1}
                    onChange={(e) => setAnswer1(e.target.value)}
                />

                <label className="field-label">Question 2: {onboarding.question2}</label>
                <input
                    type="text"
                    placeholder="Your answer"
                    value={answer2}
                    onChange={(e) => setAnswer2(e.target.value)}
                />

                <label className="field-label">New password</label>
                <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <label className="field-label">Confirm password</label>
                <input
                    type="password"
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Please wait…' : 'Set password and log in'}
                </button>
            </form>
        </div>
    );
}
