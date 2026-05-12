'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ChevronLeft, Package, MapPin, CreditCard, Calendar, ShieldCheck, Download, Truck, CheckCircle2, Clock } from 'lucide-react';
import Image from 'next/image';

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

  const handleDownloadInvoice = () => {
    toast.success('Generating Invoice Archive...');
    setTimeout(() => {
       window.print();
    }, 1000);
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

  const steps = [
    { label: 'Order Placed', status: 'completed', icon: Clock },
    { label: 'Quality Verification', status: order.status !== 'PENDING' ? 'completed' : 'active', icon: ShieldCheck },
    { label: 'Dispatched', status: order.status === 'DELIVERED' || order.status === 'SHIPPED' ? 'completed' : 'pending', icon: Truck },
    { label: 'Delivered', status: order.status === 'DELIVERED' ? 'completed' : 'pending', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-navy text-cream pt-32 pb-24 selection:bg-gold selection:text-navy print:bg-white print:text-black print:pt-0 print:pb-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 20mm; }
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .invoice-card { border: 1px solid #eee !important; background: transparent !important; color: black !important; }
          .text-gold { color: #C9A84C !important; }
          .text-cream { color: black !important; }
          .text-teal { color: #2D6A4F !important; }
          .bg-navy { background: white !important; }
          .bg-navy-surface { background: #f9f9f9 !important; border: 1px solid #eee !important; }
          .border-gold { border-color: #C9A84C !important; }
        }
      `}} />

      <div className="container mx-auto px-6 max-w-[1000px] print:max-w-none print:px-0">
        {/* Print Only Header */}
        <div className="hidden print:block mb-12 border-b-2 border-gold pb-8">
           <div className="flex justify-between items-start">
              <div>
                 <h1 className="text-4xl font-serif italic text-gold">FRAME EYEWEAR</h1>
                 <p className="text-[10px] font-mono tracking-widest uppercase mt-2">Authentic Heritage • Established 1987</p>
                 <div className="mt-6 text-[11px] space-y-1 text-zinc-500 font-sans">
                    <p>Luxury Optical Archive, HQ-01</p>
                    <p>Industrial Area, New Delhi, India</p>
                    <p>Contact: +91 99999 88888 | support@frame.com</p>
                 </div>
              </div>
              <div className="text-right">
                 <h2 className="text-2xl font-serif italic">OFFICIAL INVOICE</h2>
                 <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">Order ID: #{order._id.toUpperCase()}</p>
              </div>
           </div>
        </div>

        {/* Navigation */}
        <button 
           onClick={() => router.push('/profile')}
           className="flex items-center gap-3 text-gold/60 hover:text-gold transition-colors font-mono text-[10px] tracking-widest uppercase mb-12 no-print"
        >
           <ChevronLeft size={16} /> Back to My Orders
        </button>

        {/* Header Section */}
        <header className="border-b border-gold/10 pb-12 mb-12 space-y-8 print:border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-[0.5em] text-gold uppercase print:text-zinc-400">Digital Archive Record</span>
              <h1 className="text-5xl font-serif italic tracking-tight print:text-3xl print:not-italic print:font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
            </div>
            <div className="flex items-center gap-4 no-print">
              <div className={`text-[10px] font-mono px-4 py-2 uppercase tracking-widest border ${
                order.status === 'DELIVERED' ? 'bg-teal/10 text-teal border-teal/20' : 'bg-gold/10 text-gold border-gold/20'
              }`}>
                {order.status}
              </div>
              <button 
                onClick={handleDownloadInvoice}
                className="p-3 border border-gold/10 text-gold/60 hover:text-gold hover:bg-gold/5 transition-all rounded-full group"
                title="Download Invoice PDF"
              >
                 <Download size={18} />
              </button>
            </div>
            {/* Print Status */}
            <div className="hidden print:block text-right">
               <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Status:</span>
               <p className="text-sm font-bold uppercase tracking-widest">{order.status}</p>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="py-8 px-4 bg-navy-surface/20 border border-gold/5 rounded-xl no-print">
             <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gold/10 -translate-y-1/2" />
                {steps.map((step, idx) => (
                   <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                        step.status === 'completed' ? 'bg-gold text-navy border-gold' : 
                        step.status === 'active' ? 'bg-navy border-gold text-gold animate-pulse shadow-[0_0_15px_rgba(201,168,76,0.3)]' : 
                        'bg-navy border-gold/20 text-gold/20'
                      }`}>
                         <step.icon size={18} />
                      </div>
                      <span className={`text-[8px] font-mono tracking-widest uppercase ${
                        step.status === 'completed' ? 'text-gold' : 
                        step.status === 'active' ? 'text-cream' : 
                        'text-gold/20'
                      }`}>{step.label}</span>
                   </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 print:gap-4">
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-gold/40 uppercase tracking-widest print:text-zinc-400">Transaction Date</p>
              <p className="text-sm font-mono text-cream/80 uppercase print:text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-gold/40 uppercase tracking-widest print:text-zinc-400">Payment Method</p>
              <div className="flex items-center gap-2 text-sm font-mono text-cream/80 uppercase print:text-black">
                <CreditCard size={14} className="text-gold/60 no-print" />
                {order.paymentMethod}
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-gold/40 uppercase tracking-widest print:text-zinc-400">Total Value</p>
              <p className="text-lg font-mono text-gold font-black print:text-black">₹{order.total.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-gold/40 uppercase tracking-widest print:text-zinc-400">Courier Protocol</p>
              <p className="text-sm font-mono text-cream/80 uppercase italic print:text-black print:not-italic">Blue Dart Premium</p>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 print:gap-8">
          {/* Items Section */}
          <div className="md:col-span-12 space-y-8">
            <h3 className="font-mono text-[10px] tracking-[0.5em] text-gold/40 uppercase flex items-center gap-3 print:text-zinc-400">
              <Package size={14} className="no-print" /> Curated Acquisitions
            </h3>
            <div className="space-y-4 border border-gold/10 bg-navy-surface/20 overflow-hidden rounded-xl print:border-zinc-100 print:rounded-none">
               {order.items.map((item, i) => (
                 <div key={i} className="flex flex-col sm:flex-row items-center gap-8 p-8 border-b border-gold/5 last:border-b-0 hover:bg-gold/5 transition-all group print:gap-4 print:p-4 print:border-zinc-100">
                    <div className="w-32 h-20 bg-navy border border-white/5 p-4 flex-shrink-0 relative print:bg-white print:border-zinc-100">
                       <Image 
                         src={item.image} 
                         alt={item.name}
                         fill
                         sizes="128px"
                         className="object-contain p-2 group-hover:scale-110 transition-transform duration-700 print:scale-100" 
                       />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                       <h4 className="text-xl font-serif text-cream print:text-lg print:font-bold print:font-sans">{item.name}</h4>
                       <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-[10px] font-mono text-cream/40 uppercase tracking-widest print:text-zinc-500">
                          <span>Qty: {item.quantity}</span>
                          <span>Unit: ₹{item.price.toLocaleString()}</span>
                          <span className="text-gold/60 print:text-zinc-500">Brand: {item.brand || 'Bespoke'}</span>
                       </div>
                    </div>
                    <div className="text-xl font-mono text-gold print:text-black print:font-bold">
                       ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                 </div>
               ))}
            </div>

            {/* Bottom Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 print:pt-4">
               <div className="bg-navy-surface/30 border border-gold/10 p-8 space-y-4 rounded-xl print:bg-zinc-50 print:border-zinc-200 print:rounded-none">
                  <h4 className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase flex items-center gap-2 print:text-zinc-500">
                     <MapPin size={14} className="no-print" /> Shipping Destination
                  </h4>
                  <div className="text-sm text-cream/60 font-sans leading-relaxed space-y-1 print:text-black">
                     <p className="font-serif italic text-cream text-lg print:not-italic print:font-bold print:text-sm">{session?.user?.name}</p>
                     <p className="text-[11px] leading-relaxed">
                        {order.shippingAddress?.street || 'Primary Account Address'}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                     </p>
                     <p className="text-[10px] font-mono uppercase tracking-widest text-gold/40 pt-4 flex items-center gap-2 no-print">
                        <ShieldCheck size={12} /> SECURED SHIPMENT PROTOCOL
                     </p>
                  </div>
               </div>

               <div className="bg-navy-surface/30 border border-gold/10 p-8 space-y-6 rounded-xl print:bg-zinc-50 print:border-zinc-200 print:rounded-none">
                  <h4 className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase flex items-center gap-2 print:text-zinc-500">
                     <ShieldCheck size={14} className="no-print" /> Financial Summary
                  </h4>
                  <div className="space-y-3 font-mono text-[10px] tracking-widest uppercase print:text-zinc-600">
                     <div className="flex justify-between text-cream/40 print:text-zinc-500">
                        <span>Heritage Value</span>
                        <span>₹{order.total.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-cream/40 print:text-zinc-500">
                        <span>GST (18%)</span>
                        <span>INCLUSIVE</span>
                     </div>
                     <div className="flex justify-between text-cream/40 print:text-zinc-500">
                        <span>Transport</span>
                        <span className="text-teal">COMPLIMENTARY</span>
                     </div>
                     <div className="pt-3 border-t border-gold/10 flex justify-between text-lg font-serif italic text-gold print:text-black print:font-bold print:text-xl print:not-italic">
                        <span className="normal-case">Grand Total</span>
                        <span>₹{order.total.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-20 text-center space-y-6 opacity-30 print:opacity-100 print:mt-12">
           <div className="w-12 h-0.5 bg-gold/20 mx-auto print:bg-zinc-200" />
           <p className="font-mono text-[8px] tracking-[0.5em] uppercase print:text-zinc-400">Authentic Eyewear Heritage • Established 1987</p>
           <div className="hidden print:block text-[8px] text-zinc-300 font-sans mt-4">
              This is a computer-generated document. No signature required.
           </div>
        </footer>
      </div>
    </div>
  );
}
