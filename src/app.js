import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';

import { ensureEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { corsMiddleware } from './config/cors.js';
import { sessionMiddleware } from './config/session.js';
import './config/passport.js';

import authRoutes from './routes/auth.js';

ensureEnv();
await connectDB();

const app = express();
app.set('trust proxy', 1); // Render за прокси

app.use(helmet());
app.use(morgan('tiny'));
app.use(corsMiddleware);
app.use(express.json());
app.use(session(sessionMiddleware));
app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (req, res) => res.status(200).json({ ok: true }));
app.use('/auth', authRoutes);

export default app;