import { useEffect, useState } from 'react';
import { getHouses, getCredibility, getFaces } from './api.js';
import SpaceBackground from './components/SpaceBackground.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Supporting from './components/Supporting.jsx';
import Story from './components/Story.jsx';
import Houses from './components/Houses.jsx';
import Credibility from './components/Credibility.jsx';
import Contact from './components/Contact.jsx';
import Faces from './components/Faces.jsx';
import Footer from './components/Footer.jsx';

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
        <>
            <SpaceBackground />
            <div className="page-content">
                <Header />
                <Hero />
                <Supporting />
                {error && <p className="error-note">Couldn't reach the API: {error}</p>}
                <Story />
                <Houses houses={houses} />
                <Credibility entries={credibility} />
                <Contact />
                <Faces faces={faces} />
                <Footer />
            </div>
        </>
    );
}
