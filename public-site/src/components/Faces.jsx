import { useEffect, useRef, useState, useCallback } from 'react';
import FaceCard from './FaceCard.jsx';

const AUTO_ADVANCE_MS = 8000; // 7-10s range
const FADE_MS = 250;

export default function Faces({ faces }) {
    const [index, setIndex] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const timerRef = useRef(null);
    const fadeTimeoutRef = useRef(null);

    const goTo = useCallback((newIndex) => {
        setFadeOut(true);
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = setTimeout(() => {
            setIndex(newIndex);
            setFadeOut(false);
        }, FADE_MS);
    }, []);

    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        if (faces.length <= 1) return;
        timerRef.current = setInterval(() => {
            setIndex((current) => {
                const next = (current + 1) % faces.length;
                setFadeOut(true);
                clearTimeout(fadeTimeoutRef.current);
                fadeTimeoutRef.current = setTimeout(() => setFadeOut(false), FADE_MS);
                return next;
            });
        }, AUTO_ADVANCE_MS);
    }, [faces.length]);

    useEffect(() => {
        startTimer();
        return () => {
            clearInterval(timerRef.current);
            clearTimeout(fadeTimeoutRef.current);
        };
    }, [startTimer]);

    function handleManual(newIndex) {
        goTo(newIndex);
        startTimer(); // manual interaction resets the auto-advance clock
    }

    function prev() {
        handleManual((index - 1 + faces.length) % faces.length);
    }

    function next() {
        handleManual((index + 1) % faces.length);
    }

    if (faces.length === 0) {
        return (
            <section id="faces">
                <div className="wrap">
                    <div className="eyebrow">Behind the name</div>
                    <h2>The people building it.</h2>
                    <p className="muted">No team members added yet.</p>
                </div>
            </section>
        );
    }

    const current = faces[index];

    return (
        <section id="faces">
            <div className="wrap">
                <div className="eyebrow">Behind the name</div>
                <h2>The people building it.</h2>

                <div className="faces-carousel">
                    {faces.length > 1 && (
                        <button className="face-arrow prev" aria-label="Previous person" onClick={prev}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}

                    <FaceCard face={current} fadeOut={fadeOut} />

                    {faces.length > 1 && (
                        <button className="face-arrow next" aria-label="Next person" onClick={next}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>

                {faces.length > 1 && (
                    <div className="face-dots">
                        {faces.map((face, i) => (
                            <button
                                key={face.id}
                                className={`face-dot${i === index ? ' active' : ''}`}
                                aria-label={`Go to person ${i + 1}`}
                                onClick={() => handleManual(i)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
