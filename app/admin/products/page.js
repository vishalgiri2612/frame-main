'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Eye, Loader2, Package, Pencil, Plus, Search, Trash2, X, ChevronRight } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatCurrency } from '@/lib/admin/client';

const DEFAULT_FORM = {
  name: '',
  sku: '',
  brand: '',
  category: '',
  price: '',
  mrp: '',
  stock: '',
  status: 'ACTIVE',
  image: '',
  description: '',
  featured: false,
  colour: '',
  size: '',
  extraDisc: '',
  images: [],
  // Lens Specific
  visionType: 'Spherical',
  replacementSchedule: 'Daily disposable',
  lensMaterial: 'Silicone hydrogel',
  wearType: 'Daily wear',
  waterContent: '',
  oxygenTransmissibility: '',
  uvBlocking: 'None',
  availableBC: '',
  availableDia: '',
  lensesPerPack: '1',
  eyeSide: 'One eye',
  subscriptionDiscount: '0',
  reorderFrequency: '30, 60, 90',
  // Glass Specific
  architecture: '',
  material: '',
  silhouette: '',
  finish: '',
  lensSweep: '',
  protection: '',
  topSelling: false,
  showcaseLens: false,
  gender: 'UNISEX',
  tags: '',
  newArrival: false,
};

const PRODUCT_CATEGORIES = [
  'SUNGLASSES',
  'EYEGLASSES',
  'COMPUTER GLASSES',
  'READING GLASSES',
  'KIDS GLASSES',
  'CONTACT LENSES',
  'ACCESSORIES',
  'PREMIUM FRAMES',
  'LUXURY',
  'SPORTS'
];

const LENS_BRANDS = [
  'COOPER VISION',
  'BAUSCH + LOMB',
  'JOHNSON & JOHNSON'
];

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState('EYEWEAR'); // 'EYEWEAR' or 'CONTACT_LENSES'
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
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [productType, setProductType] = useState('GLASS'); // 'GLASS' or 'CONTACT_LENS'

  useEffect(() => {
    if (isModalOpen || showTypeSelector) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, showTypeSelector]);

  // Unified resource fetching
  const resourceQuery = useMemo(() => ({
    search: query,
    brand,
    category: activeTab === 'CONTACT_LENSES' ? 'CONTACT LENSES' : category,
    excludeCategory: activeTab === 'EYEWEAR' ? 'CONTACT LENSES' : '',
    status,
    limit: 50,
  }), [query, brand, activeTab, category, status]);

  const { data, isLoading, refetch } = useAdminResource('/api/admin/products', resourceQuery);

  const { data: brandsData } = useAdminResource('/api/admin/brands');
  const availableBrands = brandsData?.items || [];

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

  const openCreate = () => {
    setEditingProduct(null);
    setForm(DEFAULT_FORM);
    setError('');
    setShowTypeSelector(true);
  };

  const handleTypeSelect = (type) => {
    setProductType(type);
    setForm(prev => ({
      ...prev,
      category: type === 'CONTACT_LENS' ? 'CONTACT LENSES' : 'EYEGLASSES'
    }));
    setShowTypeSelector(false);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    const meta = product.lensMetadata || {};
    const type = product.category === 'CONTACT LENSES' ? 'CONTACT_LENS' : 'GLASS';
    setProductType(type);

    setForm({
      ...DEFAULT_FORM,
      name: product.name || '',
      sku: product.sku || '',
      brand: product.brand || '',
      category: product.category || '',
      price: String(product.price ?? ''),
      mrp: String(product.mrp ?? ''),
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
      topSelling: Boolean(product.topSelling),
      showcaseLens: Boolean(product.showcaseLens),
      gender: product.gender || 'UNISEX',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      newArrival: Boolean(product.newArrival),
      // Metadata
      visionType: meta.visionType || 'Spherical',
      replacementSchedule: meta.replacementSchedule || 'Daily disposable',
      lensMaterial: meta.lensMaterial || 'Silicone hydrogel',
      wearType: meta.wearType || 'Daily wear',
      waterContent: meta.waterContent || '',
      oxygenTransmissibility: meta.oxygenTransmissibility || '',
      uvBlocking: meta.uvBlocking || 'None',
      availableBC: Array.isArray(meta.availableBC) ? meta.availableBC.join(', ') : '',
      availableDia: Array.isArray(meta.availableDia) ? meta.availableDia.join(', ') : '',
      lensesPerPack: String(meta.lensesPerPack || '1'),
      eyeSide: meta.eyeSide || 'One eye',
      subscriptionDiscount: String(meta.subscriptionDiscount || '0'),
      reorderFrequency: Array.isArray(meta.reorderFrequency) ? meta.reorderFrequency.join(', ') : '30, 60, 90',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowTypeSelector(false);
    setEditingProduct(null);
    setForm(DEFAULT_FORM);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const lensMetadata = productType === 'CONTACT_LENS' ? {
      visionType: form.visionType,
      replacementSchedule: form.replacementSchedule,
      lensMaterial: form.lensMaterial,
      wearType: form.wearType,
      waterContent: form.waterContent,
      oxygenTransmissibility: form.oxygenTransmissibility,
      uvBlocking: form.uvBlocking,
      availableBC: form.availableBC.split(',').map(s => s.trim()).filter(Boolean),
      availableDia: form.availableDia.split(',').map(s => s.trim()).filter(Boolean),
      lensesPerPack: Number(form.lensesPerPack),
      eyeSide: form.eyeSide,
      subscriptionDiscount: Number(form.subscriptionDiscount),
      reorderFrequency: form.reorderFrequency.split(',').map(s => s.trim()).filter(Boolean),
    } : null;

    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock),
      extraDisc: Number(form.extraDisc),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      lensMetadata
    };

    try {
      if (editingProduct) {
        await adminFetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
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
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Products & Inventory</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage eyewear and contact lens stocks.</p>
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

        {/* Tab Switcher */}
        <div className="flex p-1 bg-zinc-100 rounded-xl w-fit mb-8 border border-zinc-200">
          <button
            onClick={() => { setActiveTab('EYEWEAR'); setCategory(''); }}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'EYEWEAR' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Package className="w-4 h-4" />
            Eyewear
          </button>
          <button
            onClick={() => { setActiveTab('CONTACT_LENSES'); setCategory('CONTACT LENSES'); }}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'CONTACT_LENSES' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Eye className="w-4 h-4" />
            Contact Lenses
          </button>
        </div>

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
              placeholder={`Search ${activeTab.toLowerCase().replace('_', ' ')}...`}
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

          {activeTab === 'EYEWEAR' ? (
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
            >
              <option value="">All Categories</option>
              {PRODUCT_CATEGORIES.filter(c => c !== 'CONTACT LENSES').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          ) : (
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
            >
              <option value="">All Brands</option>
              {LENS_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          )}
        </section>

        {/* Summary Stats */}
        <section className="mb-6 flex gap-4 text-sm overflow-x-auto pb-2">
          <div className="bg-white border border-zinc-200 rounded-lg px-4 py-2 shadow-sm flex items-center gap-3">
            <span className="text-zinc-500 font-medium">Results</span>
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
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Stock</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {products.map((product, i) => {
                  const productId = product.id || product._id;
                  const meta = product.lensMetadata || {};
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
                              {activeTab === 'EYEWEAR' ? <Package className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-semibold text-zinc-900">{product.name}</div>
                              {product.topSelling && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter text-gold ring-1 ring-inset ring-gold/20">
                                  Top 5
                                </span>
                              )}
                              {product.showcaseLens && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter text-blue-600 ring-1 ring-inset ring-blue-500/20">
                                  Showcase
                                </span>
                              )}
                              {product.newArrival && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-600 font-bold">{product.brand}</td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-zinc-500">{product.sku}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-zinc-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-600">
                        {product.stock || '0'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${product.status === 'ACTIVE'
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
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>

      <AnimatePresence>
        {showTypeSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-zinc-900/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <h2 className="text-2xl font-bold text-zinc-900 mb-2 text-center uppercase tracking-tight">Select Category</h2>
              <p className="text-zinc-500 text-center mb-8 text-sm">Choose the type of item you want to add.</p>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleTypeSelect('GLASS')}
                  className="flex items-center gap-4 p-6 rounded-2xl border-2 border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-zinc-900">Eyewear</div>
                    <div className="text-xs text-zinc-500">Sunglasses, Frames, Optical.</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900" />
                </button>

                <button
                  onClick={() => handleTypeSelect('CONTACT_LENS')}
                  className="flex items-center gap-4 p-6 rounded-2xl border-2 border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-zinc-900">Contact Lens</div>
                    <div className="text-xs text-zinc-500">Daily, Monthly, Technical specs.</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900" />
                </button>
              </div>

              <button
                onClick={() => setShowTypeSelector(false)}
                className="mt-8 w-full py-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                Go Back
              </button>
            </motion.div>
          </motion.div>
        )}

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
              className={`w-full ${productType === 'CONTACT_LENS' ? 'max-w-4xl' : 'max-w-2xl'} bg-white rounded-2xl shadow-xl overflow-hidden max-h-[95vh] flex flex-col relative z-[101]`}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-white z-10">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">
                    {editingProduct ? 'Update' : 'Launch'} {productType === 'CONTACT_LENS' ? 'Contact Lens' : 'Eyewear'}
                  </h2>
                  <p className="text-xs text-zinc-500">Configure product details and inventory.</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-zinc-400 hover:text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-full p-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 overflow-y-auto flex-1 min-h-0" data-lenis-prevent>
                {error && <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 text-xs font-bold text-red-600">{error}</div>}

                <form id="product-form" className="space-y-10" onSubmit={onSubmit}>
                  {/* SHARED FIELDS */}
                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                      <span className="w-4 h-px bg-zinc-200" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Product Name *</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder={productType === 'CONTACT_LENS' ? "e.g. Acuvue Oasys" : "e.g. Aviator Gold"} required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Brand *</label>
                        {productType === 'CONTACT_LENS' ? (
                          <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" required>
                            <option value="">Select Brand</option>
                            {LENS_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        ) : (
                          <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" required>
                            <option value="">Select Brand</option>
                            {availableBrands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                          </select>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Model No / SKU *</label>
                        <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Category *</label>
                        {productType === 'CONTACT_LENS' ? (
                          <input type="text" value="CONTACT LENSES" readOnly className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl outline-none text-zinc-500 cursor-not-allowed" />
                        ) : (
                          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" required>
                            <option value="">Select Category</option>
                            {PRODUCT_CATEGORIES.filter(c => c !== 'CONTACT LENSES').map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Gender *</label>
                        <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" required>
                          <option value="UNISEX">Unisex</option>
                          <option value="MAN">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="KIDS">Kids</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* LENS SPECIFIC FIELDS */}
                  {productType === 'CONTACT_LENS' && (
                    <>
                      <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                          <span className="w-4 h-px bg-zinc-200" /> Lens Specifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Vision Type</label>
                            <select value={form.visionType} onChange={(e) => setForm({ ...form, visionType: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none">
                              <option value="Spherical">Spherical</option>
                              <option value="Toric">Toric</option>
                              <option value="Multifocal">Multifocal</option>
                              <option value="Color">Color</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Replacement</label>
                            <select value={form.replacementSchedule} onChange={(e) => setForm({ ...form, replacementSchedule: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none">
                              <option value="Daily disposable">Daily</option>
                              <option value="Bi-weekly disposable">Bi-weekly</option>
                              <option value="Monthly disposable">Monthly</option>
                              <option value="Yearly">Yearly</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Lenses per Pack</label>
                            <input type="number" value={form.lensesPerPack} onChange={(e) => setForm({ ...form, lensesPerPack: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. 30" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Lens Material</label>
                            <input type="text" value={form.lensMaterial} onChange={(e) => setForm({ ...form, lensMaterial: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. Silicone Hydrogel" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Water Content (%)</label>
                            <input type="text" value={form.waterContent} onChange={(e) => setForm({ ...form, waterContent: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. 38%" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">UV Blocking</label>
                            <select value={form.uvBlocking} onChange={(e) => setForm({ ...form, uvBlocking: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none">
                              <option value="None">None</option>
                              <option value="Class 1">Class 1 (90% UVA, 99% UVB)</option>
                              <option value="Class 2">Class 2 (70% UVA, 95% UVB)</option>
                              <option value="Yes">General UV Protection</option>
                            </select>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                          <span className="w-4 h-px bg-zinc-200" /> Parameters & Availability
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Base Curves (Comma sep) *</label>
                            <input type="text" value={form.availableBC} onChange={(e) => setForm({ ...form, availableBC: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="8.5, 8.6" required={productType === 'CONTACT_LENS'} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Diameters (Comma sep) *</label>
                            <input type="text" value={form.availableDia} onChange={(e) => setForm({ ...form, availableDia: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="14.0, 14.2" required={productType === 'CONTACT_LENS'} />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Available Power Range (Text description)</label>
                            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. -0.50 to -10.00 (in 0.25 steps), +0.50 to +6.00" />
                            <p className="text-[10px] text-zinc-400 mt-1 italic">Note: Use this to inform customers about the range you stock.</p>
                          </div>
                        </div>
                      </section>
                    </>
                  )}

                  {/* EYEWEAR SPECIFIC FIELDS */}
                  {productType === 'GLASS' && (
                    <section>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                        <span className="w-4 h-px bg-zinc-200" /> Frame Specifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Primary Material</label>
                          <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. High-Grade Alloy" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Architecture</label>
                          <input type="text" value={form.architecture} onChange={(e) => setForm({ ...form, architecture: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. Rectangular" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Silhouette</label>
                          <input type="text" value={form.silhouette} onChange={(e) => setForm({ ...form, silhouette: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. Minimalist" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Finish</label>
                          <input type="text" value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. Matte / Polished" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Lens Sweep</label>
                          <input type="text" value={form.lensSweep} onChange={(e) => setForm({ ...form, lensSweep: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. 40mm Sweep" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Protection</label>
                          <input type="text" value={form.protection} onChange={(e) => setForm({ ...form, protection: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" placeholder="e.g. UV400 Certified" />
                        </div>
                      </div>
                    </section>
                  )}

                  {/* PRICING & INVENTORY */}
                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                      <span className="w-4 h-px bg-zinc-200" /> Pricing & Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">MRP (₹)</label>
                        <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Selling Price (₹) *</label>
                        <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Stock Units *</label>
                        <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" required />
                      </div>
                    </div>
                  </section>

                  {/* IMAGES */}
                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                      <span className="w-4 h-px bg-zinc-200" /> Media & Visibility
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {productType === 'GLASS' && (
                        <label className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-colors">
                          <input type="checkbox" checked={form.topSelling} onChange={(e) => setForm({ ...form, topSelling: e.target.checked })} className="w-5 h-5 rounded-md border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                          <div className="flex-1">
                            <div className="text-[11px] font-bold text-zinc-900 uppercase">Top 5 Selling</div>
                            <div className="text-[10px] text-zinc-500">Display on Home Page Top Selling scroll.</div>
                          </div>
                        </label>
                      )}

                      {productType === 'CONTACT_LENS' && (
                        <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-100 transition-colors">
                          <input type="checkbox" checked={form.showcaseLens} onChange={(e) => setForm({ ...form, showcaseLens: e.target.checked })} className="w-5 h-5 rounded-md border-blue-300 text-blue-600 focus:ring-blue-600" />
                          <div className="flex-1">
                            <div className="text-[11px] font-bold text-blue-900 uppercase">Showcase on Lens Page</div>
                            <div className="text-[10px] text-blue-500">Feature this lens in the Contact Lens shop section.</div>
                          </div>
                        </label>
                      )}

                      <label className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl cursor-pointer hover:bg-emerald-100 transition-colors">
                        <input type="checkbox" checked={form.newArrival} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} className="w-5 h-5 rounded-md border-emerald-300 text-emerald-600 focus:ring-emerald-600" />
                        <div className="flex-1">
                          <div className="text-[11px] font-bold text-emerald-900 uppercase">Set as New Arrival</div>
                          <div className="text-[10px] text-emerald-500">Display &quot;New Arrival&quot; badge and prioritize in sorting.</div>
                        </div>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {form.images?.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden group">
                          <img src={img} className="w-full h-full object-contain" alt="" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {form.images.length < 5 && (
                        <label className="aspect-square rounded-xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-900 transition-all gap-2 group/upload">
                          {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                          ) : (
                            <>
                              <Plus size={24} className="text-zinc-400 group-hover/upload:text-zinc-900 transition-colors" />
                              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-zinc-400 group-hover/upload:text-zinc-900 transition-colors">Upload the photo</span>
                            </>
                          )}
                          <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </section>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-zinc-200 bg-white flex items-center justify-end gap-4 z-10">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Cancel</button>
                <button type="submit" form="product-form" disabled={isSubmitting || isMock} className="px-10 py-2.5 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 transition-all disabled:opacity-50">
                  {isSubmitting ? 'Syncing...' : (editingProduct ? 'Save Changes' : 'Confirm & Launch')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
