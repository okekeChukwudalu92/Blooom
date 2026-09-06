import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
    const { rows } = await pool.query(
        `select f.id, f.name, f.role, f.photo_url, f.sort_order,
                h.id as house_id, h.name as house_name
         from faces f
         left join houses h on h.id = f.house_id
         order by f.sort_order asc, f.created_at asc`
    );
    res.json(rows);
});

router.post('/', authenticate, async (req, res) => {
    const { name, role, house_id, photo_url, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const { rows } = await pool.query(
        `insert into faces (name, role, house_id, photo_url, sort_order, created_by)
         values ($1, $2, $3, $4, coalesce($5, 0), $6)
         returning *`,
        [name, role, house_id || null, photo_url, sort_order, req.user.role === 'god' ? null : req.user.id]
    );
    res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
    const { name, role, house_id, photo_url, sort_order } = req.body;
    const { rows } = await pool.query(
        `update faces set
            name = coalesce($1, name),
            role = coalesce($2, role),
            house_id = coalesce($3, house_id),
            photo_url = coalesce($4, photo_url),
            sort_order = coalesce($5, sort_order)
         where id = $6
         returning *`,
        [name, role, house_id, photo_url, sort_order, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Face not found' });
    res.json(rows[0]);
});

router.delete('/:id', authenticate, async (req, res) => {
    await pool.query(`delete from faces where id = $1`, [req.params.id]);
    res.json({ ok: true });
});

export default router;
