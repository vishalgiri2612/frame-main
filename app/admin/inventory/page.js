'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin/client';
import { 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  DollarSign, 
  ArrowRight, 
  Loader2, 
  Info,
  MailWarning,
  EyeOff,
  Star,
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

export default function InventoryDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quick Update State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = async () => {
    try {
      const res = await adminFetch('/api/admin/inventory');
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await adminFetch(`/api/admin/products?search=${val}&limit=5`);
      setSearchResults(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock || 0);
    setIsUpdateModalOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsUpdating(true);
    try {
      await adminFetch(`/api/admin/products/${selectedProduct.id || selectedProduct._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: Number(newStock) }),
      });
      toast.success('Stock updated successfully');
      setIsUpdateModalOpen(false);
      loadData(); // Refresh metrics
    } catch (err) {
      toast.error(err.message || 'Failed to update stock');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-zinc-300" />
          <p className="text-zinc-400 font-medium animate-pulse">Calculating inventory metrics...</p>
        </div>
      </AdminLayout>
    );
  }

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Inventory Management</h1>
            <p className="text-zinc-500">Real-time stock tracking, valuation reports, and sales performance.</p>
          </div>
          
          {/* Quick Search & Add Stock */}
          <div className="relative w-full sm:w-80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search product to add stock..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all shadow-sm"
              />
              {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-zinc-300" />}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-2xl z-50 overflow-hidden py-2">
                {searchResults.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => openUpdateModal(p)}
                    className="w-full px-4 py-3 hover:bg-zinc-50 text-left flex items-center justify-between group transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{p.sku}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-zinc-400">Stock: {p.stock}</span>
                       <div className="p-1.5 bg-zinc-100 rounded-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          <Plus className="w-3 h-3" />
                       </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Top Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Valuation" 
            value={formatCurrency(data.summary.totalValuation)} 
            icon={DollarSign} 
            color="text-emerald-600" 
            bg="bg-emerald-50" 
          />
          <StatCard 
            title="Active Products" 
            value={data.summary.totalProducts} 
            icon={Package} 
            color="text-blue-600" 
            bg="bg-blue-50" 
          />
          <StatCard 
            title="Low Stock Alert" 
            value={data.summary.lowStockCount} 
            icon={AlertTriangle} 
            color="text-amber-600" 
            bg="bg-amber-50" 
            alert={data.summary.lowStockCount > 0}
          />
          <StatCard 
            title="Zero Stock (Alerts On)" 
            value={data.summary.zeroStockCount} 
            icon={MailWarning} 
            color="text-red-600" 
            bg="bg-red-50" 
            alert={data.summary.zeroStockCount > 0}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-zinc-900">Turnover by Brand</h3>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Revenue Potential</span>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.brandTurnover}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="name" fontSize={11} tick={{fill: '#71717a'}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis fontSize={11} tick={{fill: '#71717a'}} axisLine={false} tickLine={false} tickFormatter={(val) => `\u20b9${val/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f8f8f8'}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                    formatter={(val) => formatCurrency(val)}
                  />
                  <Bar dataKey="value" fill="#18181b" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-lg text-zinc-900 mb-8">Stock Health</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.charts.stockHealth}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {data.charts.stockHealth.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-zinc-50 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-zinc-400 mt-0.5" />
              <p className="text-xs text-zinc-500 leading-relaxed">
                Healthy items have over 5 units in stock. Zero stock items are eligible for automatic email notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Reports Section - Full Width */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Bestsellers Report */}
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Star className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-bold text-zinc-900">Bestseller Report</h3>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Product SKU</th>
                    <th className="px-6 py-4 text-right">Units Sold</th>
                    <th className="px-6 py-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {data.bestsellers.map((item) => (
                    <tr key={item._id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-900">{item.name}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">{item._id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2 py-1 bg-zinc-100 rounded-md text-xs font-bold text-zinc-600">{item.totalSold}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-600">
                        {formatCurrency(item.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Drill-down */}
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="font-bold text-zinc-900">Low Stock Drill-down</h3>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Urgent Action</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-right">Current Stock</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {data.lowStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-900">{item.name}</span>
                          <span className="text-[10px] text-zinc-400">{item.brand} \ {item.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {item.stock} Units
                          </span>
                          <button 
                            onClick={() => openUpdateModal(item)}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openUpdateModal(item)}
                          className="p-2 hover:bg-zinc-900 hover:text-white rounded-lg shadow-sm border border-zinc-200 transition-all group"
                        >
                          <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data.lowStockItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 italic text-sm">
                        All items are healthy!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dead Stock Report */}
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-200 rounded-lg">
                  <EyeOff className="w-4 h-4 text-zinc-600" />
                </div>
                <h3 className="font-bold text-zinc-900">Dead Stock Report (30d)</h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No Sales Activity</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-right">Idle Stock</th>
                    <th className="px-6 py-4 text-right">Capital Tied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {data.deadStock.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-900">{item.name}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">{item.sku}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-zinc-600">{item.stock} Units</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-zinc-900">
                        {formatCurrency(item.stock * item.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openUpdateModal(item)}
                          className="p-2 hover:bg-zinc-900 hover:text-white rounded-lg shadow-sm border border-zinc-200 transition-all group"
                        >
                          <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data.deadStock.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 italic text-sm">
                        No dead stock identified.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Quick Stock Update Modal */}
        {isUpdateModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
              onClick={() => setIsUpdateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="font-bold text-zinc-900">Update Stock Level</h3>
                <p className="text-xs text-zinc-500 mt-1">{selectedProduct.name}</p>
              </div>
              <form onSubmit={handleUpdateStock} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Stock Quantity</label>
                  <input 
                    type="number" 
                    autoFocus
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="flex-1 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Stock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, alert }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden group ${alert ? 'ring-2 ring-red-100' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${bg} opacity-30 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2`} />
      <div className="relative z-10 flex flex-col gap-4">
        <div className={`p-3 rounded-2xl ${bg} w-fit`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{title}</p>
          <p className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-zinc-900'}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
