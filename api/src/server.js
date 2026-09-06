import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import houseRoutes from './routes/houses.js';
import credibilityRoutes from './routes/credibility.js';
import faceRoutes from './routes/faces.js';
import uploadRoutes from './routes/upload.js';

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // allow requests with no origin (curl, mobile apps, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/credibility', credibilityRoutes);
app.use('/api/faces', faceRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Blooom API running on port ${PORT}`));
