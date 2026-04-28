'use client';
import AdminSidebar from './AdminSidebar';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }) {
  return (
    <div className="dark-mode flex min-h-screen bg-navy-deep text-cream selection:bg-gold selection:text-navy font-sans">
      <AdminSidebar />
      <main className="flex-1 min-h-screen bg-navy">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-12 pt-32"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
