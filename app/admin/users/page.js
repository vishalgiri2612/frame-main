'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Search, Shield } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatDate } from '@/lib/admin/client';

export default function UserManagement() {
   const [query, setQuery] = useState('');
   const [role, setRole] = useState('');
   const [updatingId, setUpdatingId] = useState('');
   const [error, setError] = useState('');

   const { data, isLoading, refetch } = useAdminResource('/api/admin/users', {
      q: query,
      role,
      limit: 30,
   });

   const users = data?.items || [];

   const updateRole = async (userId, nextRole) => {
      setUpdatingId(userId);
      setError('');

      try {
         await adminFetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ role: nextRole }),
         });
         await refetch();
      } catch (err) {
         setError(err.message || 'Failed to update user');
      } finally {
         setUpdatingId('');
      }
   };

  return (
    <AdminLayout>
         <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-light tracking-tighter">Citizen <span className="italic font-serif text-gold">Manifest.</span></h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase mt-2">Identity & Access Governance</p>
        </div>
      </header>

         <section className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="md:col-span-3 relative flex-1 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 group-focus-within:text-gold transition-colors" />
               <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Search identities by name or email"
                  className="w-full bg-navy-surface border border-gold/5 px-12 py-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/20 transition-all"
               />
            </label>

            <select
               value={role}
               onChange={(event) => setRole(event.target.value)}
               className="bg-navy-surface border border-gold/5 px-3 py-3 text-sm outline-none focus:border-gold/20"
            >
               <option value="">All roles</option>
               <option value="ADMIN">Admin</option>
               <option value="USER">User</option>
            </select>
         </section>

         {error && (
            <div className="mb-5 border border-red-500/20 bg-red-500/5 text-red-300 px-3 py-2 text-sm inline-flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" />
               {error}
            </div>
         )}

      <div className="bg-navy-surface border border-gold/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold/10 font-mono text-[8px] tracking-[0.3em] text-cream/30 uppercase">
                     <th className="p-6 font-normal">ID</th>
                     <th className="p-6 font-normal">Identity</th>
              <th className="p-6 font-normal">Clearance</th>
              <th className="p-6 font-normal">Enrollment Date</th>
                     <th className="p-6 font-normal text-right">Role Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {users.map((user, i) => (
                     <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group hover:bg-gold/[0.01] transition-colors"
              >
                <td className="p-6">
                           <span className="text-xs font-mono tracking-widest text-gold">{user.id}</span>
                </td>
                <td className="p-6">
                           <div className="flex flex-col">
                              <span className="text-sm font-light text-cream">{user.name || '-'}</span>
                              <span className="text-[10px] font-mono text-cream/30 lowercase">{user.email || '-'}</span>
                           </div>
                </td>
                <td className="p-6">
                           <div className="flex items-center gap-2">
                              <Shield className={`w-3 h-3 ${user.role === 'ADMIN' ? 'text-gold' : 'text-cream/20'}`} />
                              <span className={`text-[9px] font-mono tracking-widest uppercase ${user.role === 'ADMIN' ? 'text-gold' : 'text-cream/40'}`}>
                                 {user.role || 'USER'}
                              </span>
                           </div>
                </td>
                        <td className="p-6 text-[10px] font-mono text-cream/20 uppercase tracking-widest">{formatDate(user.createdAt)}</td>
                <td className="p-6 text-right">
                           <select
                              value={user.role || 'USER'}
                              onChange={(event) => updateRole(user.id, event.target.value)}
                              disabled={updatingId === user.id}
                              className="bg-navy border border-gold/10 px-2 py-1 text-xs outline-none focus:border-gold/30 disabled:opacity-50"
                           >
                              <option value="USER">User</option>
                              <option value="ADMIN">Admin</option>
                           </select>
                           {updatingId === user.id && <Loader2 className="w-3 h-3 animate-spin inline-block ml-2 text-gold" />}
                </td>
              </motion.tr>
            ))}

                  {!isLoading && !users.length && (
                     <tr>
                        <td colSpan={5} className="p-6 text-sm text-cream/40">No users found for this filter.</td>
                     </tr>
                  )}
          </tbody>
        </table>
      </div>

         <footer className="mt-6 text-xs text-cream/40 font-mono tracking-wider">
            {isLoading ? 'Synchronizing user directory...' : `Loaded ${users.length} users`}
      </footer>
    </AdminLayout>
  );
}
