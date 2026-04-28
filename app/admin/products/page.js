'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatCurrency } from '@/lib/admin/client';

const DEFAULT_FORM = {
  name: '',
  sku: '',
  brand: '',
  category: '',
  price: '',
  stock: '',
  status: 'ACTIVE',
  image: '',
  description: '',
  featured: false,
};

export default function ProductManagement() {
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, refetch } = useAdminResource('/api/admin/products', {
    q: query,
    brand,
    category,
    status,
    limit: 18,
  });

  const products = useMemo(() => data?.items || [], [data]);
  const isMock = Boolean(data?.isMock);

  const statusSummary = useMemo(() => {
    return products.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      { ACTIVE: 0, DRAFT: 0, ARCHIVED: 0 }
    );
  }, [products]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(DEFAULT_FORM);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      sku: product.sku || '',
      brand: product.brand || '',
      category: product.category || '',
      price: String(product.price ?? ''),
      stock: String(product.stock ?? ''),
      status: product.status || 'ACTIVE',
      image: product.image || '',
      description: product.description || '',
      featured: Boolean(product.featured),
    });
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(DEFAULT_FORM);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (editingProduct) {
        await adminFetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
          }),
        });
      } else {
        await adminFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
          }),
        });
      }

      closeModal();
      await refetch();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id) => {
    const ok = window.confirm('Delete this product permanently?');
    if (!ok) return;

    try {
      await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      await refetch();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout>
      <header className="mb-8 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tighter">Inventory <span className="italic font-serif text-gold">Vault.</span></h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase mt-2">Live Inventory Operations</p>
          {isMock && (
            <p className="mt-2 inline-flex items-center border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-gold">
              Demo feed active
            </p>
          )}
        </div>

        <button
          onClick={openCreate}
          disabled={isMock}
          className="px-8 py-4 bg-gold text-navy font-mono text-[10px] font-bold tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all flex items-center gap-3"
        >
          <Plus className="w-4 h-4" />
          Create Product
        </button>
      </header>

      <section className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-3">
        <label className="lg:col-span-2 relative block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or SKU"
            className="w-full bg-navy-surface border border-gold/10 pl-10 pr-3 py-3 text-sm outline-none focus:border-gold/30"
          />
        </label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="bg-navy-surface border border-gold/10 px-3 py-3 text-sm outline-none focus:border-gold/30"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <select
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          className="bg-navy-surface border border-gold/10 px-3 py-3 text-sm outline-none focus:border-gold/30"
        >
          <option value="">All brands</option>
          {[...new Set(products.map((product) => product.brand).filter(Boolean))].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="bg-navy-surface border border-gold/10 px-3 py-3 text-sm outline-none focus:border-gold/30"
        >
          <option value="">All categories</option>
          {[...new Set(products.map((product) => product.category).filter(Boolean))].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <div className="border border-gold/10 bg-navy-surface px-4 py-3 text-xs text-cream/70 flex items-center justify-between">
          <span>Loaded</span>
          <span className="text-gold font-mono">{isLoading ? '--' : products.length}</span>
        </div>
      </section>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-300 border border-red-500/20 bg-red-500/5 px-3 py-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {['ACTIVE', 'DRAFT', 'ARCHIVED'].map((item) => (
          <div key={item} className="border border-gold/10 bg-navy-surface px-3 py-2 flex items-center justify-between">
            <span className="text-cream/70">{item}</span>
            <span className="text-gold font-mono">{statusSummary[item] || 0}</span>
          </div>
        ))}
      </section>

      <div className="bg-navy-surface border border-gold/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold/10 font-mono text-[10px] tracking-[0.2em] text-cream/60 uppercase bg-navy/40">
              <th className="p-6 font-normal">Asset</th>
              <th className="p-6 font-normal">Status</th>
              <th className="p-6 font-normal">Price</th>
              <th className="p-6 font-normal">Stock</th>
              <th className="p-6 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {products.map((product, i) => {
              const productId = product.id || product._id;
              return (
                <motion.tr
                  key={productId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="group hover:bg-gold/[0.02] transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      {product.image && (
                        <div className="w-10 h-10 border border-gold/10 p-1 flex-shrink-0">
                          <img src={product.image} className="w-full h-full object-contain" alt="" />
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] font-mono tracking-[0.3em] text-gold font-medium uppercase">{product.category}</div>
                        <div className="text-base text-cream font-semibold tracking-tight mt-1">{product.name}</div>
                        <div className="text-[11px] text-cream/60 font-mono mt-1.5">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[9px] font-mono font-bold tracking-[0.1em] uppercase border ${
                      product.status === 'ACTIVE' 
                        ? 'text-teal border-teal/30 bg-teal/5' 
                        : 'text-cream/50 border-gold/10 bg-gold/5'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-6 text-sm font-serif italic text-gold font-medium">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="p-6">
                    <span className={`text-xs font-mono font-medium ${product.stock <= 5 ? 'text-red-400' : 'text-cream/80'}`}>
                      {product.stock ?? 0}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => openEdit(product)} 
                         disabled={isMock}
                         className="p-2 border border-gold/10 text-gold/60 hover:text-gold hover:bg-gold/5 transition-all disabled:opacity-30"
                       >
                         <Pencil size={14} />
                       </button>
                       <button 
                         onClick={() => deleteProduct(productId)} 
                         disabled={isMock}
                         className="p-2 border border-gold/10 text-cream/20 hover:text-red-400 hover:bg-red-950/20 transition-all disabled:opacity-30"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
            
            {!isLoading && !products.length && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-cream/20 font-mono text-[10px] tracking-widest uppercase">
                  No assets found in vault
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-navy-surface border border-gold/20 p-12 shadow-2xl relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-8 right-8 text-gold hover:text-cream transition-colors font-mono text-[10px] tracking-widest px-4 py-2 border border-gold/10"
              >
                CLOSE [×]
              </button>

              <header className="mb-12">
                <h2 className="text-3xl font-light tracking-tighter">{editingProduct ? 'Update' : 'Initialize'} <span className="italic font-serif text-gold">Asset.</span></h2>
                <p className="font-mono text-[8px] tracking-[0.2em] text-cream/40 uppercase mt-2">Inventory Mutation Pipeline</p>
              </header>

              {error && (
                <div className="mb-4 text-sm text-red-300 border border-red-500/20 bg-red-500/5 p-3">{error}</div>
              )}

              <form className="space-y-8" onSubmit={onSubmit}>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Asset Name</label>
                       <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream" placeholder="E.G. THE ARCHITECT" required />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">SKU</label>
                      <input type="text" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value.toUpperCase() })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream" placeholder="VIS-999" required />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Brand</label>
                      <input type="text" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream" placeholder="FRAME HOUSE" required />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Category</label>
                      <input type="text" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value.toUpperCase() })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream" placeholder="TITANIUM" required />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Status</label>
                      <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream uppercase appearance-none cursor-pointer">
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Identity Token</label>
                      <input value={`${form.brand || 'brand'} / ${form.category || 'category'} / ${form.sku || 'sku'}`} readOnly className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none text-cream/50" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Description / Provenance</label>
                    <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream min-h-[100px]" placeholder="SYSTEM LOG DATA..." />
                 </div>

                 <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Price (INR)</label>
                        <input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream" placeholder="12999" required min="0" />
                    </div>
                    <div className="space-y-2">
                       <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Initial Stock</label>
                       <input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream" placeholder="24" required min="0" />
                    </div>
                    <div className="space-y-2">
                       <label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase">Image Path</label>
                       <input type="text" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="w-full bg-navy border border-gold/10 p-4 font-mono text-[10px] tracking-widest outline-none focus:border-gold/40 transition-all text-cream" placeholder="/products/item.png" />
                    </div>
                 </div>

                 <label className="inline-flex items-center gap-3 text-xs text-cream/60">
                   <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
                   Mark as featured item
                 </label>

                 <div className="pt-8 flex gap-4">
                    <button type="submit" disabled={isSubmitting || isMock} className="flex-1 bg-gold text-navy py-5 font-mono text-[10px] font-bold tracking-[0.3em] uppercase hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2">
                      {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                       type="button"
                       onClick={closeModal}
                       className="flex-1 border border-gold/10 text-cream/40 py-5 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-gold/5 transition-all"
                    >
                      Cancel
                    </button>
                 </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
