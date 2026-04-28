'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Package, MapPin, CreditCard, Calendar, ShieldCheck, Download } from 'lucide-react';

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchOrder();
  }, [status, id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/user/orders/${id}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (e) {
      console.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gold/20 border-t-gold animate-spin rounded-full" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center space-y-6">
      <Package className="text-gold/20" size={64} strokeWidth={1} />
      <h2 className="text-2xl font-serif italic text-cream">Order Not Found.</h2>
      <button onClick={() => router.push('/profile')} className="text-gold font-mono text-[10px] tracking-widest uppercase underline underline-offset-8">Return to Profile</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy text-cream pt-32 pb-24 selection:bg-gold selection:text-navy">
      <div className="container mx-auto px-6 max-w-[900px]">
        {/* Navigation */}
        <button 
           onClick={() => router.push('/profile')}
           className="flex items-center gap-3 text-gold/60 hover:text-gold transition-colors font-mono text-[10px] tracking-widest uppercase mb-12"
        >
           <ChevronLeft size={16} /> Back to My Orders
        </button>

        {/* Header Section */}
        <header className="border-b border-gold/10 pb-12 mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-[0.5em] text-gold uppercase">Digital Archive Record</span>
              <h1 className="text-5xl font-serif italic tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-teal/10 text-teal text-[10px] font-mono px-4 py-2 uppercase tracking-widest border border-teal/20">
                {order.status}
              </div>
              <button className="p-3 border border-gold/10 text-gold/60 hover:text-gold hover:bg-gold/5 transition-all rounded-full group">
                 <Download size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-gold/40 uppercase tracking-widest">Transaction Date</p>
              <p className="text-sm font-mono text-cream/80 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-gold/40 uppercase tracking-widest">Payment Method</p>
              <div className="flex items-center gap-2 text-sm font-mono text-cream/80 uppercase">
                <CreditCard size={14} className="text-gold/60" />
                {order.paymentMethod}
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-gold/40 uppercase tracking-widest">Total Value</p>
              <p className="text-lg font-mono text-gold font-black">₹{order.total.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-gold/40 uppercase tracking-widest">Courier Protocol</p>
              <p className="text-sm font-mono text-cream/80 uppercase italic">Blue Dart Premium</p>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Items Section */}
          <div className="md:col-span-12 space-y-8">
            <h3 className="font-mono text-[10px] tracking-[0.5em] text-gold/40 uppercase flex items-center gap-3">
              <Package size={14} /> Curated Acquisitions
            </h3>
            <div className="space-y-4 border border-gold/10 bg-navy-surface/20">
               {order.items.map((item, i) => (
                 <div key={i} className="flex flex-col sm:flex-row items-center gap-8 p-8 border-b border-gold/5 last:border-b-0 hover:bg-gold/5 transition-all group">
                    <div className="w-32 h-20 bg-navy border border-white/5 p-4 flex-shrink-0 relative overflow-hidden">
                       <img 
                         src={item.image} 
                         alt={item.name}
                         className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                       />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                       <h4 className="text-xl font-serif text-cream">{item.name}</h4>
                       <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-[10px] font-mono text-cream/40 uppercase tracking-widest">
                          <span>Qty: {item.quantity}</span>
                          <span>Unit: ₹{item.price.toLocaleString()}</span>
                          <span className="text-gold/60">Brand: {item.brand || 'Bespoke'}</span>
                       </div>
                    </div>
                    <div className="text-xl font-mono text-gold">
                       ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                 </div>
               ))}
            </div>

            {/* Bottom Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
               <div className="bg-navy-surface/30 border border-gold/10 p-8 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase flex items-center gap-2">
                     <MapPin size={14} /> Shipping Destination
                  </h4>
                  <div className="text-sm text-cream/60 font-sans leading-relaxed space-y-1">
                     <p className="font-serif italic text-cream text-lg">{session?.user?.name}</p>
                     <p>Delivery address selected during acquisition.</p>
                     <p className="text-[10px] font-mono uppercase tracking-widest text-gold/40 pt-2 flex items-center gap-2">
                        <ShieldCheck size={12} /> SECURED SHIPMENT PROTOCOL
                     </p>
                  </div>
               </div>

               <div className="bg-navy-surface/30 border border-gold/10 p-8 space-y-6">
                  <h4 className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase flex items-center gap-2">
                     <ShieldCheck size={14} /> Financial Summary
                  </h4>
                  <div className="space-y-3 font-mono text-[10px] tracking-widest uppercase">
                     <div className="flex justify-between text-cream/40">
                        <span>Heritage Value</span>
                        <span>₹{order.total.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-cream/40">
                        <span>GST (18%)</span>
                        <span>INCLUSIVE</span>
                     </div>
                     <div className="flex justify-between text-cream/40">
                        <span>Transport</span>
                        <span className="text-teal">COMPLIMENTARY</span>
                     </div>
                     <div className="pt-3 border-t border-gold/10 flex justify-between text-lg font-serif italic text-gold">
                        <span className="normal-case">Grand Total</span>
                        <span>₹{order.total.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-20 text-center space-y-6 opacity-30">
           <div className="w-12 h-0.5 bg-gold/20 mx-auto" />
           <p className="font-mono text-[8px] tracking-[0.5em] uppercase">Authentic Eyewear Heritage • Established 1987</p>
        </footer>
      </div>
    </div>
  );
}
