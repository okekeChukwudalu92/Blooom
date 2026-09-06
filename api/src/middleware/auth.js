import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Not logged in' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, role, purpose }
        next();
    } catch {
        return res.status(401).json({ error: 'Session expired, please log in again' });
    }
}

export function requireGodMode(req, res, next) {
    if (req.user?.role !== 'god') {
        return res.status(403).json({ error: 'Only the developer account can do this' });
    }
    next();
}
