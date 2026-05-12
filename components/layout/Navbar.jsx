'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { Search, ShoppingBag, User, Menu, X, Heart, LogOut } from 'lucide-react';
import dynamic from 'next/dynamic';

const SearchOverlay = dynamic(() => import('@/components/ui/SearchOverlay'), { ssr: false });

const navLinks = [
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'Contact Lenses', href: '/contact-lens' },
  { name: 'Magazine', href: '/magazine' },
  { name: 'About', href: '/about' },
  { name: 'Support', href: '/support' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const iconStyle = {
    color: '#0F1117',
    transition: 'color 200ms ease, transform 200ms ease',
  };

  return (
    <nav className="print:hidden"
      style={{
        position: 'fixed',
        top: isScrolled ? '20px' : '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isScrolled ? 'calc(100% - 40px)' : '100%',
        maxWidth: isScrolled ? '1400px' : '100%',
        zIndex: 1000,
        backgroundColor: 'var(--navy-deep)',
        borderBottom: isScrolled ? 'none' : '1px solid var(--border-subtle)',
        borderRadius: isScrolled ? '9999px' : '0',
        padding: isScrolled ? '8px 0' : '16px 0',
        boxShadow: isScrolled ? '0 10px 40px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col group relative z-50 shrink-0">
          <motion.span
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              fontWeight: 700,
              letterSpacing: '0.35em',
              color: 'var(--text-primary)',
              lineHeight: 1,
              transition: 'color 300ms ease',
            }}
            className="leading-none"
          >
            EYELOVEYOU
          </motion.span>
          <div className="hidden sm:flex items-center gap-2 mt-1.5">
            <span className="h-px w-4" style={{ backgroundColor: 'var(--gold)' }} />
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '8px',
                fontWeight: 500,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                opacity: 0.9,
              }}
            >
              Punjab Optical · Est. 1987
            </span>
          </div>
          {/* Logo gold glow on hover */}
          <div
            className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ background: 'rgba(var(--gold-rgb), 0.1)', filter: 'blur(16px)' }}
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center space-x-8 relative z-50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link text-sm uppercase tracking-widest font-medium ${isActive ? 'active' : ''}`}
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-primary)' }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right actions — icons use text-primary, NOT gold */}
        <div className="flex items-center space-x-4 md:space-x-5 shrink-0 relative z-50">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hover:scale-110 transition-transform"
            style={iconStyle}
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[2px]" />
          </button>

          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-3 py-1.5 border text-[9px] font-medium tracking-[0.2em] uppercase transition-all hidden md:block"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-inter)',
              }}
            >
              Admin
            </Link>
          )}

          <Link
            href={session ? '/profile' : '/login'}
            className="hover:scale-110 transition-transform"
            style={iconStyle}
            aria-label="Account"
          >
            <User className="w-5 h-5 stroke-[2px]" />
          </Link>

          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="hover:scale-110 transition-transform hidden sm:block"
              style={iconStyle}
              title="Logout"
            >
              <LogOut className="w-5 h-5 stroke-[2px]" />
            </button>
          )}

          <Link
            href="/wishlist"
            className="relative hover:scale-110 transition-transform hidden sm:block"
            style={iconStyle}
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[2px]" />
            {wishlist.length > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[8px] font-bold w-[12px] h-[12px] rounded-full flex items-center justify-center"
                style={{ background: '#C9A84C', color: '#0A0E1A' }}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            className="relative hover:scale-110 transition-transform"
            onClick={() => setIsCartOpen(true)}
            style={iconStyle}
            aria-label="Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2px]" />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center"
                style={{ background: '#C9A84C', color: '#0A0E1A' }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            className="lg:hidden hover:scale-110 transition-transform"
            onClick={() => setIsMobileMenuOpen(true)}
            style={iconStyle}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 stroke-[2px]" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] flex flex-col p-8"
            style={{ backgroundColor: 'var(--navy)', color: 'var(--text-primary)' }}
          >
            <div
              className="flex justify-between items-center pb-6"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  color: 'var(--text-primary)',
                }}
              >
                EYELOVEYOU
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full transition-all"
                style={{
                  color: 'var(--text-primary)',
                  background: 'var(--border-subtle)',
                }}
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={2} />
              </button>
            </div>
            <div className="mt-12 flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-5 transition-colors"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '2rem',
                    fontWeight: 400,
                    color: 'var(--text-secondary)',
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <span className="w-5 h-px" style={{ background: 'var(--gold)', opacity: 0.4 }} />
                  {link.name}
                </Link>
              ))}
              
              {/* Add Wishlist explicitly to mobile menu */}
              <Link
                href="/wishlist"
                className="flex items-center gap-5 transition-colors"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: 'var(--text-secondary)',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <span className="w-5 h-px" style={{ background: 'var(--gold)', opacity: 0.4 }} />
                Wishlist
                {wishlist.length > 0 && (
                  <span className="ml-auto text-xs bg-gold text-navy px-2 py-0.5 rounded-full font-mono font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
