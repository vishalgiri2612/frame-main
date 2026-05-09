'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Pencil, Plus, Search, Trash2, X, Image as ImageIcon, Monitor } from 'lucide-react';
import { adminFetch } from '@/lib/admin/client';

const DEFAULT_FORM = {
  src: '',
  frameImg: '',
  frameName: '',
  frameLink: '/shop',
  theme: 'rgba(212,175,55,0.4)',
  badge: '',
  titleTop: '',
  titleItalic: '',
  sub: '',
  order: 0,
  status: 'ACTIVE',
};

export default function HeroManagement() {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const data = await adminFetch('/api/admin/hero');
      setSlides(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e, field) => {
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
      
      setForm(prev => ({ ...prev, [field]: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const openEdit = (slide) => {
    setEditingSlide(slide);
    setForm({
      src: slide.src || '',
      frameImg: slide.frameImg || '',
      frameName: slide.frameName || '',
      frameLink: slide.frameLink || '/shop',
      theme: slide.theme || 'rgba(212,175,55,0.4)',
      badge: slide.badge || '',
      titleTop: slide.titleTop || '',
      titleItalic: slide.titleItalic || '',
      sub: slide.sub || '',
      order: slide.order || 0,
      status: slide.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingSlide(null);
    setForm(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const url = editingSlide ? `/api/admin/hero/${editingSlide.id}` : '/api/admin/hero';
      const method = editingSlide ? 'PATCH' : 'POST';

      await adminFetch(url, {
        method,
        body: JSON.stringify(form),
      });

      await fetchSlides();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSlide = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      await adminFetch(`/api/admin/hero/${id}`, { method: 'DELETE' });
      setSlides(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Hero Section Management</h1>
            <p className="text-zinc-500 text-sm">Control the landing page background images and promotional content.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Slide
          </button>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            <p className="text-zinc-400 text-sm animate-pulse">Loading slides...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {slides.map((slide) => (
              <motion.div
                layout
                key={slide.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all group p-6"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Preview Section */}
                  <div className="w-full lg:w-1/3 space-y-4">
                    <div className="aspect-[16/9] relative rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner group-hover:shadow-lg transition-shadow">
                      <img src={slide.src} alt="Background" className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
                      
                      {/* Premium Mini Frame Preview */}
                      <div className="absolute bottom-3 right-3 w-28 h-20 bg-[#f8f8f8] rounded border border-white/10 shadow-2xl flex items-center justify-center p-2 overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${slide.theme} 0%, transparent 70%)` }} />
                        {/* Gold Corners */}
                        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#D4AF37]/60 z-20" />
                        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#D4AF37]/60 z-20" />
                        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#D4AF37]/60 z-20" />
                        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#D4AF37]/60 z-20" />
                        
                        <img 
                          src={slide.frameImg} 
                          alt="Frame" 
                          className="w-full h-full object-contain relative z-10 mix-blend-multiply scale-125 transition-transform group-hover:scale-[1.35]" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                       <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Order: {slide.order}</span>
                       <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slide.theme }} />
                         <span className="text-[10px] font-mono text-zinc-400">{slide.theme}</span>
                       </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded">{slide.badge}</span>
                      </div>
                      <h3 className="text-2xl font-serif text-zinc-900 mb-2">
                        {slide.titleTop} <span className="italic text-zinc-500">{slide.titleItalic}</span>
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2 italic">&quot;{slide.sub}&quot;</p>
                      <p className="text-xs text-zinc-400 mt-4 font-mono">Frame: {slide.frameName}</p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 mt-6">
                      <button
                        onClick={() => openEdit(slide)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 text-sm font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Slide
                      </button>
                      <button
                        onClick={() => deleteSlide(slide.id)}
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
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900">
                    {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-8">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Image Uploads */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Main Background Image</label>
                          <div className="flex items-center gap-4">
                            <input
                              type="text"
                              value={form.src}
                              onChange={(e) => setForm({ ...form, src: e.target.value })}
                              placeholder="URL"
                              className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                            />
                            <label className="flex items-center justify-center h-12 w-12 bg-zinc-100 rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors">
                              <ImageIcon className="w-5 h-5" />
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'src')} />
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Small Product Image (Bottom Right)</label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-4">
                                <input
                                  type="text"
                                  value={form.frameImg}
                                  onChange={(e) => setForm({ ...form, frameImg: e.target.value })}
                                  placeholder="URL"
                                  className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                                />
                                <label className="flex items-center justify-center h-12 w-12 bg-zinc-100 rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors">
                                  <ImageIcon className="w-5 h-5" />
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'frameImg')} />
                                </label>
                              </div>
                            </div>
                            
                            {/* Live Preview for Small Frame */}
                            {form.frameImg && (
                              <div className="w-32 h-24 bg-[#f8f8f8] rounded-xl border border-zinc-200 shadow-xl flex items-center justify-center p-3 relative overflow-hidden flex-shrink-0">
                                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${form.theme} 0%, transparent 70%)` }} />
                                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/50 z-20" />
                                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/50 z-20" />
                                <img src={form.frameImg} alt="Preview" className="w-full h-full object-contain relative z-10 mix-blend-multiply scale-150" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Order</label>
                             <input type="number" value={form.order} onChange={(e) => setForm({...form, order: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Theme Color (RGBA)</label>
                             <input type="text" value={form.theme} onChange={(e) => setForm({...form, theme: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono" />
                           </div>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Upper Badge Text</label>
                          <input type="text" value={form.badge} onChange={(e) => setForm({...form, badge: e.target.value})} placeholder="e.g. ESTABLISHED 1987 / LUXURY" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Title (Top)</label>
                            <input type="text" value={form.titleTop} onChange={(e) => setForm({...form, titleTop: e.target.value})} placeholder="SEE THE" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Title (Italic)</label>
                            <input type="text" value={form.titleItalic} onChange={(e) => setForm({...form, titleItalic: e.target.value})} placeholder="UNSEEN." className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm italic" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                          <textarea rows={3} value={form.sub} onChange={(e) => setForm({...form, sub: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Frame Info & Link</label>
                          <div className="flex gap-4">
                            <input type="text" value={form.frameName} onChange={(e) => setForm({...form, frameName: e.target.value})} placeholder="Frame Name" className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm" />
                            <input type="text" value={form.frameLink} onChange={(e) => setForm({...form, frameLink: e.target.value})} placeholder="/shop/..." className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-50 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg shadow-zinc-900/10"
                      >
                        {(isSubmitting || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingSlide ? 'Update Slide' : 'Create Slide'}
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
