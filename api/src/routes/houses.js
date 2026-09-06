import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public — anyone can view the houses
router.get('/', async (req, res) => {
    const { rows } = await pool.query(
        `select id, name, tagline, description, tags, accent_from, accent_to, sort_order
         from houses order by sort_order asc, created_at asc`
    );
    res.json(rows);
});

// Protected — any logged-in admin or god can add
router.post('/', authenticate, async (req, res) => {
    const { name, tagline, description, tags, accent_from, accent_to, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const { rows } = await pool.query(
        `insert into houses (name, tagline, description, tags, accent_from, accent_to, sort_order, created_by)
         values ($1, $2, $3, $4, $5, $6, coalesce($7, 0), $8)
         returning *`,
        [name, tagline, description, tags || [], accent_from, accent_to, sort_order,
            req.user.role === 'god' ? null : req.user.id]
    );
    res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
    const { name, tagline, description, tags, accent_from, accent_to, sort_order } = req.body;
    const { rows } = await pool.query(
        `update houses set
            name = coalesce($1, name),
            tagline = coalesce($2, tagline),
            description = coalesce($3, description),
            tags = coalesce($4, tags),
            accent_from = coalesce($5, accent_from),
            accent_to = coalesce($6, accent_to),
            sort_order = coalesce($7, sort_order)
         where id = $8
         returning *`,
        [name, tagline, description, tags, accent_from, accent_to, sort_order, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'House not found' });
    res.json(rows[0]);
});

router.delete('/:id', authenticate, async (req, res) => {
    await pool.query(`delete from houses where id = $1`, [req.params.id]);
    res.json({ ok: true });
});

export default router;
