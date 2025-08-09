// import cors from 'cors';
// import { getClientOrigins } from './env.js';

// const origins = getClientOrigins();

// export const corsMiddleware = cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (origins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// });


import cors from 'cors';

// Укажи в CLIENT_URL прод и превью-деплои через запятую. Примеры:
// CLIENT_URL="https://kursovaia-frontend.vercel.app,https://kursovaia-frontend-*.vercel.app,https://yourdomain.com"
function parseAllowedOrigins() {
  const raw = (process.env.CLIENT_URL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Дополнительно: если указан хотя бы один *.vercel.app, автоматически разрешим все подпроекты .vercel.app
  const patterns = raw.map((entry) => {
    if (entry.includes('*')) {
      const esc = entry
        .replace(/[.+?^${}()|[\]\]/g, '\$&')
        .replace(/\\*/g, '.*');
      return new RegExp(`^${esc}$`);
    }
    return entry; // точное совпадение
  });

  return patterns;
}

const allowed = parseAllowedOrigins();

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Для прямых переходов (OAuth callback/редиректы) у браузера часто нет Origin — пропускаем
    if (!origin) return callback(null, true);

    const ok = allowed.some((rule) => (rule instanceof RegExp ? rule.test(origin) : rule === origin));

    if (ok) return callback(null, true);

    console.warn('[CORS] Blocked origin:', origin, 'Allowed:', allowed);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
});