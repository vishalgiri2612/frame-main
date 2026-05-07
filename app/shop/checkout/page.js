'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/providers/CartProvider';
import { MapPin, CreditCard, Smartphone, Building, ChevronLeft, Lock, CheckCircle2, ChevronRight, ShoppingBag, ShieldCheck, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Processing, 4: Success
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    const checkCart = async () => {
       if (cart.length === 0 && status === 'authenticated') {
          await new Promise(r => setTimeout(r, 1000));
          if (cart.length === 0) {
             router.push('/shop');
             return;
          }
       }
       fetchAddresses();
       setIsLoading(false);
    };

    checkCart();
  }, [cart, session, status]);

  const fetchAddresses = async () => {
    const res = await fetch('/api/user/address');
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
      if (data.length > 0) setSelectedAddress(data[0]);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: newAddress }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Address Saved');
        await fetchAddresses();
        setShowAddressForm(false);
        setNewAddress({ label: '', street: '', city: '', state: '', zip: '', country: 'India', isDefault: false });
      } else {
        toast.error(data.error || 'Failed to save address');
      }
    } catch (err) {
      toast.error('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
       toast.error('Please select a delivery address');
       return;
    }
    
    setIsProcessing(true);
    setStep(3);

    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const res = await fetch('/api/user/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: cartTotal,
          addressId: selectedAddress.id,
          paymentMethod: paymentMethod
        })
      });

      if (res.ok) {
        toast.success('Order Placed Successfully!');
        clearCart();
        setStep(4);
        setTimeout(() => router.push('/profile'), 2500);
      } else {
        toast.error('Transaction failed');
        setStep(2);
      }
    } catch (err) {
      toast.error('Connection error');
      setStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
       <div className="w-10 h-10 border-2 border-zinc-200 border-t-zinc-900 animate-spin rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pt-24 pb-24 selection:bg-zinc-200 selection:text-zinc-900">
       <div className="container mx-auto px-6 max-w-[1200px]">
          {/* Header - Systemic Style */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
             <div className="space-y-1">
                <button 
                  onClick={() => router.back()} 
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-[10px] font-bold uppercase tracking-widest mb-2"
                >
                   <ChevronLeft size={14} /> Back to Selection
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Checkout Process</h1>
                <p className="text-sm text-zinc-500">Secure your acquisition with administrative precision.</p>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Security</span>
                   <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full ring-1 ring-inset ring-green-600/20">
                      <Lock size={12} />
                      Encrypted Transaction
                   </span>
                </div>
             </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-12 flex items-center gap-4 max-w-2xl">
             {[
               { id: 1, label: 'Shipping' },
               { id: 2, label: 'Payment' },
               { id: 4, label: 'Confirmation' }
             ].map((s, i) => (
                <div key={s.id} className="flex items-center gap-4 flex-1">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s.id ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white border border-zinc-200 text-zinc-400'
                   }`}>
                      {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${
                      step >= s.id ? 'text-zinc-900' : 'text-zinc-400'
                   }`}>
                      {s.label}
                   </span>
                   {i < 2 && <div className={`flex-1 h-px ${step > s.id ? 'bg-zinc-900' : 'bg-zinc-200'}`} />}
                </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             {/* Left Column: Forms */}
             <div className="lg:col-span-8 space-y-8">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div 
                        key="address"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                         <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                               <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">1. Delivery Destination</h3>
                               {addresses.length > 0 && (
                                  <button 
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest transition-colors flex items-center gap-2"
                                  >
                                     {showAddressForm ? 'Select Existing' : <><Plus size={14} /> Add New Address</>}
                                  </button>
                               )}
                            </div>

                            <div className="p-8">
                               {showAddressForm || addresses.length === 0 ? (
                                  <form onSubmit={handleAddAddress} className="space-y-6">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Label (Home/Work) *</label>
                                           <input 
                                              required 
                                              placeholder="e.g. Primary Residence"
                                              className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                                              value={newAddress.label}
                                              onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                                           />
                                        </div>
                                        <div className="space-y-1.5">
                                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Street Address *</label>
                                           <input 
                                              required 
                                              className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                                              value={newAddress.street}
                                              onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                           />
                                        </div>
                                        <div className="space-y-1.5">
                                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">City *</label>
                                           <input 
                                              required 
                                              className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                                              value={newAddress.city}
                                              onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                           />
                                        </div>
                                        <div className="space-y-1.5">
                                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Postal Code *</label>
                                           <input 
                                              required 
                                              className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-mono"
                                              value={newAddress.zip}
                                              onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                           />
                                        </div>
                                     </div>
                                     <button 
                                        type="submit"
                                        className="w-full bg-zinc-900 text-white py-3.5 rounded-lg text-sm font-bold shadow-lg hover:bg-zinc-800 transition-all"
                                     >
                                        Register & Continue
                                     </button>
                                  </form>
                               ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {addresses.map(addr => (
                                        <button 
                                           key={addr.id}
                                           onClick={() => setSelectedAddress(addr)}
                                           className={`text-left p-5 border rounded-xl transition-all relative group ${
                                              selectedAddress?.id === addr.id 
                                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.02]' 
                                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:shadow-md'
                                           }`}
                                        >
                                           <div className="flex justify-between items-center mb-3">
                                              <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedAddress?.id === addr.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{addr.label}</span>
                                              {selectedAddress?.id === addr.id && <CheckCircle2 size={16} className="text-white" />}
                                           </div>
                                           <div className="space-y-0.5">
                                              <p className="text-sm font-semibold">{addr.street}</p>
                                              <p className={`text-xs ${selectedAddress?.id === addr.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                                 {addr.city}, {addr.state} {addr.zip}
                                              </p>
                                           </div>
                                        </button>
                                     ))}
                                  </div>
                               )}
                            </div>
                         </div>

                         {addresses.length > 0 && !showAddressForm && (
                            <button 
                               disabled={!selectedAddress}
                               onClick={() => setStep(2)}
                               className="w-full bg-zinc-900 text-white py-4 rounded-xl text-sm font-bold shadow-xl hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                               Proceed to Secure Payment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                         )}
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div 
                        key="payment"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                         <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
                               <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">2. Secure Payment Gateway</h3>
                            </div>
                            <div className="p-8 space-y-8">
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {[
                                     { id: 'upi', label: 'UPI Network', sub: 'GPay, PhonePe, Paytm', icon: Smartphone },
                                     { id: 'card', label: 'Bank Cards', sub: 'Visa, Mastercard, Amex', icon: CreditCard },
                                     { id: 'net', label: 'Net Banking', sub: 'All Indian Banks', icon: Building }
                                  ].map(method => (
                                     <button 
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex flex-col items-center justify-center gap-3 p-6 border rounded-xl transition-all ${
                                           paymentMethod === method.id 
                                             ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' 
                                             : 'bg-zinc-50/50 border-zinc-200 text-zinc-600 hover:border-zinc-400'
                                        }`}
                                     >
                                        <method.icon size={24} className={paymentMethod === method.id ? 'text-white' : 'text-zinc-400'} />
                                        <div className="text-center">
                                           <div className="text-[10px] font-bold uppercase tracking-widest">{method.label}</div>
                                           <div className={`text-[9px] mt-1 ${paymentMethod === method.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{method.sub}</div>
                                        </div>
                                     </button>
                                  ))}
                               </div>

                               <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 flex gap-4 items-start">
                                  <ShieldCheck size={20} className="text-zinc-400 flex-shrink-0" />
                                  <p className="text-xs text-zinc-500 leading-relaxed">
                                     Your transaction is protected by industry-standard encryption protocols. We do not store your banking credentials on our local servers.
                                  </p>
                               </div>
                            </div>
                         </div>
                         
                         <button 
                            onClick={handlePlaceOrder}
                            className="w-full bg-zinc-900 text-white py-4 rounded-xl text-sm font-bold shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                         >
                            {cartTotal === 0 ? 'SUBMIT QUOTE REQUEST' : `Complete Acquisition — ₹${cartTotal.toLocaleString()}`}
                         </button>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div 
                        key="processing"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-zinc-200 rounded-2xl py-24 text-center space-y-8 shadow-xl"
                      >
                         <div className="relative inline-block">
                           <div className="w-24 h-24 border-[3px] border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
                           <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                              <Lock size={28} />
                           </div>
                         </div>
                         <div className="space-y-3">
                            <h3 className="text-2xl font-bold tracking-tight">Authorizing Gateway...</h3>
                            <p className="text-zinc-400 text-xs font-medium uppercase tracking-[0.3em] animate-pulse">Establishing Secure Socket Connection</p>
                         </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 text-white rounded-2xl py-24 text-center space-y-10 shadow-2xl relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12">
                            <CheckCircle2 size={240} strokeWidth={1} />
                         </div>
                         <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto flex items-center justify-center ring-8 ring-white/5">
                               <CheckCircle2 size={40} className="text-white" />
                            </div>
                            <div className="space-y-3">
                               <h3 className="text-4xl font-bold tracking-tight">Order Confirmed.</h3>
                               <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">Your acquisition has been officially registered. Preparing for immediate transport.</p>
                            </div>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">Redirecting to Archive Dashboard...</p>
                         </div>
                      </motion.div>
                    )}
                </AnimatePresence>
             </div>

             {/* Right Column: Order Artifacts */}
             <div className="lg:col-span-4">
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden sticky top-24">
                   <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-2">
                      <ShoppingBag size={14} className="text-zinc-400" />
                      <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-900 uppercase">Order Artifacts</h4>
                   </div>
                   
                   <div className="p-8 space-y-6">
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                         {cart.map(item => (
                            <div key={item.id} className="flex gap-4 items-center">
                               <div className="w-16 h-16 bg-zinc-50 rounded-lg p-2 border border-zinc-100 flex-shrink-0">
                                  <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-zinc-900 truncate uppercase">{item.brand}</p>
                                  <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{item.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className="text-[9px] font-bold text-zinc-400 border border-zinc-200 px-1.5 py-0.5 rounded uppercase">{item.quantity} Unit</span>
                                  </div>
                               </div>
                               <p className="text-xs font-bold text-zinc-900">
                                 {item.price === 0 ? 'QUOTE' : `₹${(item.price * item.quantity).toLocaleString()}`}
                               </p>
                            </div>
                         ))}
                      </div>
                      
                      <div className="pt-6 border-t border-zinc-100 space-y-3">
                         <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-zinc-900">{cartTotal === 0 ? 'QUOTE' : `₹${cartTotal.toLocaleString()}`}</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <span>GST (18%)</span>
                            <span className="text-zinc-900 italic">Inclusive</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                         </div>
                          <div className="flex justify-between pt-4 border-t border-zinc-100 items-baseline">
                             <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Total Valuation</span>
                             <span className="text-2xl font-bold text-zinc-900">
                                {cartTotal === 0 ? 'TBD' : `₹${cartTotal.toLocaleString()}`}
                             </span>
                          </div>
                      </div>
                   </div>
                   
                   <div className="bg-zinc-50 px-8 py-4 border-t border-zinc-100">
                      <div className="flex items-center gap-2 text-[8px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                         <ShieldCheck size={12} />
                         Verified Systemic Checkout
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
