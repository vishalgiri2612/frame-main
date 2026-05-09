'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Search, ShoppingBag, Eye } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatCurrency, formatDate } from '@/lib/admin/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const statusStyles = {
  confirmed: 'text-green-700 border-green-200 bg-green-50',
  PENDING: 'text-amber-700 border-amber-200 bg-amber-50',
  PROCESSING: 'text-blue-700 border-blue-200 bg-blue-50',
  SHIPPED: 'text-indigo-700 border-indigo-200 bg-indigo-50',
  DELIVERED: 'text-zinc-700 border-zinc-200 bg-zinc-100',
  CANCELLED: 'text-red-700 border-red-200 bg-red-50',
};

export default function OrderManagement() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const router = useRouter();

  const { data, isLoading, refetch } = useAdminResource('/api/admin/orders', {
    q: query,
    status,
    limit: 20,
  });

  const orders = data?.items || [];

  const updateOrderStatus = async (id, nextStatus) => {
    setUpdatingId(id);
    setError('');

    try {
      await adminFetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      await refetch();
    } catch (err) {
      setError(err.message || 'Failed to update order');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <AdminLayout>
      <header className="mb-8 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Orders</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage and fulfill customer orders.</p>
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
            placeholder="Search by order number, customer, or email"
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="block w-full pl-3 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-zinc-50/80 transition-colors cursor-pointer group/row"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="px-6 py-4 text-xs font-mono font-medium text-zinc-900">{order.orderNumber || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-zinc-900">{order.customerName || '-'}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{order.customerEmail || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">{order.itemCount || 0} items</td>
                  <td className="px-6 py-4 text-sm font-semibold text-zinc-900">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[order.status] || statusStyles['PENDING']}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors text-zinc-500 hover:text-zinc-900 group"
                        title="View Details"
                      >
                        <Eye size={16} className="group-hover:scale-110 transition-transform" />
                      </Link>
                      <div className="h-4 w-px bg-zinc-200 mx-1" />
                      <div className="flex items-center gap-2">
                      <select
                        value={order.status || 'PENDING'}
                        onChange={(event) => {
                          event.stopPropagation();
                          updateOrderStatus(order.id, event.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        disabled={updatingId === order.id}
                        className="block bg-white border border-zinc-300 rounded-md py-1.5 pl-3 pr-8 text-xs font-medium text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-50 shadow-sm"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                        {updatingId === order.id && <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {!isLoading && !orders.length && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-zinc-300 mb-3" />
                      <p className="text-sm font-medium text-zinc-900">No orders found</p>
                      <p className="text-sm text-zinc-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-zinc-500">
        <span>Showing {orders.length} orders</span>
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
          {isLoading ? 'Syncing...' : 'Live'}
        </span>
      </div>
    </AdminLayout>
  );
}
