import CredibilityCarousel from './CredibilityCarousel.jsx';

export default function Credibility({ entries }) {
    return (
        <section id="credibility">
            <div className="wrap">
                <div className="eyebrow">Proof, not promises</div>
                <h2>What people say after working with us.</h2>

                <CredibilityCarousel entries={entries} />
                {entries.length === 0 && <p className="muted">No testimonials added yet.</p>}

                <div className="credentials">
                    <div className="credential">
                        <div className="credential-mark">A</div>
                        <div>
                            <div className="credential-title">Award — Placeholder Title</div>
                            <div className="credential-sub">Issuing body, year</div>
                        </div>
                    </div>
                    <div className="credential">
                        <div className="credential-mark blue">C</div>
                        <div>
                            <div className="credential-title">Certificate — Placeholder Title</div>
                            <div className="credential-sub">School / institution, year</div>
                        </div>
                    </div>
                    <div className="credential">
                        <div className="credential-mark">R</div>
                        <div>
                            <div className="credential-title">Recognition — Placeholder Title</div>
                            <div className="credential-sub">Organization, year</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
