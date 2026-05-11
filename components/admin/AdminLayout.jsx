'use client';
import AdminSidebar from './AdminSidebar';
import { motion } from 'framer-motion';
import { Bell, User, LogOut, Settings, Shield } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { data: session } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-900">
      <div className="print:hidden">
        <AdminSidebar />
      </div>
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 print:hidden">
          <div className="flex-1 flex items-center">

          </div>
          <div className="ml-4 flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notifyRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'}`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border-2 border-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Notifications</span>
                    <span className="text-[10px] font-medium text-zinc-400">Mark all as read</span>
                  </div>
                  <div className="py-8 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
                      <Bell className="h-6 w-6 text-zinc-300" />
                    </div>
                    <p className="text-sm font-medium text-zinc-900">All caught up!</p>
                    <p className="text-xs text-zinc-500 mt-1">You have no new notifications to review.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center gap-2 p-1 rounded-full border transition-all ${showProfile ? 'border-zinc-300 bg-zinc-50 shadow-sm' : 'border-zinc-200 hover:border-zinc-300'}`}
              >
                <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <User className="h-4 w-4 text-white" />
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 bg-zinc-50/50 border-b border-zinc-100">
                    <p className="text-sm font-bold text-zinc-900 truncate">{session?.user?.name || 'Administrator'}</p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{session?.user?.email || 'admin@frame.com'}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter text-white">
                      <Shield className="w-2 h-2" />
                      {session?.user?.role || 'ADMIN'}
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors">
                      <User className="h-4 w-4" />
                      View Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <div className="h-[1px] bg-zinc-100 my-1" />
                    <button 
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-8 print:p-0 overflow-x-hidden"
        >
          <div className="max-w-[1500px] mx-auto">
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
