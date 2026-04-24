import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import CustomCursor from '../components/ui/CustomCursor';
import AuthModal from '../components/auth/AuthModal';
import Script from 'next/script';
import Providers from '../components/auth/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] });

export const metadata = {
    title: {
        default: 'SCMS - Sambhajinagar, Maharashtra',
        template: '%s | SCMS',
    },
    description: 'Cluster School Monitoring System — Chhatrapati Sambhajinagar, Maharashtra.',
    icons: { icon: '/favicon.ico', apple: '/vite.svg' },
    manifest: '/manifest.json',
    openGraph: {
        siteName: 'SCMS',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <head>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    body { top: 0 !important; position: static !important; }
                .skiptranslate iframe,
                iframe.goog-te-banner-frame,
                iframe[src*="translate.googleapis.com"] {display: none !important; visibility: hidden !important; }
                #goog-gt-tt, .goog-te-balloon-frame {display: none !important; opacity: 0 !important; }
                .goog-te-spinner-pos {display: none !important; }
                `,
                    }}
                />
            </head>
            <body>
                <Providers>
                    <CustomCursor />
                    {children}
                    <AuthModal />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                fontFamily: 'var(--font-sans)',
                                borderRadius: '8px',
                                background: '#333',
                                color: '#fff',
                            },
                        }}
                    />

                    <Script id="google-translate-init" strategy="afterInteractive">
                        {`
                        function googleTranslateElementInit() {
                            new google.translate.TranslateElement({
                                pageLanguage: 'en',
                                includedLanguages: 'en,mr,hi',
                                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                            }, 'google_translate_element');
                        }
                    `}
                    </Script>
                    <Script
                        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                        strategy="afterInteractive"
                    />
                </Providers>
            </body>
        </html>
    );
}
