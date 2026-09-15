export default function BlooomOnlineLogo() {
    return (
        <div className="house-logo">
            <svg className="online-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#FBF6F5">
                    <circle cx="300" cy="330" r="155.4" strokeWidth="33.6" />
                    <circle cx="300" cy="330" r="115.75" strokeWidth="30.5" />
                    <path d="M182.8 142.4 L182.8 330" strokeWidth="33.7" strokeLinecap="round" />
                </g>
            </svg>
            <div className="online-word">
                <div className="blooom">blooom</div>
                <div className="online-row">
                    <div className="online">online</div>
                    <svg className="online-arc-inline" viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10,100 A90,90 0 0 1 190,100" fill="none" stroke="#FF7412" strokeWidth="16" strokeLinecap="round" />
                        <path d="M35,100 A65,65 0 0 1 165,100" fill="none" stroke="#FF7412" strokeWidth="14" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
