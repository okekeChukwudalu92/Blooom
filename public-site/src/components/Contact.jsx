// All hrefs are placeholders until the CEO confirms the real links — the
// current phone number is private and will be replaced, so nothing here
// is wired to a real destination yet. Swap the "#" values once you have them.
const SOCIALS = [
    {
        label: 'WhatsApp',
        href: '#',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3a9 9 0 0 0-7.79 13.5L3 21l4.65-1.19A9 9 0 1 0 12 3Z" stroke="#f5efe4" strokeWidth="1.7" />
                <path d="M8.4 8.3c.2-.45.4-.46.6-.47h.5c.16 0 .38-.02.58.46.2.5.7 1.7.76 1.83.06.13.1.28.02.44-.08.16-.13.26-.25.4-.13.14-.27.31-.38.42-.13.13-.26.27-.11.53.14.27.64 1.06 1.38 1.72.95.85 1.75 1.11 2 1.24.26.13.4.1.55-.06.16-.16.65-.76.82-1.02.17-.27.34-.22.57-.13.23.09 1.47.7 1.72.82.25.13.42.19.48.3.06.11.06.62-.15 1.22-.2.6-1.2 1.15-1.66 1.22-.42.07-.95.1-1.53-.1-.35-.11-.8-.27-1.38-.53-2.43-1.05-4.02-3.5-4.14-3.67-.12-.16-.98-1.3-.98-2.48s.62-1.76.84-2Z" fill="#f5efe4" />
            </svg>
        )
    },
    {
        label: 'Instagram',
        href: '#',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="#f5efe4" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4.2" stroke="#f5efe4" strokeWidth="1.8" />
                <circle cx="17.3" cy="6.7" r="1.15" fill="#f5efe4" />
            </svg>
        )
    },
    {
        label: 'X',
        href: '#',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4l16 16M20 4L4 20" stroke="#f5efe4" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
        )
    },
    {
        label: 'Email',
        href: '#',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="#f5efe4" strokeWidth="1.7" />
                <path d="M4 7l8 6 8-6" stroke="#f5efe4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        label: 'Call',
        href: '#',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3c0 1.1-.95 1.95-2.03 1.78-3.6-.55-6.98-2.3-9.5-4.82C5.5 11.4 3.75 8.02 3.2 4.42 3.03 3.34 3.9 2.5 5 2.5h1.5Z" stroke="#f5efe4" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
        )
    }
];

export default function Contact() {
    return (
        <section id="contact" className="contact-block">
            <div className="wrap">
                <h2>This is a preview. The real thing is being built.</h2>
                <p className="sub2">
                    Follow along as both houses come together under Blooom — or reach out directly.
                </p>
                <div className="social-row">
                    {SOCIALS.map((s) => (
                        <a className="social-item" href={s.href} aria-label={s.label} key={s.label}>
                            <div className="social-icon">{s.icon}</div>
                            <span>{s.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
