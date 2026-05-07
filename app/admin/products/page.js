'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2, Package, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
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
  colour: '',
  size: '',
  extraDisc: '',
  images: [],
  architecture: '',
  material: '',
  silhouette: '',
  finish: '',
  lensSweep: '',
  protection: '',
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
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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
      
      setForm(prev => {
        const newImages = [...(prev.images || [])];
        if (newImages.length < 5) {
          newImages.push(data.url);
        }
        return { 
          ...prev, 
          image: newImages[0] || '', 
          images: newImages 
        };
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        image: newImages[0] || '',
        images: newImages
      };
    });
  };

  const { data, isLoading, refetch } = useAdminResource('/api/admin/products', {
    search: query,
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
      colour: product.colour || '',
      size: product.size || '',
      extraDisc: String(product.extraDisc ?? ''),
      images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
      architecture: product.architecture || '',
      material: product.material || '',
      silhouette: product.silhouette || '',
      finish: product.finish || '',
      lensSweep: product.lensSweep || '',
      protection: product.protection || '',
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
            extraDisc: Number(form.extraDisc),
          }),
        });
      } else {
        await adminFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            extraDisc: Number(form.extraDisc),
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
    <>
      <AdminLayout>
        <header className="mb-8 flex flex-wrap justify-between items-end gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Products</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your inventory, pricing, and availability.</p>
            {isMock && (
              <p className="mt-2 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                Demo feed active
              </p>
            )}
          </div>

          <button
            onClick={openCreate}
            disabled={isMock}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </header>

        {/* Filters */}
        <section className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="block w-full pl-3 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="block w-full pl-3 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
          >
            <option value="">All Categories</option>
            {[...new Set(products.map((product) => product.category).filter(Boolean))].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
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

        {/* Summary Stats */}
        <section className="mb-6 flex gap-4 text-sm overflow-x-auto pb-2">
          <div className="bg-white border border-zinc-200 rounded-lg px-4 py-2 shadow-sm flex items-center gap-3">
            <span className="text-zinc-500 font-medium">All</span>
            <span className="text-zinc-900 font-semibold">{isLoading ? '--' : products.length}</span>
          </div>
          {['ACTIVE', 'DRAFT', 'ARCHIVED'].map((item) => (
            <div key={item} className="bg-white border border-zinc-200 rounded-lg px-4 py-2 shadow-sm flex items-center gap-3">
              <span className="text-zinc-500 font-medium capitalize">{item.toLowerCase()}</span>
              <span className="text-zinc-900 font-semibold">{statusSummary[item] || 0}</span>
            </div>
          ))}
        </section>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-4">SNO</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Brand</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Model No</th>
                  <th className="px-4 py-4">Colour</th>
                  <th className="px-4 py-4">Size</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Extra Disc</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {products.map((product, i) => {
                  const productId = product.id || product._id;
                  return (
                    <motion.tr
                      key={productId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      <td className="px-4 py-4 text-xs font-medium text-zinc-400">
                        {i + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-200 flex-shrink-0 flex items-center justify-center overflow-hidden p-1">
                              <img src={product.image} className="w-full h-full object-contain" alt="" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-200 flex-shrink-0 flex items-center justify-center text-zinc-400">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-600">{product.brand}</td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded">{product.category}</span>
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-zinc-500">{product.sku}</td>
                      <td className="px-4 py-4 text-sm text-zinc-600">{product.colour || '--'}</td>
                      <td className="px-4 py-4 text-sm text-zinc-600">{product.size || '--'}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-zinc-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-600">
                        {product.extraDisc ? `${product.extraDisc}%` : '--'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          product.status === 'ACTIVE' 
                            ? 'text-green-700 border-green-200 bg-green-50' 
                            : product.status === 'DRAFT'
                            ? 'text-amber-700 border-amber-200 bg-amber-50'
                            : 'text-zinc-600 border-zinc-200 bg-zinc-100'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEdit(product)} 
                            disabled={isMock}
                            className="p-2 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors disabled:opacity-30"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(productId)} 
                            disabled={isMock}
                            className="p-2 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                
                {!isLoading && !products.length && (
                  <tr>
                    <td colSpan={11} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package className="w-8 h-8 text-zinc-300 mb-3" />
                        <p className="text-sm font-medium text-zinc-900">No products found</p>
                        <p className="text-sm text-zinc-500 mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col relative z-[101]"
            >
              <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-white z-10">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                  <p className="text-sm text-zinc-500">Provide details for the item below.</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-zinc-400 hover:text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-full p-2 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 min-h-0" data-lenis-prevent>
                {error && (
                  <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form id="product-form" className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Product Name *</label>
                          <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="Classic Aviator" required />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium text-zinc-700">Model No (SKU) *</label>
                         <input type="text" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value.toUpperCase() })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm font-mono" placeholder="AV-100-GLD" required />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium text-zinc-700">Brand *</label>
                         <input type="text" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="Ray-Ban" required />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium text-zinc-700">Category *</label>
                         <input type="text" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value.toUpperCase() })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm uppercase" placeholder="SUNGLASSES" required />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium text-zinc-700">Colour</label>
                         <input type="text" value={form.colour} onChange={(event) => setForm({ ...form, colour: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="Gold / Black" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-sm font-medium text-zinc-700">Size</label>
                         <input type="text" value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="58-14-140" />
                       </div>
                    </div>

                   <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700">Status</label>
                        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm bg-white">
                          <option value="ACTIVE">Active</option>
                          <option value="DRAFT">Draft</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                   </div>

                   <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-700">Product Images (Up to 5) *</label>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          {form.images?.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden group">
                              <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-0 inset-x-0 bg-zinc-900/10 text-[8px] font-bold text-zinc-900 text-center py-0.5 uppercase tracking-tighter">Main</div>
                              )}
                            </div>
                          ))}

                          {(!form.images || form.images.length < 5) && (
                            <div className={`relative aspect-square rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-1 ${isUploading ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400 cursor-pointer'}`}>
                              {isUploading ? (
                                <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="w-5 h-5 text-zinc-400" />
                                  <span className="text-[10px] font-medium text-zinc-500">Add Photo</span>
                                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">First image will be used as the primary display image.</p>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-700">Description</label>
                      <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="Write a short description..." />
                   </div>

                   <div className="border-t border-zinc-100 pt-6">
                     <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Product Specifications</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Architecture</label>
                          <input type="text" value={form.architecture} onChange={(event) => setForm({ ...form, architecture: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="e.g. Rectangular" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Primary Material</label>
                          <input type="text" value={form.material} onChange={(event) => setForm({ ...form, material: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="e.g. High-Grade Alloy" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Silhouette (Design)</label>
                          <input type="text" value={form.silhouette} onChange={(event) => setForm({ ...form, silhouette: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="e.g. Minimalist" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Finish</label>
                          <input type="text" value={form.finish} onChange={(event) => setForm({ ...form, finish: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="e.g. Matte / Polished" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Lens Sweep (Optic)</label>
                          <input type="text" value={form.lensSweep} onChange={(event) => setForm({ ...form, lensSweep: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="e.g. 40mm Sweep" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Protection</label>
                          <input type="text" value={form.protection} onChange={(event) => setForm({ ...form, protection: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="e.g. UV400 Certified" />
                        </div>
                     </div>
                   </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                       <div className="space-y-1.5">
                           <label className="text-sm font-medium text-zinc-700">Amount (INR) *</label>
                           <div className="relative rounded-md shadow-sm">
                             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                               <span className="text-zinc-500 sm:text-sm">₹</span>
                             </div>
                             <input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="block w-full pl-7 pr-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="0.00" required min="0" />
                           </div>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Extra Disc (%)</label>
                          <input type="number" value={form.extraDisc} onChange={(event) => setForm({ ...form, extraDisc: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="0" min="0" max="100" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700">Stock *</label>
                          <input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className="block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm" placeholder="0" required min="0" />
                       </div>
                    </div>

                   <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                     <div className="flex h-5 items-center">
                       <input id="featured" type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                     </div>
                     <div className="text-sm">
                       <label htmlFor="featured" className="font-medium text-zinc-700">Featured Product</label>
                       <p className="text-zinc-500">Highlight this item on the homepage showcase.</p>
                     </div>
                   </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-end gap-3 z-10">
                  <button
                     type="button"
                     onClick={closeModal}
                     className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    form="product-form"
                    disabled={isSubmitting || isMock} 
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-60"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
