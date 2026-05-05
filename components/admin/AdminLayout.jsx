'use client';
import AdminSidebar from './AdminSidebar';
import { motion } from 'framer-motion';
import { Search, Bell, User } from 'lucide-react';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-md leading-5 bg-zinc-50 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm transition-colors"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center overflow-hidden cursor-pointer">
              <User className="h-5 w-5 text-zinc-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-8 overflow-x-hidden"
        >
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
