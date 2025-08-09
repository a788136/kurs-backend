export function ensureEnv() {
  const required = [
    'MONGO_URI',
    'SESSION_SECRET',
    'CLIENT_URL', // один или несколько доменов через запятую, без путей
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'GITHUB_CALLBACK_URL'
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('Missing ENV:', missing.join(', '));
  }
}

export function getClientOrigins() {
  return (process.env.CLIENT_URL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}