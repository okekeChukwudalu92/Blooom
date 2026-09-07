export default function HouseCard({ house }) {
    const gradient = `linear-gradient(100deg, ${house.accent_from || '#4a8fe8'}, ${house.accent_to || '#8b3ce8'})`;

    return (
        <div className="house">
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
