const TIMELINE = [
    {
        when: 'Early on',
        what: 'Picked up technical gigs during school, built on being someone people already trusted to figure things out.'
    },
    {
        when: 'In parallel',
        what: 'Led as department president and as part of the SUG — 13 departments, real accountability, not a title on a resume.'
    },
    {
        when: 'Full focus',
        what: 'Set the tech side aside to grow BlooomOnline, managing social presence and brand growth full-time.'
    },
    {
        when: 'Now',
        what: 'Picking the tech side back up as BlooomLabs, run alongside BlooomOnline under Blooom.'
    }
];

export default function Story() {
    return (
        <section id="story">
            <div className="wrap story-grid">
                <div>
                    <div className="eyebrow">The story so far</div>
                    <h2>It started with trust, before it had a name.</h2>
                    <p>
                        Long before Blooom existed, there was a track record of people trusting one
                        person to run things — technical gigs picked up on reputation alone, then real
                        leadership across an entire student body. That trust is the actual asset. Blooom
                        is what happens when it gets a name and a structure.
                    </p>
                    <p>
                        The tech instincts were set aside for a season to focus fully on growing brands
                        online. Now both sides are active at once, under one house.
                    </p>
                </div>
                <div className="timeline">
                    {TIMELINE.map((row) => (
                        <div className="t-row" key={row.when}>
                            <div className="t-when">{row.when}</div>
                            <div className="t-what">{row.what}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
