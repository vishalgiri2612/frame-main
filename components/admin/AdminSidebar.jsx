'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  LogOut,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';

const menuItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/admin' },
  { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { id: 'users', label: 'Customers', icon: Users, href: '/admin/users' },
  { id: 'support', label: 'Support', icon: MessageSquare, href: '/admin/support' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-50/80 border-r border-zinc-200 h-screen sticky top-0 flex flex-col flex-shrink-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 bg-white">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold font-serif italic">F</span>
          </div>
          <span className="font-semibold text-zinc-900 tracking-tight">Frame Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="mb-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Menu
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}`));
            return (
              <Link 
                key={item.id} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${
                  isActive ? 'text-zinc-900 bg-white shadow-sm ring-1 ring-zinc-200' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-900'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-200">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-colors group"
        >
          <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-500" />
          Log out
        </button>
      </div>
    </aside>
  );
}
