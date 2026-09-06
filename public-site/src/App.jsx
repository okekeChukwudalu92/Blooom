import { useEffect, useState } from 'react';
import { getHouses, getCredibility, getFaces } from './api.js';
import HouseCard from './components/HouseCard.jsx';
import CredibilityCarousel from './components/CredibilityCarousel.jsx';
import FaceCard from './components/FaceCard.jsx';

export default function App() {
    const [houses, setHouses] = useState([]);
    const [credibility, setCredibility] = useState([]);
    const [faces, setFaces] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([getHouses(), getCredibility(), getFaces()])
            .then(([h, c, f]) => {
                setHouses(h);
                setCredibility(c);
                setFaces(f);
            })
            .catch((err) => setError(err.message));
    }, []);

    return (
        <div className="page">
            <header>
                <div className="logo">Blooom</div>
                <nav>
                    <a href="#houses">Houses</a>
                    <a href="#credibility">Credibility</a>
                    <a href="#faces">Faces</a>
                </nav>
            </header>

            <section className="hero">
                <h1>One name, two crafts.</h1>
                <p>The reach to get noticed, and the craft to build what's worth noticing.</p>
            </section>

            {error && <p className="error-note">Couldn't reach the API: {error}</p>}

            <section id="houses">
                <div className="eyebrow">Two houses, one name</div>
                <h2>The reach and the build.</h2>
                <div className="houses-grid">
                    {houses.map((house) => (
                        <HouseCard key={house.id} house={house} />
                    ))}
                    {houses.length === 0 && !error && <p className="muted">No houses added yet.</p>}
                </div>
            </section>

            <section id="credibility">
                <div className="eyebrow">Proof, not promises</div>
                <h2>What people say after working with us.</h2>
                <CredibilityCarousel entries={credibility} />
                {credibility.length === 0 && !error && <p className="muted">No testimonials added yet.</p>}
            </section>

            <section id="faces">
                <div className="eyebrow">Behind the name</div>
                <h2>The people building it.</h2>
                <div className="faces-grid">
                    {faces.map((face) => (
                        <FaceCard key={face.id} face={face} />
                    ))}
                    {faces.length === 0 && !error && <p className="muted">No team members added yet.</p>}
                </div>
            </section>

            <footer>© 2026 Blooom — home of BlooomLabs &amp; BlooomOnline</footer>
        </div>
    );
}
