import { Cormorant_Garamond, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/layout/SmoothScroll';
import NextAuthProvider from '@/components/providers/NextAuthProvider';
import ScrollRevealProvider from '@/components/providers/ScrollRevealProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: 'EYELOVEYOU — Punjab Optical | Premium Eyewear',
  description:
    "Curating the world's finest frames since 1987. Where precision meets personal expression.",
};

import Navbar from '@/components/layout/Navbar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import CartProvider from '@/components/providers/CartProvider';
import CartDrawer from '@/components/ui/CartDrawer';
import BackgroundGlow from '@/components/ui/BackgroundGlow';
import WishlistProvider from '@/components/providers/WishlistProvider';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${playfair.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://india.ray-ban.com" />
      </head>
      <body className="overflow-x-hidden antialiased">
        <BackgroundGlow />
        <SmoothScroll>
          <NextAuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ScrollRevealProvider />
                <ThemeToggle />
                <CartDrawer />
                <Navbar />
                <Toaster position="bottom-right" />
                {children}
              </WishlistProvider>
            </CartProvider>
          </NextAuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
