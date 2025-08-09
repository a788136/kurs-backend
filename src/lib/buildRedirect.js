export function buildRedirect(path = '/') {
  const list = (process.env.CLIENT_URL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const base = list[0] || '';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}