'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from 'recharts';
import { AlertTriangle, Boxes, CircleGauge, Database, DollarSign, RefreshCcw, ShoppingCart, Ticket, Users, TrendingUp, Package, BarChart3 } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatCurrency, formatDate } from '@/lib/admin/client';

export default function AdminDashboard() {
  const [actionError, setActionError] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const { data, error, isLoading, refetch } = useAdminResource('/api/admin/dashboard');

  const stats = useMemo(() => {
    const snapshot = data || {};
    return {
      revenue: [
        { label: 'Today', value: formatCurrency(snapshot.revenueStats?.today || 0) },
        { label: 'Week', value: formatCurrency(snapshot.revenueStats?.week || 0) },
        { label: 'Month', value: formatCurrency(snapshot.revenueStats?.month || 0) },
        { label: 'All Time', value: formatCurrency(snapshot.revenueStats?.allTime || 0) },
      ],
      orders: [
        { label: 'Today', value: snapshot.orderStats?.today || 0 },
        { label: 'Week', value: snapshot.orderStats?.week || 0 },
        { label: 'Month', value: snapshot.orderStats?.month || 0 },
        { label: 'Total', value: snapshot.orderStats?.total || 0 },
      ],
      inventory: [
        { label: 'Active', value: snapshot.productStats?.byStatus?.ACTIVE || 0 },
        { label: 'Low Stock', value: snapshot.productStats?.lowStockCount || 0, isAlert: (snapshot.productStats?.lowStockCount > 0) },
      ]
    };
  }, [data]);

  const cards = useMemo(() => {
    const snapshot = data || {};
    return [
      {
        label: 'Total Revenue',
        value: formatCurrency(snapshot.revenueStats?.allTime || 0),
        note: `₹${(snapshot.revenueStats?.today || 0).toLocaleString()} today`,
        icon: DollarSign,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
      },
      {
        label: 'Orders',
        value: String(snapshot.orderStats?.total || 0),
        note: `${snapshot.orderStats?.today || 0} placed today`,
        icon: ShoppingCart,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      },
      {
        label: 'Low Stock',
        value: String(snapshot.productStats?.lowStockCount || 0),
        note: 'Requires attention',
        icon: AlertTriangle,
        color: snapshot.productStats?.lowStockCount > 0 ? 'text-amber-600' : 'text-zinc-400',
        bg: snapshot.productStats?.lowStockCount > 0 ? 'bg-amber-50' : 'bg-zinc-50'
      },
      {
        label: 'Support',
        value: String(snapshot.ticketStats?.queueSize || 0),
        note: 'Active tickets',
        icon: Ticket,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
      },
      {
        label: 'Customers',
        value: String(snapshot.userCount || 0),
        note: 'Registered users',
        icon: Users,
        color: 'text-zinc-600',
        bg: 'bg-zinc-50'
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard Overview</h1>
          <p className="text-sm text-zinc-500 mt-1">Real-time store performance and logistics.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 transition-all"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={seedDevData}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {isSeeding ? 'Seeding...' : 'Seed Data'}
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 tracking-tight">
              {isLoading ? <span className="inline-block w-20 h-8 bg-zinc-100 rounded animate-pulse" /> : card.value}
            </p>
            <p className="text-xs text-zinc-500 mt-1 font-medium">{card.note}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Revenue Trend
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Performance over the last 30 days</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-zinc-900">{formatCurrency(data?.revenueStats?.month || 0)}</p>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">Last 30 Days</p>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.salesTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="date" 
                  stroke="#a1a1aa" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                  dy={10}
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#059669', fontWeight: 700, fontSize: '12px' }}
                  labelStyle={{ fontSize: '10px', color: '#71717a', marginBottom: '4px', fontWeight: 600 }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fill="url(#colorRevenue)" 
                  strokeWidth={3} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top Brands Chart */}
        <section className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Brand Performance
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Top selling by volume</p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.topBrands || []} layout="vertical" margin={{ left: -10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f4f4f5" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="brand" 
                  type="category" 
                  stroke="#71717a" 
                  fontSize={11} 
                  width={80}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e4e4e7' }}
                />
                <Bar dataKey="unitsSold" radius={[0, 4, 4, 0]} barSize={20}>
                  {(data?.topBrands || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Recent Transactions</h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All Orders</button>
          </div>
          
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {(data?.latestOrders || []).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors cursor-default">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-zinc-900">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-zinc-700">{order.customerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-zinc-900">{formatCurrency(order.totalAmount)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Low Stock Alerts */}
        <section className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              Low Stock
            </h3>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">
              {data?.productStats?.lowStockCount || 0} Alerts
            </span>
          </div>

          <div className="space-y-4">
            {(data?.productStats?.lowStockItems || []).map((item) => (
              <div key={item.id} className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/30 flex items-center justify-between group hover:border-amber-200 transition-all">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-zinc-900 truncate">{item.name}</p>
                  <p className="text-[10px] font-mono text-zinc-400 mt-0.5 uppercase tracking-tighter">{item.sku}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className={`text-sm font-bold ${item.stock <= 2 ? 'text-red-600' : 'text-amber-600'}`}>
                    {item.stock} left
                  </p>
                  <div className="mt-1.5 w-12 h-1 bg-zinc-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.stock <= 2 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${(item.stock / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {!data?.productStats?.lowStockItems?.length && (
              <div className="py-12 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-zinc-50 mb-4">
                  <Boxes className="w-6 h-6 text-zinc-300" />
                </div>
                <p className="text-sm font-bold text-zinc-400">Inventory levels healthy</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

