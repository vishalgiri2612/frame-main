'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
  { id: 'support', label: 'Support', icon: MessageSquare, href: '/admin/support' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-navy-surface border-r border-gold/10 h-screen sticky top-0 flex flex-col pt-32 pb-8">
      <div className="px-8 mb-12">
        <h2 className="text-[10px] font-mono tracking-[0.4em] text-gold uppercase opacity-80">Admin Interface</h2>
        <h1 className="text-2xl font-light tracking-tighter text-cream mt-2">Mission Control</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link 
              key={item.id} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-4 transition-all duration-300 group relative ${
                isActive ? 'text-gold' : 'text-cream/70 hover:text-cream'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-bg"
                  className="absolute inset-0 bg-gold/5 border-r-2 border-gold rounded-sm z-0"
                />
              )}
              <item.icon className="w-5 h-5 relative z-10" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pt-8 border-t border-gold/5">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-4 px-4 py-4 text-cream/50 hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase">Disconnect</span>
        </button>
      </div>
    </aside>
  );
}
