import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
    const { rows } = await pool.query(
        `select id, person_name, company, service_rendered, remark_text, remark_image_url, photo_url, sort_order
         from credibility order by sort_order asc, created_at asc`
    );
    res.json(rows);
});

router.post('/', authenticate, async (req, res) => {
    const { person_name, company, service_rendered, remark_text, remark_image_url, photo_url, sort_order } = req.body;
    if (!person_name) return res.status(400).json({ error: 'Person name is required' });

    const { rows } = await pool.query(
        `insert into credibility
            (person_name, company, service_rendered, remark_text, remark_image_url, photo_url, sort_order, created_by)
         values ($1, $2, $3, $4, $5, $6, coalesce($7, 0), $8)
         returning *`,
        [person_name, company, service_rendered, remark_text, remark_image_url, photo_url, sort_order,
            req.user.role === 'god' ? null : req.user.id]
    );
    res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
    const { person_name, company, service_rendered, remark_text, remark_image_url, photo_url, sort_order } = req.body;
    const { rows } = await pool.query(
        `update credibility set
            person_name = coalesce($1, person_name),
            company = coalesce($2, company),
            service_rendered = coalesce($3, service_rendered),
            remark_text = coalesce($4, remark_text),
            remark_image_url = coalesce($5, remark_image_url),
            photo_url = coalesce($6, photo_url),
            sort_order = coalesce($7, sort_order)
         where id = $8
         returning *`,
        [person_name, company, service_rendered, remark_text, remark_image_url, photo_url, sort_order, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Entry not found' });
    res.json(rows[0]);
});

router.delete('/:id', authenticate, async (req, res) => {
    await pool.query(`delete from credibility where id = $1`, [req.params.id]);
    res.json({ ok: true });
});

export default router;
