import FaceCard from './FaceCard.jsx';

export default function Faces({ faces }) {
    return (
        <section id="faces">
            <div className="wrap">
                <div className="eyebrow">Behind the name</div>
                <h2>The people building it.</h2>
                {faces.map((face) => (
                    <FaceCard key={face.id} face={face} />
                ))}
                {faces.length === 0 && <p className="muted">No team members added yet.</p>}
            </div>
        </section>
    );
}
