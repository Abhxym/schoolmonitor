import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, profile }) {
            // On first sign-in, exchange Google token for ZP JWT
            if (account?.provider === 'google') {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: token.email,
                            name: token.name,
                            googleId: token.sub,
                            avatar: token.picture,
                        }),
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
