'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, MapPin, Package, Settings, LogOut, Plus, Trash2, ShieldCheck, Map } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session) {
      fetchAddresses();
    }
  }, [status, session]);

  const fetchAddresses = async () => {
    const res = await fetch('/api/user/address');
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: newAddress }),
      });

      if (res.ok) {
        toast.success('Coordinate Set Stored');
        await fetchAddresses();
        setShowAddressForm(false);
        setNewAddress({ label: '', street: '', city: '', state: '', zip: '', country: 'India', isDefault: false });
      }
    } catch (e) {
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await fetch(`/api/user/address?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Coordinate Removed');
        await fetchAddresses();
      }
    } catch (e) {
      toast.error('Failed to delete address');
    }
  };

  if (status === 'loading') return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gold/20 border-t-gold animate-spin rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-navy text-cream pt-32 pb-24 selection:bg-gold selection:text-navy">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(166,138,59,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <main className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-[10px] tracking-[0.5em] text-gold uppercase flex items-center gap-4"
            >
              <div className="w-3 h-3 bg-teal rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.4)]" />
              Authenticated Session
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-serif italic text-cream tracking-tight">Account.</h1>
          </div>
          
          <button 
             onClick={() => signOut({ callbackUrl: '/' })}
             className="flex items-center gap-4 bg-navy-surface/30 border border-gold/10 px-8 py-4 font-mono text-[10px] tracking-[0.4em] uppercase hover:bg-red-950/20 hover:border-red-500/30 transition-all text-cream/60 hover:text-red-400 group"
          >
            TERMINATE SESSION
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* NAV */}
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: User, label: 'My Profile' },
              { id: 'orders', icon: Package, label: 'My Orders' },
              { id: 'address', icon: MapPin, label: 'My Addresses' },
              { id: 'security', icon: ShieldCheck, label: 'Security' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-5 font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-500 border-l-2 ${
                  activeTab === tab.id ? 'bg-gold/5 border-gold text-gold font-black' : 'border-transparent text-cream/40 hover:text-gold hover:bg-gold/5'
                }`}
              >
                <tab.icon size={18} strokeWidth={1} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* CONTENT */}
          <div className="lg:col-span-3 min-h-[500px]">
             <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-navy-surface/20 border border-gold/10 p-10 space-y-4">
                          <span className="font-mono text-[9px] tracking-[0.4em] text-gold/40 uppercase">Profile Info</span>
                          <h3 className="text-3xl font-serif italic text-cream">{session?.user?.name}</h3>
                          <p className="font-mono text-xs text-cream/40 tracking-widest">{session?.user?.email}</p>
                       </div>
                       <div className="bg-navy-surface/20 border border-gold/10 p-10 space-y-4 flex flex-col justify-center">
                          <span className="font-mono text-[9px] tracking-[0.4em] text-gold/40 uppercase">Membership</span>
                          <span className="text-xl font-mono tracking-[0.5em] text-gold font-black uppercase">Honored Member</span>
                       </div>
                    </div>

                    <div className="bg-gold/5 border border-gold/15 p-12 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 text-gold/5 -rotate-12 group-hover:rotate-0 transition-transform duration-[2s]">
                          <ShieldCheck size={120} strokeWidth={1} />
                       </div>
                       <div className="space-y-6 relative z-10">
                          <h4 className="text-2xl font-serif italic text-cream">Namaste, {session?.user?.name?.split(' ')[0]}.</h4>
                          <p className="text-sm text-cream/60 leading-relaxed max-w-xl font-sans">
                             Welcome to your account. Here you can track your orders, manage your addresses, and update your information. 
                             We are proud to serve you with the finest eyewear heritage since 1987.
                          </p>
                          <div className="pt-4 border-t border-gold/10 inline-block">
                             <span className="font-mono text-[8px] tracking-[0.5em] text-gold uppercase">Family Heritage Since 1987</span>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'address' && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-baseline mb-8">
                       <h2 className="text-3xl font-serif italic text-cream">My Addresses.</h2>
                       <button 
                          onClick={() => setShowAddressForm(!showAddressForm)}
                          className="flex items-center gap-3 text-gold font-mono text-[10px] tracking-[0.4em] uppercase hover:text-cream transition-colors"
                       >
                          {showAddressForm ? 'CLOSE' : 'ADD NEW ADDRESS'}
                          <Plus size={16} />
                       </button>
                    </div>

                    {showAddressForm && (
                       <motion.form 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          onSubmit={handleAddAddress}
                          className="bg-navy-surface/20 border border-gold/20 p-8 space-y-6 overflow-hidden"
                       >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="block font-mono text-[8px] tracking-[0.3em] text-gold/40 uppercase">Label (Home/Work)</label>
                                <input 
                                   required 
                                   className="w-full bg-navy border border-gold/10 p-3 text-sm font-mono text-gold outline-none focus:border-gold/40"
                                   value={newAddress.label}
                                   onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="block font-mono text-[8px] tracking-[0.3em] text-gold/40 uppercase">Street Address</label>
                                <input 
                                   required 
                                   className="w-full bg-navy border border-gold/10 p-3 text-sm font-mono text-gold outline-none focus:border-gold/40"
                                   value={newAddress.street}
                                   onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="block font-mono text-[8px] tracking-[0.3em] text-gold/40 uppercase">City</label>
                                <input 
                                   required 
                                   className="w-full bg-navy border border-gold/10 p-3 text-sm font-mono text-gold outline-none focus:border-gold/40"
                                   value={newAddress.city}
                                   onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="block font-mono text-[8px] tracking-[0.3em] text-gold/40 uppercase">PIN / ZIP Code</label>
                                <input 
                                   required 
                                   className="w-full bg-navy border border-gold/10 p-3 text-sm font-mono text-gold outline-none focus:border-gold/40"
                                   value={newAddress.zip}
                                   onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                />
                             </div>
                          </div>
                          <button 
                             type="submit"
                             disabled={loading}
                             className="w-full bg-gold text-navy py-4 font-mono text-[10px] font-black tracking-[0.4em] uppercase hover:shadow-lg transition-all"
                          >
                             STORE COORDS
                          </button>
                       </motion.form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {addresses.length === 0 ? (
                         <div className="col-span-full py-20 text-center border border-dashed border-gold/10">
                            <Map className="mx-auto text-gold/20 mb-4" size={40} strokeWidth={1} />
                            <p className="font-mono text-[10px] tracking-[0.4em] text-gold/40 uppercase">No coordinates registered</p>
                         </div>
                       ) : (
                         addresses.map(addr => (
                           <motion.div 
                             key={addr.id}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="bg-navy-surface/10 border border-gold/5 p-8 group relative"
                           >
                              <div className="flex justify-between items-start mb-4">
                                 <span className="font-mono text-[10px] tracking-[0.4em] text-gold/80 uppercase font-black">{addr.label}</span>
                                 <button 
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="text-cream/20 hover:text-red-500 transition-colors"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                              <div className="space-y-1 text-sm text-cream/60">
                                 <p>{addr.street}</p>
                                 <p>{addr.city}, {addr.state} {addr.zip}</p>
                                 <p className="text-[10px] uppercase tracking-widest text-gold/40 mt-3">{addr.country}</p>
                              </div>
                              {addr.isDefault && (
                                <div className="mt-4 inline-block bg-gold/10 text-gold text-[8px] font-mono tracking-widest px-2 py-0.5 uppercase">
                                   Primary Destination
                                </div>
                              )}
                           </motion.div>
                         ))
                       )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <h2 className="text-3xl font-serif italic text-cream">My Orders.</h2>
                    <OrderList status={status} />
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

const OrderList = ({ status }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (status !== 'authenticated') return;
      try {
        const res = await fetch('/api/user/orders', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error('Failed to fetch orders');
      } finally {
        setLoadingOrders(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  if (loadingOrders) return <div className="py-20 text-center font-mono text-[10px] text-gold/40 animate-pulse">SEARCHING RECORDS...</div>;

  if (orders.length === 0) return (
    <div className="py-20 text-center border border-dashed border-gold/10 bg-navy-surface/5">
      <Package className="mx-auto text-gold/20 mb-4" size={40} strokeWidth={1} />
      <p className="font-mono text-[10px] tracking-[0.4em] text-gold/40 uppercase">No orders found yet</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order._id?.toString() || Math.random()} className="bg-navy-surface/10 border border-gold/10 p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-6 hover:bg-gold/5 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="bg-gold/10 text-gold text-[8px] font-mono px-2 py-1 uppercase tracking-widest border border-gold/20">
                {order.status}
              </span>
              <span className="text-[10px] font-mono text-cream/40 uppercase tracking-widest">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h4 className="text-xl font-serif italic text-cream">Order #{order._id?.toString().slice(-6).toUpperCase()}</h4>
            <div className="flex gap-2">
               {order.items?.map((item, i) => (
                 <div key={i} className="w-12 h-12 bg-navy border border-white/5 p-1">
                    <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                 </div>
               ))}
            </div>
          </div>
          <div className="flex flex-col justify-between items-end">
             <span className="text-2xl font-mono text-gold">₹{order.total?.toLocaleString()}</span>
             <button 
                onClick={() => router.push(`/profile/orders/${order._id}`)}
                className="text-[9px] font-mono text-gold/60 border-b border-gold/20 pb-0.5 hover:text-gold hover:border-gold transition-all tracking-[0.3em] uppercase"
             >
               View Details
             </button>
          </div>
        </div>
      ))}
    </div>
  );
};
