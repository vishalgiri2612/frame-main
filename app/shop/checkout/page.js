'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/providers/CartProvider';
import { MapPin, CreditCard, Smartphone, Building, ChevronLeft, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Processing
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
        if (res.status === 401) {
           toast.error('Session expired. Please login again.');
           router.push('/login?callbackUrl=/shop/checkout');
        } else {
           toast.error(data.error || 'Failed to save address');
        }
      }
    } catch (err) {
      toast.error('Connection failed. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Wait for session and cart to be ready
    if (status === 'loading') return;
    
    const checkCart = async () => {
       if (cart.length === 0 && status === 'authenticated') {
          // Double check if cart is really empty after a short delay to allow sync
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

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
       toast.error('Please select a delivery address');
       return;
    }
    
    setIsProcessing(true);
    setStep(3);

    // Mock "Processing" wait
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
        setTimeout(() => router.push('/profile'), 2000);
      } else {
        toast.error('Transaction failed. Please try again.');
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
    <div className="min-h-screen bg-navy flex items-center justify-center">
       <div className="w-12 h-12 border-2 border-gold/20 border-t-gold animate-spin rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-navy pt-32 pb-24 text-cream">
       <div className="container mx-auto px-6 max-w-[1200px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
             <button onClick={() => router.back()} className="flex items-center gap-3 text-gold/60 hover:text-gold transition-colors font-mono text-[10px] tracking-widest uppercase">
                <ChevronLeft size={16} /> Back to Shop
             </button>
             <h1 className="text-4xl font-serif italic text-cream">Checkout.</h1>
             <div className="flex items-center gap-2 text-gold/40 font-mono text-[10px] tracking-widest">
                <Lock size={14} /> SECURE ENCRYPTION
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
             {/* Left Column: Flow */}
             <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.section 
                        key="address"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                      >
                         <div className="flex justify-between items-center border-b border-gold/10 pb-4">
                            <h3 className="text-2xl font-serif italic">1. Delivery Address</h3>
                            {addresses.length > 0 && (
                               <button 
                                 onClick={() => setShowAddressForm(!showAddressForm)}
                                 className="text-gold font-mono text-[10px] tracking-widest uppercase hover:text-white transition-colors"
                               >
                                  {showAddressForm ? 'Back to Selection' : 'Add New Address'}
                               </button>
                            )}
                         </div>

                         {showAddressForm || addresses.length === 0 ? (
                            <form onSubmit={handleAddAddress} className="bg-navy-surface/30 border border-gold/10 p-8 space-y-6">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                     <label className="block font-mono text-[8px] tracking-widest text-gold/40 uppercase">Address Label (Home/Work)</label>
                                     <input 
                                        required 
                                        className="w-full bg-navy border border-gold/20 p-3 text-sm font-mono text-gold outline-none focus:border-gold"
                                        placeholder="E.G. HOME"
                                        value={newAddress.label}
                                        onChange={e => setNewAddress({...newAddress, label: e.target.value.toUpperCase()})}
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="block font-mono text-[8px] tracking-widest text-gold/40 uppercase">Street Address</label>
                                     <input 
                                        required 
                                        className="w-full bg-navy border border-gold/20 p-3 text-sm font-mono text-gold outline-none focus:border-gold"
                                        placeholder="HOUSE NO, STREET, AREA"
                                        value={newAddress.street}
                                        onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="block font-mono text-[8px] tracking-widest text-gold/40 uppercase">City</label>
                                     <input 
                                        required 
                                        className="w-full bg-navy border border-gold/20 p-3 text-sm font-mono text-gold outline-none focus:border-gold"
                                        placeholder="CITY NAME"
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="block font-mono text-[8px] tracking-widest text-gold/40 uppercase">State</label>
                                     <input 
                                        required 
                                        className="w-full bg-navy border border-gold/20 p-3 text-sm font-mono text-gold outline-none focus:border-gold"
                                        placeholder="STATE"
                                        value={newAddress.state}
                                        onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="block font-mono text-[8px] tracking-widest text-gold/40 uppercase">PIN / ZIP Code</label>
                                     <input 
                                        required 
                                        className="w-full bg-navy border border-gold/20 p-3 text-sm font-mono text-gold outline-none focus:border-gold"
                                        placeholder="6-DIGIT PIN"
                                        value={newAddress.zip}
                                        onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                     />
                                  </div>
                               </div>
                               <button 
                                  type="submit"
                                  className="w-full bg-gold text-navy py-4 font-mono text-[10px] font-black tracking-[0.4em] uppercase"
                               >
                                  Save & Continue
                               </button>
                            </form>
                         ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {addresses.map(addr => (
                                  <button 
                                     key={addr.id}
                                     onClick={() => setSelectedAddress(addr)}
                                     className={`text-left p-6 border transition-all ${selectedAddress?.id === addr.id ? 'bg-gold/5 border-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-gold/10 hover:border-gold/30'}`}
                                  >
                                     <div className="flex justify-between items-center mb-2">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-gold font-bold">{addr.label}</span>
                                        {selectedAddress?.id === addr.id && <CheckCircle2 size={16} className="text-gold" />}
                                     </div>
                                     <p className="text-sm text-cream/60 leading-relaxed">
                                        {addr.street}<br />
                                        {addr.city}, {addr.state} {addr.zip}
                                     </p>
                                  </button>
                               ))}
                               <button 
                                  onClick={() => setShowAddressForm(true)}
                                  className="flex flex-col items-center justify-center p-6 border border-dashed border-gold/20 text-gold/40 hover:text-gold hover:border-gold/40 transition-all gap-2"
                               >
                                  <MapPin size={24} strokeWidth={1} />
                                  <span className="font-mono text-[10px] uppercase tracking-widest">Add Another Address</span>
                               </button>
                            </div>
                         )}

                         {addresses.length > 0 && !showAddressForm && (
                            <button 
                               disabled={!selectedAddress}
                               onClick={() => setStep(2)}
                               className="w-full bg-gold text-navy py-5 font-mono text-[10px] font-black tracking-[0.4em] uppercase disabled:opacity-50"
                            >
                               Proceed to Payment
                            </button>
                         )}
                      </motion.section>
                   )}

                   {step === 2 && (
                      <motion.section 
                        key="payment"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                      >
                         <h3 className="text-2xl font-serif italic border-b border-gold/10 pb-4">2. Secure Payment</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                               { id: 'upi', label: 'UPI (GPay/PhonePe)', icon: Smartphone },
                               { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                               { id: 'net', label: 'Net Banking', icon: Building }
                            ].map(method => (
                               <button 
                                  key={method.id}
                                  onClick={() => setPaymentMethod(method.id)}
                                  className={`flex flex-col items-center gap-4 p-8 border transition-all ${paymentMethod === method.id ? 'bg-gold/5 border-gold' : 'border-gold/10 hover:border-gold/30'}`}
                               >
                                  <method.icon size={24} className={paymentMethod === method.id ? 'text-gold' : 'text-gold/40'} />
                                  <span className="font-mono text-[10px] uppercase tracking-widest text-center">{method.label}</span>
                               </button>
                            ))}
                         </div>
                          <button 
                             onClick={handlePlaceOrder}
                             className="w-full bg-gold text-navy py-5 font-mono text-[10px] font-black tracking-[0.4em] uppercase shadow-2xl"
                          >
                             {cartTotal === 0 ? 'SUBMIT QUOTE REQUEST' : `Pay ₹${cartTotal.toLocaleString()}`}
                          </button>
                      </motion.section>
                   )}

                   {step === 3 && (
                      <motion.section 
                        key="processing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-24 text-center space-y-12"
                      >
                         <div className="relative inline-block">
                           <div className="w-32 h-32 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Lock size={32} className="text-gold/40" />
                           </div>
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-3xl font-serif italic">Verifying Transaction...</h3>
                            <p className="text-gold/40 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Communicating with banking servers</p>
                         </div>
                      </motion.section>
                   )}

                   {step === 4 && (
                      <motion.section 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-24 text-center space-y-8"
                      >
                         <div className="w-24 h-24 bg-gold rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                            <CheckCircle2 size={48} className="text-navy" />
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-4xl font-serif italic">Order Confirmed.</h3>
                            <p className="text-cream/60 font-mono text-xs tracking-widest max-w-sm mx-auto">Your acquisition has been registered and is being prepared for transport.</p>
                         </div>
                         <p className="text-gold font-mono text-[10px] tracking-[0.4em] uppercase">Redirecting to Archive...</p>
                      </motion.section>
                   )}
                </AnimatePresence>
             </div>

             {/* Right Column: Summary */}
             <div className="lg:col-span-4 h-fit sticky top-32">
                <div className="bg-navy-surface/30 border border-gold/10 p-10 space-y-8">
                   <h4 className="font-mono text-[10px] tracking-[0.5em] text-gold uppercase border-b border-gold/10 pb-4">Order Summary</h4>
                   <div className="space-y-4">
                      {cart.map(item => (
                         <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-navy p-2 border border-white/5 flex-shrink-0">
                               <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                            </div>
                            <div className="flex-1">
                               <p className="text-sm font-serif italic text-cream leading-tight">{item.name}</p>
                               <p className="text-[10px] font-mono text-gold/40 uppercase mt-1">{item.quantity} UNIT</p>
                            </div>
                             <p className="text-xs font-mono text-gold">
                               {item.price === 0 ? 'QUOTE' : `₹${(item.price * item.quantity).toLocaleString()}`}
                             </p>
                         </div>
                      ))}
                   </div>
                   
                   <div className="pt-8 border-t border-gold/10 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-cream/40 uppercase tracking-widest">
                         <span>Subtotal</span>
                         <span>{cartTotal === 0 ? 'QUOTE' : `₹${cartTotal.toLocaleString()}`}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-cream/40 uppercase tracking-widest">
                         <span>GST (18%)</span>
                         <span>Inclusive</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-cream/40 uppercase tracking-widest">
                         <span>Shipping</span>
                         <span className="text-teal">FREE</span>
                      </div>
                       <div className="flex justify-between pt-4 text-xl font-serif italic text-gold">
                          <span>Total</span>
                          <span>{cartTotal === 0 ? 'TBD' : `₹${cartTotal.toLocaleString()}`}</span>
                       </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
