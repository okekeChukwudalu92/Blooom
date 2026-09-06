import { useState } from 'react';
import { api } from '../api.js';
import ManageHouses from './ManageHouses.jsx';
import ManageCredibility from './ManageCredibility.jsx';
import ManageFaces from './ManageFaces.jsx';
import ManageAdmins from './ManageAdmins.jsx';

export default function Dashboard({ role, name, onLoggedOut }) {
    const [tab, setTab] = useState('houses');

    async function handleLogout() {
        await api.logout();
        onLoggedOut();
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <div className="dashboard-title">Blooom Admin</div>
                    <div className="muted">Logged in as {name} ({role})</div>
                </div>
                <button className="link-red" onClick={handleLogout}>Log out</button>
            </header>

            <nav className="dashboard-tabs">
                <button className={tab === 'houses' ? 'active' : ''} onClick={() => setTab('houses')}>Houses</button>
                <button className={tab === 'credibility' ? 'active' : ''} onClick={() => setTab('credibility')}>Credibility</button>
                <button className={tab === 'faces' ? 'active' : ''} onClick={() => setTab('faces')}>Faces</button>
                {role === 'god' && (
                    <button className={tab === 'admins' ? 'active' : ''} onClick={() => setTab('admins')}>Admins</button>
                )}
            </nav>

            <main>
                {tab === 'houses' && <ManageHouses />}
                {tab === 'credibility' && <ManageCredibility />}
                {tab === 'faces' && <ManageFaces />}
                {tab === 'admins' && role === 'god' && <ManageAdmins />}
            </main>
        </div>
    );
}
