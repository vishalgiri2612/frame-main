'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Boxes, CircleGauge, Database, DollarSign, RefreshCcw, ShoppingCart, Ticket, Users } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatCurrency, formatDate } from '@/lib/admin/client';

const CHART_DATA = [
  { day: 'Mon', throughput: 32 },
  { day: 'Tue', throughput: 40 },
  { day: 'Wed', throughput: 27 },
  { day: 'Thu', throughput: 48 },
  { day: 'Fri', throughput: 56 },
  { day: 'Sat', throughput: 45 },
  { day: 'Sun', throughput: 50 },
];

export default function AdminDashboard() {
  const [actionError, setActionError] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const { data, error, isLoading, refetch } = useAdminResource('/api/admin/dashboard');

  const cards = useMemo(() => {
    const snapshot = data || {};
    return [
      {
        label: 'Revenue 30D',
        value: formatCurrency(snapshot.revenueSummary?.revenue),
        note: `${snapshot.revenueSummary?.count || 0} confirmed orders`,
        icon: DollarSign,
      },
      {
        label: 'Orders In Queue',
        value: String(snapshot.orderStats?.open || 0),
        note: `${snapshot.orderStats?.total || 0} total tracked`,
        icon: ShoppingCart,
      },
      {
        label: 'Active Products',
        value: String(snapshot.productStats?.byStatus?.ACTIVE || 0),
        note: `${snapshot.productStats?.lowStockCount || 0} low stock`,
        icon: Boxes,
      },
      {
        label: 'Support Queue',
        value: String(snapshot.ticketStats?.queueSize || 0),
        note: `${snapshot.ticketStats?.total || 0} total tickets`,
        icon: Ticket,
      },
      {
        label: 'User Accounts',
        value: String(snapshot.userCount || 0),
        note: 'authenticated operators',
        icon: Users,
      },
    ];
  }, [data]);

  const seedDevData = async () => {
    setIsSeeding(true);
    setActionError('');

    try {
      await adminFetch('/api/admin/seed', { method: 'POST' });
      await refetch();
    } catch (err) {
      setActionError(err.message || 'Failed to seed data');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <AdminLayout>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tighter">Command <span className="italic font-serif text-gold">Center.</span></h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase mt-2">Operational Analytics V.5.0</p>
          {data?.isMock && (
            <p className="mt-2 inline-flex items-center border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-gold">
              Demo feed active
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 border border-gold/20 text-gold text-xs font-mono tracking-widest uppercase hover:bg-gold/5 transition-colors"
          >
            <span className="inline-flex items-center gap-2"><RefreshCcw className="w-3 h-3" />Refresh</span>
          </button>
          <button
            onClick={seedDevData}
            disabled={isSeeding}
            className="px-4 py-2 border border-gold/20 text-gold text-xs font-mono tracking-widest uppercase hover:bg-gold/5 transition-colors disabled:opacity-50"
          >
            {isSeeding ? 'Seeding...' : 'Seed Dev Data'}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 flex items-center gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}
      {actionError && (
        <div className="mb-6 flex items-center gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
        {cards.map((card, index) => (
          <motion.article
            key={card.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-sm border border-gold/10 bg-navy-surface p-5"
          >
            <div className="flex items-start justify-between">
              <p className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase">{card.label}</p>
              <card.icon className="w-4 h-4 text-gold/70" />
            </div>
            <p className="mt-4 text-3xl font-light tracking-tight">{isLoading ? '--' : card.value}</p>
            <p className="mt-2 text-xs text-cream/40">{card.note}</p>
          </motion.article>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 p-6 bg-navy-surface border border-gold/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-light tracking-tight text-cream">Throughput Pulse</h3>
              <p className="font-mono text-[8px] tracking-[0.2em] text-cream/40 uppercase">Request Volume Last 7 Days</p>
            </div>
            <div className="inline-flex items-center gap-2 text-[11px] text-cream/40">
              <CircleGauge className="w-4 h-4 text-gold" />
              p95 target below 200ms
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4AF3715" vertical={false} />
                <XAxis dataKey="day" stroke="#D4AF3740" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#D4AF3740" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0A0E1A', border: '1px solid rgba(212,175,55,0.2)' }} />
                <Area type="monotone" dataKey="throughput" stroke="#D4AF37" fill="url(#colorThroughput)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <aside className="p-6 bg-navy-surface border border-gold/10">
          <h3 className="text-xl font-light tracking-tight text-cream">Live Order Stream</h3>
          <p className="font-mono text-[8px] tracking-[0.2em] text-cream/40 uppercase mt-1 mb-6">Latest 5 Transactions</p>

          <div className="space-y-4">
            {(data?.latestOrders || []).map((order) => (
              <div key={order.id} className="border border-gold/10 bg-navy/20 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-gold">{order.orderNumber}</p>
                  <p className="text-xs text-cream/50">{formatDate(order.createdAt)}</p>
                </div>
                <p className="text-sm mt-1">{order.customerName}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-cream/40">{order.status}</span>
                  <span className="text-gold">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            ))}

            {!isLoading && !data?.latestOrders?.length && (
              <div className="text-sm text-cream/50 border border-gold/10 p-4">No order events yet.</div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gold/10 space-y-3 text-xs text-cream/40">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2"><Database className="w-3 h-3 text-gold" />Data plane</span>
              <span>healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2"><CircleGauge className="w-3 h-3 text-gold" />Cache window</span>
              <span>30s</span>
            </div>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}
