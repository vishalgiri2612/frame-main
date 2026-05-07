'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, 
  Plus, 
  Search, 
  MoreVertical, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Edit3, 
  X,
  Calendar,
  Tag,
  ShoppingBag,
  Percent,
  CircleDollarSign,
  Users
} from 'lucide-react';
import { adminFetch, formatCurrency, formatDate } from '@/lib/admin/client';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: '',
    usageLimit: '',
    expiryDate: '',
    applicableBrands: '',
    applicableCategories: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/api/admin/coupons');
      setCoupons(data);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      applicableBrands: formData.applicableBrands.split(',').map(s => s.trim()).filter(Boolean),
      applicableCategories: formData.applicableCategories.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingCoupon) {
        await adminFetch(`/api/admin/coupons/${editingCoupon._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        await adminFetch('/api/admin/coupons', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      setEditingCoupon(null);
      resetForm();
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to save coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderValue: '',
      usageLimit: '',
      expiryDate: '',
      applicableBrands: '',
      applicableCategories: ''
    });
  };

  const toggleStatus = async (coupon) => {
    const newStatus = coupon.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await adminFetch(`/api/admin/coupons/${coupon._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await adminFetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      usageLimit: coupon.usageLimit || '',
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      applicableBrands: (coupon.applicableBrands || []).join(', '),
      applicableCategories: (coupon.applicableCategories || []).join(', ')
    });
    setIsModalOpen(true);
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Coupon Manager</h1>
          <p className="text-sm text-zinc-500 mt-1">Create and manage promotional discount codes.</p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Coupons</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{coupons.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <PlayCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Now</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{coupons.filter(c => c.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Uses</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0)}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-zinc-500 italic">
                    Loading coupons...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-zinc-500 italic">
                    No coupons found.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded text-xs">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-900">
                          {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                        </span>
                        <span className="text-[10px] text-zinc-500">Min: ₹{coupon.minOrderValue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-700">{coupon.usedCount} used</span>
                        <span className="text-[10px] text-zinc-400">Limit: {coupon.usageLimit || '∞'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        coupon.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500 font-medium">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleStatus(coupon)}
                          title={coupon.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                          className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                          {coupon.status === 'ACTIVE' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => openEditModal(coupon)}
                          className="p-1 text-zinc-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteCoupon(coupon._id)}
                          className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Coupon Code</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. SUMMER20"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-sm font-mono font-bold"
                      disabled={!!editingCoupon}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      className="w-full rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-sm"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (INR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Value</label>
                    <input
                      required
                      type="number"
                      placeholder={formData.discountType === 'PERCENTAGE' ? '20' : '500'}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      className="w-full rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Min Order Value</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                      className="w-full rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Usage Limit</label>
                    <input
                      type="number"
                      placeholder="Unlimited"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Applicable Brands (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Ray-Ban, Oakley (Leave empty for all)"
                    value={formData.applicableBrands}
                    onChange={(e) => setFormData({...formData, applicableBrands: e.target.value})}
                    className="w-full rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Applicable Categories (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Sunglasses, Eyeglasses (Leave empty for all)"
                    value={formData.applicableCategories}
                    onChange={(e) => setFormData({...formData, applicableCategories: e.target.value})}
                    className="w-full rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-sm"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-700 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
