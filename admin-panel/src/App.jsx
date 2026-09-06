import { useEffect, useState } from 'react';
import { api } from './api.js';
import Login from './pages/Login.jsx';
import SecurityQuestions from './pages/SecurityQuestions.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
    const [checking, setChecking] = useState(true);
    const [session, setSession] = useState(null); // { role, name }
    const [onboarding, setOnboarding] = useState(null); // set after OTP verified

    useEffect(() => {
        api.me()
            .then((data) => setSession(data))
            .catch(() => { })
            .finally(() => setChecking(false));
    }, []);

    if (checking) return null;

    if (session) {
        return (
            <Dashboard
                role={session.role}
                name={session.name}
                onLoggedOut={() => setSession(null)}
            />
        );
    }

    if (onboarding) {
        return (
            <SecurityQuestions
                onboarding={onboarding}
                onDone={(role, name) => {
                    setOnboarding(null);
                    setSession({ role, name });
                }}
            />
        );
    }

    return (
        <Login
            onLoggedIn={(role, name) => setSession({ role, name })}
            onOtpVerified={(data) => setOnboarding(data)}
        />
    );
}
