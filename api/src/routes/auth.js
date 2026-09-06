import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { generateOtp } from '../utils/otp.js';
import { authenticate, requireGodMode } from '../middleware/auth.js';

const router = Router();

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
};

function issueSession(res, payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, COOKIE_OPTS);
}

// ---------------------------------------------------------------------------
// POST /api/auth/login  { password }
// Tries the god password first, then checks it against every admin that has
// already finished onboarding (has a password_hash set).
// ---------------------------------------------------------------------------
router.post('/login', async (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });

    if (password === process.env.GOD_PASSWORD) {
        issueSession(res, { id: 'god', role: 'god' });
        return res.json({ role: 'god', name: 'Developer' });
    }

    const { rows } = await pool.query(
        `select id, name, password_hash from admins where password_hash is not null and is_active = true`
    );

    for (const admin of rows) {
        const match = await bcrypt.compare(password, admin.password_hash);
        if (match) {
            issueSession(res, { id: admin.id, role: 'admin' });
            return res.json({ role: 'admin', name: admin.name });
        }
    }

    return res.status(401).json({ error: 'Incorrect password' });
});

// ---------------------------------------------------------------------------
// POST /api/auth/verify-otp  { otp }
// Looks for an admin whose OTP matches, hasn't expired, and hasn't been used.
// Returns a short-lived onboarding token + their security questions.
// ---------------------------------------------------------------------------
router.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ error: 'OTP is required' });

    const { rows } = await pool.query(
        `select id, name, otp_hash, security_question_1, security_question_2
         from admins
         where otp_hash is not null and otp_used = false and otp_expires_at > now()`
    );

    for (const admin of rows) {
        const match = await bcrypt.compare(otp, admin.otp_hash);
        if (match) {
            const onboardingToken = jwt.sign(
                { id: admin.id, purpose: 'onboarding' },
                process.env.JWT_SECRET,
                { expiresIn: '30m' }
            );
            return res.json({
                onboardingToken,
                name: admin.name,
                question1: admin.security_question_1,
                question2: admin.security_question_2
            });
        }
    }

    return res.status(401).json({ error: 'Invalid or expired OTP' });
});

// ---------------------------------------------------------------------------
// POST /api/auth/complete-onboarding
//   { onboardingToken, answer1, answer2, newPassword }
// Verifies the security answers, sets the real password, logs the admin in.
// ---------------------------------------------------------------------------
router.post('/complete-onboarding', async (req, res) => {
    const { onboardingToken, answer1, answer2, newPassword } = req.body;
    if (!onboardingToken || !answer1 || !answer2 || !newPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    let payload;
    try {
        payload = jwt.verify(onboardingToken, process.env.JWT_SECRET);
        if (payload.purpose !== 'onboarding') throw new Error('wrong token type');
    } catch {
        return res.status(401).json({ error: 'Onboarding session expired, ask for a new OTP' });
    }

    const { rows } = await pool.query(
        `select id, name, security_answer_1_hash, security_answer_2_hash
         from admins where id = $1 and otp_used = false`,
        [payload.id]
    );
    const admin = rows[0];
    if (!admin) return res.status(400).json({ error: 'Onboarding already completed' });

    const a1ok = await bcrypt.compare(answer1.trim().toLowerCase(), admin.security_answer_1_hash);
    const a2ok = await bcrypt.compare(answer2.trim().toLowerCase(), admin.security_answer_2_hash);
    if (!a1ok || !a2ok) return res.status(401).json({ error: 'Security answers do not match' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await pool.query(
        `update admins set password_hash = $1, otp_used = true, otp_hash = null, otp_expires_at = null
         where id = $2`,
        [passwordHash, admin.id]
    );

    issueSession(res, { id: admin.id, role: 'admin' });
    res.json({ role: 'admin', name: admin.name });
});

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------
router.post('/logout', (req, res) => {
    res.clearCookie('token', COOKIE_OPTS);
    res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// GET /api/auth/me — who am I currently logged in as
// ---------------------------------------------------------------------------
router.get('/me', authenticate, async (req, res) => {
    if (req.user.role === 'god') return res.json({ role: 'god', name: 'Developer' });
    const { rows } = await pool.query(`select name from admins where id = $1`, [req.user.id]);
    res.json({ role: 'admin', name: rows[0]?.name || 'Admin' });
});

// ---------------------------------------------------------------------------
// GOD-ONLY: create a new admin invite
// POST /api/auth/admins
//   { name, question1, answer1, question2, answer2 }
// Returns the raw OTP once — copy it and send it to the person yourself.
// ---------------------------------------------------------------------------
router.post('/admins', authenticate, requireGodMode, async (req, res) => {
    const { name, question1, answer1, question2, answer2 } = req.body;
    if (!name || !question1 || !answer1 || !question2 || !answer2) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const rawOtp = generateOtp();
    const otpHash = await bcrypt.hash(rawOtp, 12);
    const a1Hash = await bcrypt.hash(answer1.trim().toLowerCase(), 12);
    const a2Hash = await bcrypt.hash(answer2.trim().toLowerCase(), 12);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    const { rows } = await pool.query(
        `insert into admins
            (name, role, security_question_1, security_answer_1_hash,
             security_question_2, security_answer_2_hash, otp_hash, otp_expires_at)
         values ($1, 'admin', $2, $3, $4, $5, $6, $7)
         returning id`,
        [name, question1, a1Hash, question2, a2Hash, otpHash, expiresAt]
    );

    res.json({ adminId: rows[0].id, otp: rawOtp, expiresAt });
});

// ---------------------------------------------------------------------------
// GOD-ONLY: list admins
// ---------------------------------------------------------------------------
router.get('/admins', authenticate, requireGodMode, async (req, res) => {
    const { rows } = await pool.query(
        `select id, name, role, is_active, (password_hash is not null) as onboarded, created_at
         from admins order by created_at desc`
    );
    res.json(rows);
});

// ---------------------------------------------------------------------------
// GOD-ONLY: reset an admin's access — issues a fresh OTP, clears their password
// POST /api/auth/admins/:id/reset
// ---------------------------------------------------------------------------
router.post('/admins/:id/reset', authenticate, requireGodMode, async (req, res) => {
    const rawOtp = generateOtp();
    const otpHash = await bcrypt.hash(rawOtp, 12);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    const { rows } = await pool.query(
        `update admins
         set otp_hash = $1, otp_expires_at = $2, otp_used = false, password_hash = null
         where id = $3
         returning id, name`,
        [otpHash, expiresAt, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Admin not found' });

    res.json({ adminId: rows[0].id, name: rows[0].name, otp: rawOtp, expiresAt });
});

export default router;
