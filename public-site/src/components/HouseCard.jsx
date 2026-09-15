import BlooomLabsLogo from './BlooomLabsLogo.jsx';
import BlooomOnlineLogo from './BlooomOnlineLogo.jsx';

// Real, finished brand marks for the two known houses. Any house added later
// through the admin panel that isn't one of these two falls back to the
// plain gradient-text treatment below — new houses won't have a finished
// logo yet, so that's the right default until one exists.
const KNOWN_LOGOS = {
    blooomlabs: BlooomLabsLogo,
    blooomonline: BlooomOnlineLogo
};

export default function HouseCard({ house }) {
    const key = house.name?.toLowerCase().replace(/\s+/g, '');
    const Logo = KNOWN_LOGOS[key];

    const gradient = `linear-gradient(100deg, ${house.accent_from || '#4a8fe8'}, ${house.accent_to || '#8b3ce8'})`;

    return (
        <div className="house">
            {Logo ? (
                <Logo />
            ) : (
                <>
                    <div className="house-label">House</div>
                    <div
                        className="house-name"
                        style={{
                            backgroundImage: gradient,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        {house.name}
                    </div>
                </>
            )}
            {house.tagline && <div className="house-tagline">{house.tagline}</div>}
            {house.description && <p className="house-desc">{house.description}</p>}
            {house.tags?.length > 0 && (
                <div className="house-tags">
                    {house.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
}
