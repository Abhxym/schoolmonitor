import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { API_URL } from '../../../../utils/constants';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            // On first sign-in, exchange the Google ID token for a ZP JWT.
            // The backend verifies the ID token with Google before trusting the email in it.
            if (account?.provider === 'google' && account.id_token) {
                try {
                    const res = await fetch(`${API_URL}/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken: account.id_token }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        token.zpToken = data.token;
                        token.zpUser = data.user;
                    }
                } catch { /* backend may be down — token.zpToken stays undefined */ }
            }
            return token;
        },
        async session({ session, token }) {
            session.zpToken = token.zpToken ?? null;
            session.zpUser = token.zpUser ?? null;
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
});

export { handler as GET, handler as POST };
