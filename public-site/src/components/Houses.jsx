import HouseCard from './HouseCard.jsx';

export default function Houses({ houses }) {
    return (
        <section id="houses">
            <div className="wrap">
                <div className="eyebrow">Two houses, one name</div>
                <h2>The reach and the build, working together instead of apart.</h2>
                <div className="houses">
                    {houses.map((house) => (
                        <HouseCard key={house.id} house={house} />
                    ))}
                    {houses.length === 0 && <p className="muted">No houses added yet.</p>}
                </div>
            </div>
        </section>
    );
}
