import { useEffect, useRef, useState } from 'react';

const LINKS = [
    { href: '#story', label: 'Story' },
    { href: '#houses', label: 'Houses' },
    { href: '#credibility', label: 'Credibility' },
    { href: '#contact', label: 'Contact Us' },
    { href: '#faces', label: 'Faces' }
];

export default function Header() {
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        function onScroll() {
            setOpen(false);
        }
        function onKeyDown(e) {
            if (e.key === 'Escape') setOpen(false);
        }
        function onResize() {
            if (window.innerWidth > 720) setOpen(false);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', onResize);
        };
    }, [open]);

    return (
        <>
            <header>
                <div className="nav-icon">
                    <svg viewBox="112 109 345 393" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke="#FBF6F5">
                            <circle cx="300" cy="330" r="155.4" strokeWidth="33.6" />
                            <circle cx="300" cy="330" r="115.75" strokeWidth="30.5" />
                            <path d="M182.8 142.4 L182.8 330" strokeWidth="33.7" strokeLinecap="round" />
                        </g>
                    </svg>
                    <div className="logo">Blooom</div>
                </div>

                <nav className="desktop-nav">
                    {LINKS.map((l) => (
                        <a key={l.href} href={l.href}>{l.label}</a>
                    ))}
                </nav>

                <button
                    className="menu-toggle"
                    aria-label="Open menu"
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                >
                    <span></span><span></span><span></span>
                </button>
            </header>

            <div className={`nav-backdrop${open ? ' open' : ''}`} onClick={() => setOpen(false)} />

            <div className={`nav-panel${open ? ' open' : ''}`} ref={panelRef}>
                <button className="nav-close" aria-label="Close menu" onClick={() => setOpen(false)}>
                    &#10005;
                </button>
                <nav className="nav-panel-links">
                    {LINKS.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
                    ))}
                </nav>
            </div>
        </>
    );
}
