function initialsOf(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('');
}

export default function FaceCard({ face }) {
    return (
        <div className="face-card">
            <div className="face-info">
                <div className="face-name">{face.name}</div>
                {face.role && <div className="face-role">{face.role}</div>}
                {face.house_name && <div className="face-house">{face.house_name}</div>}
            </div>
            <div className="face-image">
                {face.photo_url ? (
                    <img src={face.photo_url} alt={face.name} />
                ) : (
                    <>
                        <div className="initials">{initialsOf(face.name)}</div>
                        <div className="placeholder-note">Photo coming soon</div>
                    </>
                )}
            </div>
        </div>
    );
}
