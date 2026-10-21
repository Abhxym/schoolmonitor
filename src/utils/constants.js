// Backend base URL. Trimmed because a stray newline pasted into the Vercel env var
// gets baked into the bundle and breaks every request.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
