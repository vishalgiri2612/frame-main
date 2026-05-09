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
            <p className="text-zinc-500 text-sm">Curate brands for the homepage showcase.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Brand
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <motion.div
                layout
                key={brand.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="aspect-[16/9] relative bg-zinc-100 flex items-center justify-center p-8">
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} className="w-full h-full object-contain filter drop-shadow-lg" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-zinc-300" />
                  )}
                  <div className="absolute top-4 right-4 px-2 py-1 bg-white/80 backdrop-blur-md rounded-md border border-zinc-200 text-[10px] font-mono font-bold text-zinc-500">
                    EST. {brand.year || 'N/A'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: brand.accent }} />
                      <h3 className="font-bold text-zinc-900">{brand.name}</h3>
                    </div>
                    <span className="text-xs font-medium text-zinc-400">Order: {brand.order}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{brand.count || 0} Styles</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(brand)}
                        className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBrand(brand.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Brand Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Slug (URL)</label>
                        <input
                          type="text"
                          required
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Founding Year</label>
                        <input
                          type="text"
                          placeholder="e.g. 1937"
                          value={form.year}
                          onChange={(e) => setForm({ ...form, year: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Origin / Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Milan, Italy"
                          value={form.origin}
                          onChange={(e) => setForm({ ...form, origin: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Order</label>
                      <input
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      />
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
