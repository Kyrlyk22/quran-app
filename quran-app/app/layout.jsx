/* eslint-disable @next/next/no-page-custom-font */
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';
import AudioPlayer from '@/components/AudioPlayer';
import Header from '@/components/Header';

export const metadata = {
  title: 'The Sacred Breath — Quran Reader',
  description: 'Immersive Quran reading experience with surahs, ayahs, translations, and recitation.',
  keywords: 'Quran, surah, ayah, translation, recitation, islam',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Manrope:wght@400;500;600;700;800&family=Noto+Serif:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AudioProvider>
          <div className="site-shell">
            <Header />
            <main className="page-frame">{children}</main>
            <AudioPlayer />
            <footer className="site-footer">
              <div className="site-footer-inner">
                <div className="footer-brand">The Sacred Breath</div>
                <div className="footer-copy">© 2024 The Sacred Breath. A Digital Maqam.</div>
                <div className="footer-links">
                  <a href="#">Contact</a>
                  <a href="#">About Us</a>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                </div>
              </div>
            </footer>
          </div>
        </AudioProvider>
      </body>
    </html>
  );
}
