'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Search } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatCurrency, formatDate } from '@/lib/admin/client';

const statusStyles = {
  confirmed: 'text-teal border-teal/30 bg-teal/10',
  PENDING: 'text-gold border-gold/30 bg-gold/10',
  PROCESSING: 'text-blue-300 border-blue-300/30 bg-blue-300/10',
  SHIPPED: 'text-teal border-teal/30 bg-teal/10',
  DELIVERED: 'text-cream border-cream/20 bg-cream/5',
  CANCELLED: 'text-red-300 border-red-300/30 bg-red-300/10',
};

export default function OrderManagement() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');

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
          <h1 className="text-4xl font-light tracking-tighter">Order <span className="italic font-serif text-gold">Registry.</span></h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase mt-2">Live Fulfillment Control</p>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="md:col-span-2 relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search by order number, customer, or email"
            className="w-full bg-navy-surface border border-gold/10 px-10 py-3 text-sm outline-none focus:border-gold/30"
          />
        </label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="bg-navy-surface border border-gold/10 px-3 py-3 text-sm outline-none focus:border-gold/30"
        >
          <option value="">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
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
            <tr className="border-b border-gold/10 font-mono text-[10px] tracking-[0.2em] text-cream/60 uppercase bg-navy/40">
              <th className="p-6 font-normal">Order</th>
              <th className="p-6 font-normal">Customer</th>
              <th className="p-6 font-normal">Payload</th>
              <th className="p-6 font-normal">Value</th>
              <th className="p-6 font-normal">Status</th>
              <th className="p-6 font-normal">Created</th>
              <th className="p-6 font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {orders.map((order, i) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group hover:bg-gold/[0.02] transition-colors"
              >
                <td className="p-6 text-xs font-mono tracking-widest text-gold">{order.orderNumber || '-'}</td>
                <td className="p-6 text-sm font-light">
                  <div>{order.customerName || '-'}</div>
                  <div className="text-[11px] text-cream/40 mt-1">{order.customerEmail || '-'}</div>
                </td>
                <td className="p-6 text-xs font-mono text-cream/40 uppercase">{order.itemCount || 0} ITEMS</td>
                <td className="p-6 text-sm font-serif italic text-gold">{formatCurrency(order.totalAmount)}</td>
                <td className="p-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full border text-[8px] font-mono tracking-widest uppercase ${statusStyles[order.status]}`}>
                    {order.status}
                  </div>
                </td>
                <td className="p-6 text-xs text-cream/40">{formatDate(order.createdAt)}</td>
                <td className="p-6">
                  <select
                    value={order.status || 'PENDING'}
                    onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                    disabled={updatingId === order.id}
                    className="bg-navy border border-gold/10 px-2 py-1 text-xs outline-none focus:border-gold/30 disabled:opacity-50"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  {updatingId === order.id && <Loader2 className="w-3 h-3 animate-spin inline-block ml-2 text-gold" />}
                </td>
              </motion.tr>
            ))}

            {!isLoading && !orders.length && (
              <tr>
                <td className="p-6 text-sm text-cream/40" colSpan={7}>No orders found for current filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-between items-center font-mono text-[9px] text-cream/30 uppercase tracking-widest">
        <span>Showing {orders.length} operational orders</span>
        <span className="text-gold">{isLoading ? 'syncing' : 'live'}</span>
      </div>
    </AdminLayout>
  );
}
