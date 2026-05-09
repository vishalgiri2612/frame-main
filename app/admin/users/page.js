'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Search, Shield, User as UserIcon } from 'lucide-react';
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
      <header className="mb-8 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Customers</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage user identities and access permissions.</p>
        </div>
      </header>

      {/* Filters */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search users by name or email"
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
          />
        </div>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="block w-full pl-3 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </section>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Activity (Bag/Wish)</th>
                <th className="px-6 py-4 text-center">Purchases</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-zinc-50/80 transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-mono font-medium text-zinc-500">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                        <UserIcon className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-900">{user.name || '-'}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{user.email || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'ADMIN' ? 'text-indigo-700 border-indigo-200 bg-indigo-50' : 'text-zinc-600 border-zinc-200 bg-zinc-100'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {user.role?.toUpperCase() || 'USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1.5" title="Items in Bag">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span className="text-xs font-bold text-zinc-700">{user.stats?.cartCount || 0}</span>
                         </div>
                         <div className="flex items-center gap-1.5" title="Items in Wishlist">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span className="text-xs font-bold text-zinc-700">{user.stats?.wishlistCount || 0}</span>
                         </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-tighter font-mono">Bag / Wish</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center text-center">
                       <div className="text-sm font-bold text-zinc-900">{user.stats?.orderCount || 0}</div>
                       <div className="text-[10px] text-emerald-600 font-mono font-bold">₹{(user.stats?.totalSpent || 0).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.role || 'USER'}
                        onChange={(event) => updateRole(user.id, event.target.value)}
                        disabled={updatingId === user.id}
                        className="block bg-white border border-zinc-300 rounded-md py-1.5 pl-3 pr-8 text-xs font-medium text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50 shadow-sm"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      {updatingId === user.id && <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />}
                    </div>
                  </td>
                </motion.tr>
              ))}

              {!isLoading && !users.length && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <UserIcon className="w-8 h-8 text-zinc-300 mb-3" />
                      <p className="text-sm font-medium text-zinc-900">No users found</p>
                      <p className="text-sm text-zinc-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-6 text-sm text-zinc-500 flex items-center justify-between">
        <span>{isLoading ? 'Synchronizing...' : `Loaded ${users.length} users`}</span>
      </footer>
    </AdminLayout>
  );
}
