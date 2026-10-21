// Shared settings read from the environment.
// In production a missing JWT_SECRET is fatal — a guessable fallback would let anyone mint tokens.
const isProd = process.env.NODE_ENV === 'production';

if (isProd && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production');
}

module.exports = {
    JWT_SECRET:       process.env.JWT_SECRET || 'dev-only-secret-change-me',
    APP_URL:          process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};
