'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Pencil, Plus, Search, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { adminFetch } from '@/lib/admin/client';

const DEFAULT_FORM = {
  name: '',
  slug: '',
  year: '',
  count: '',
  image: '',
  accent: '#C9A84C',
  origin: '',
  order: 0,
  status: 'ACTIVE',
  showcase: false,
};

export default function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await adminFetch('/api/admin/brands');
      setBrands(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      setForm(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const openEdit = (brand) => {
    setEditingBrand(brand);
    setForm({
      name: brand.name,
      slug: brand.slug,
      year: brand.year || '',
      count: brand.count || '',
      image: brand.image || '',
      accent: brand.accent || '#C9A84C',
      origin: brand.origin || '',
      order: brand.order || 0,
      status: brand.status || 'ACTIVE',
      showcase: brand.showcase || false,
    });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingBrand(null);
    setForm(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const url = editingBrand ? `/api/admin/brands/${editingBrand.id}` : '/api/admin/brands';
      const method = editingBrand ? 'PATCH' : 'POST';

      await adminFetch(url, {
        method,
        body: JSON.stringify(form),
      });

      await fetchBrands();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBrand = async (id) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      await adminFetch(`/api/admin/brands/${id}`, { method: 'DELETE' });
      setBrands(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Brand Management</h1>
            <p className="text-zinc-500 text-sm">Manage all brands and select 7 for the homepage showcase.</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full border border-zinc-200">
               <div className={`w-2 h-2 rounded-full ${brands.filter(b => b.showcase).length === 7 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                 {brands.filter(b => b.showcase).length} / 7 Homepage Slots
               </span>
            </div>

            <button
              onClick={openAdd}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Brand
            </button>
          </div>
        </header>

        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            <p className="text-zinc-400 text-sm animate-pulse">Loading brands...</p>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">SNO</th>
                  <th className="px-6 py-4">Brand Details</th>
                  <th className="px-6 py-4">Origin</th>
                  <th className="px-6 py-4">Total Styles</th>
                  <th className="px-6 py-4">Homepage Showcase</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredBrands.map((brand, i) => (
                  <motion.tr
                    key={brand.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-zinc-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-mono font-bold text-zinc-400">
                      {(i + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center overflow-hidden p-1.5 shadow-sm">
                          {brand.image ? <img src={brand.image} className="w-full h-full object-contain mix-blend-multiply" alt="" /> : <ImageIcon className="w-4 h-4 text-zinc-300" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900">{brand.name}</div>
                          <div className="text-[10px] text-zinc-400 font-mono tracking-tighter uppercase">{brand.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md uppercase tracking-widest border border-zinc-200">
                        {brand.origin || 'Global'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-900">{brand.count || 0}</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-tighter font-medium">Items Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={async () => {
                          const nextShowcase = !brand.showcase;
                          if (nextShowcase && brands.filter(b => b.showcase).length >= 7) {
                            alert("You can only showcase max 7 brands on the homepage.");
                            return;
                          }
                          await adminFetch(`/api/admin/brands/${brand.id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ showcase: nextShowcase })
                          });
                          await fetchBrands();
                        }}
                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          brand.showcase ? 'bg-zinc-900' : 'bg-zinc-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            brand.showcase ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(brand)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBrand(brand.id)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900">
                    {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Brand Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-sm"
                          placeholder="e.g. Ray-Ban"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Brand Slug *</label>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-sm font-mono"
                          placeholder="e.g. ray-ban"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Establishment Year</label>
                        <input
                          type="text"
                          value={form.year}
                          onChange={(e) => setForm({ ...form, year: e.target.value })}
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-sm"
                          placeholder="e.g. 1937"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Country of Origin</label>
                        <input
                          type="text"
                          value={form.origin}
                          onChange={(e) => setForm({ ...form, origin: e.target.value })}
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-sm"
                          placeholder="e.g. Italy"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Accent Color</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="color"
                          value={form.accent}
                          onChange={(e) => setForm({ ...form, accent: e.target.value })}
                          className="h-10 w-20 border-none bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.accent}
                          onChange={(e) => setForm({ ...form, accent: e.target.value })}
                          className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Showcase Selection</label>
                      <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                        <input
                          type="checkbox"
                          id="showcase-toggle"
                          checked={form.showcase}
                          onChange={(e) => setForm({ ...form, showcase: e.target.checked })}
                          className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                        />
                        <label htmlFor="showcase-toggle" className="text-sm font-medium text-zinc-700 cursor-pointer">
                          Display in Homepage Bento Grid
                        </label>
                      </div>
                      {form.showcase && brands.filter(b => b.showcase && b.id !== editingBrand?.id).length >= 7 && (
                        <p className="text-[10px] text-amber-600 font-bold">
                           ⚠️ You already have 7 brands selected. Please deselect another one for optimal layout.
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Brand Image / Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            placeholder="Enter URL or upload"
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                          />
                        </div>
                        <label className="flex items-center justify-center h-12 px-6 bg-zinc-100 text-zinc-900 rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors">
                          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload'}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-50 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg shadow-zinc-900/10"
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingBrand ? 'Update Brand' : 'Create Brand'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
