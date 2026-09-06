import { useRef, useState, useEffect, useCallback } from 'react';

function initialsOf(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('');
}

export default function CredibilityCarousel({ entries }) {
    const trackRef = useRef(null);
    const cardRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const updateActive = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        let closest = 0;
        let closestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
            if (!card) return;
            const dist = Math.abs(card.offsetLeft - track.scrollLeft);
            if (dist < closestDist) {
                closestDist = dist;
                closest = i;
            }
        });
        setActiveIndex(closest);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                updateActive();
                ticking = false;
            });
        };
        track.addEventListener('scroll', onScroll, { passive: true });
        return () => track.removeEventListener('scroll', onScroll);
    }, [updateActive]);

    const goTo = (i) => {
        cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    };

    if (!entries.length) return null;

    return (
        <div>
            <div className="cred-carousel" ref={trackRef}>
                <div className="cred-track">
                    {entries.map((entry, i) => (
                        <div
                            className="cred-card"
                            key={entry.id}
                            ref={(el) => (cardRefs.current[i] = el)}
                        >
                            <div className="cred-photo">
                                {entry.photo_url ? (
                                    <img src={entry.photo_url} alt={entry.person_name} />
                                ) : (
                                    <div className="initials">{initialsOf(entry.person_name)}</div>
                                )}
                            </div>
                            <div className="cred-body">
                                <div className="cred-name">{entry.person_name}</div>
                                <div className="cred-meta">
                                    {[entry.company, entry.service_rendered].filter(Boolean).join(' — ')}
                                </div>
                                {entry.remark_image_url ? (
                                    <img className="cred-remark-image" src={entry.remark_image_url} alt="Remark" />
                                ) : (
                                    <div className="cred-remark">"{entry.remark_text}"</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="cred-dots">
                {entries.map((entry, i) => (
                    <button
                        key={entry.id}
                        className={`cred-dot${i === activeIndex ? ' active' : ''}`}
                        aria-label={`Go to testimonial ${i + 1}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>
        </div>
    );
}
