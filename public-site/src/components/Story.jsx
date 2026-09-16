const STEPS = [
    {
        num: '01',
        label: 'The first door',
        title: 'BlooomOnline',
        desc: 'BlooomOnline started with social media management — helping brands show up, communicate better and grow their presence online.'
    },
    {
        num: '02',
        label: 'Then came the requests',
        title: 'More than social',
        desc: 'As the network grew, so did the kind of work people brought to Blooom. Websites. Design. Motion. Digital experiences. The opportunities were no longer limited to social media.'
    },
    {
        num: '03',
        label: 'The missing piece',
        title: 'Blooom needed a technical side.',
        desc: 'The demand was there, but the technical work needed more than one person could handle alone. So instead of keeping the idea on the sidelines, Blooom created a way to build it properly.'
    },
    {
        num: '04',
        label: 'The new house',
        title: 'Enter BlooomLabs.',
        desc: 'BlooomLabs became the technical and creative production house — bringing skilled people together across development, design, motion and other digital disciplines to turn ideas into finished work.'
    },
    {
        num: '05',
        label: 'Today',
        title: 'Two sides. One Blooom.',
        // TODO: screenshot cuts off after this line — paste the rest of the
        // "05 Today" paragraph here once you have it.
        desc: "BlooomOnline helps brands grow their presence. "
    }
];

export default function Story() {
    return (
        <section id="story">
            <div className="wrap">
                <div className="story-intro">
                    <div className="eyebrow">How Blooom took shape</div>
                    <h2>It started with social media. Then people started asking for more.</h2>
                    <p>
                        Blooom wasn't built with every piece figured out from day one. It started with{' '}
                        <strong>one skill, a growing network, and people who kept coming back with
                        bigger problems to solve.</strong> What began as BlooomOnline gradually opened
                        the door to something bigger.
                    </p>
                </div>

                <div className="story-steps">
                    {STEPS.map((step) => (
                        <div className="story-step" key={step.num}>
                            <div className="story-step-marker">
                                <div className="story-step-num">{step.num}</div>
                                <div className="story-step-label">{step.label}</div>
                            </div>
                            <div>
                                <div className="story-step-title">{step.title}</div>
                                <div className="story-step-desc">{step.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
