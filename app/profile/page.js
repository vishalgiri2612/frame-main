'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  MapPin, 
  Package, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  Map, 
  ChevronRight,
  Search,
  Bell,
  Heart,
  ShoppingBag,
  ExternalLink,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { useCart } from '@/components/providers/CartProvider';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
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

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session) {
      fetchAddresses();
      fetchProfile();
    }
  }, [status, session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          dob: data.dob || '',
          gender: data.gender || ''
        });
      }
    } catch (e) {
      console.error('Failed to fetch profile');
    }
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        toast.success('Profile Updated Successfully');
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error('Update failed');
      }
    } catch (e) {
      toast.error('Server error');
    } finally {
      setIsUpdating(false);
    }
  };

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
        toast.success('Address Saved');
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
        toast.success('Address Removed');
        await fetchAddresses();
      }
    } catch (e) {
      toast.error('Failed to delete address');
    }
  };

  if (status === 'loading') return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-zinc-200 border-t-zinc-900 animate-spin rounded-full" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-900 pt-16">
      {/* Sidebar - Dashboard Style */}
      <aside className="w-72 bg-zinc-50 border-r border-zinc-200 h-[calc(100vh-64px)] sticky top-16 hidden lg:flex flex-col p-6 space-y-8">
        <div>
          <div className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Member Account</div>
          <nav className="space-y-1">
            {[
              { id: 'overview', icon: User, label: 'Personal Info' },
              { id: 'orders', icon: Package, label: 'Order History' },
              { id: 'wishlist', icon: Heart, label: 'Wishlist' },
              { id: 'address', icon: MapPin, label: 'Addresses' },
              { id: 'security', icon: ShieldCheck, label: 'Security' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-900'} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto pt-6 border-t border-zinc-200">
          <button 
             onClick={() => signOut({ callbackUrl: '/' })}
             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all group"
          >
            <LogOut size={18} className="text-zinc-400 group-hover:text-red-500" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 max-w-6xl">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Account Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your identity, orders, and curated wishlist.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full ring-1 ring-inset ring-green-600/20">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                   Active Session
                </span>
             </div>
          </div>
        </header>

        <div className="space-y-8">
           <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                     <div className="px-8 py-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                        <div>
                           <h3 className="text-lg font-bold text-zinc-900">Basic Identity & Contact</h3>
                           <p className="text-xs text-zinc-500 mt-0.5">Your essential information for communications and alerts.</p>
                        </div>
                        {!isEditing ? (
                           <button 
                              onClick={() => setIsEditing(true)}
                              className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all"
                           >
                              <Edit2 size={14} /> Edit Profile
                           </button>
                        ) : (
                           <button 
                              onClick={() => setIsEditing(false)}
                              className="flex items-center gap-2 px-4 py-2 border border-red-100 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
                           >
                              <X size={14} /> Cancel
                           </button>
                        )}
                     </div>
                     
                     <div className="p-8 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                           {/* Full Name */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                              {isEditing ? (
                                 <input 
                                    type="text"
                                    value={profileData.name}
                                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                                    className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                                 />
                              ) : (
                                 <p className="text-sm font-semibold text-zinc-900 py-1 border-b border-transparent">{profileData.name || 'Not Provided'}</p>
                              )}
                           </div>

                           {/* Email */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                              <p className="text-sm font-semibold text-zinc-500 py-1 flex items-center gap-2">
                                 {profileData.email}
                                 <span className="text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200 font-bold uppercase">Locked</span>
                              </p>
                           </div>

                           {/* Mobile */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mobile Number</label>
                              {isEditing ? (
                                 <div className="space-y-2">
                                    <input 
                                       type="tel"
                                       placeholder="+91 00000 00000"
                                       value={profileData.phone}
                                       onChange={e => setProfileData({...profileData, phone: e.target.value})}
                                       className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                                    />
                                    <p className="text-[10px] text-zinc-400 italic">Used for order SMS / WhatsApp alerts</p>
                                 </div>
                              ) : (
                                 <p className="text-sm font-semibold text-zinc-900 py-1">{profileData.phone || 'Not Provided'}</p>
                              )}
                           </div>

                           {/* DOB */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date of Birth</label>
                              {isEditing ? (
                                 <div className="space-y-2">
                                    <input 
                                       type="date"
                                       value={profileData.dob}
                                       onChange={e => setProfileData({...profileData, dob: e.target.value})}
                                       className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                                    />
                                    <p className="text-[10px] text-zinc-400 italic">We share special treats on your birthday</p>
                                 </div>
                              ) : (
                                 <p className="text-sm font-semibold text-zinc-900 py-1">
                                    {profileData.dob ? new Date(profileData.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not Provided'}
                                 </p>
                              )}
                           </div>

                           {/* Gender */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Gender</label>
                              {isEditing ? (
                                 <select 
                                    value={profileData.gender}
                                    onChange={e => setProfileData({...profileData, gender: e.target.value})}
                                    className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all appearance-none"
                                 >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                 </select>
                              ) : (
                                 <p className="text-sm font-semibold text-zinc-900 py-1 capitalize">{profileData.gender?.replace(/_/g, ' ') || 'Not Provided'}</p>
                              )}
                           </div>
                        </div>

                        {isEditing && (
                           <div className="pt-8 border-t border-zinc-100 flex justify-end gap-4">
                              <button 
                                 type="button"
                                 onClick={() => setIsEditing(false)}
                                 className="px-6 py-2.5 border border-zinc-200 rounded-lg text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-all"
                              >
                                 Discard
                              </button>
                              <button 
                                 type="button"
                                 onClick={handleUpdateProfile}
                                 disabled={isUpdating}
                                 className="flex items-center gap-2 px-8 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-lg"
                              >
                                 {isUpdating ? 'Saving...' : <><Check size={16} /> Save Changes</>}
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold text-zinc-900">Curated Wishlist</h2>
                     <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                        {wishlist.length} Artifacts
                     </span>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="py-20 text-center bg-white border border-zinc-200 rounded-xl border-dashed">
                       <Heart className="mx-auto text-zinc-300 mb-4" size={40} strokeWidth={1} />
                       <p className="text-sm font-medium text-zinc-900">Your wishlist is empty</p>
                       <p className="text-xs text-zinc-500 mt-1 mb-6">Start curating your personal collection from the shop.</p>
                       <button 
                          onClick={() => router.push('/shop')}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-all"
                       >
                          Browse Gallery <ChevronRight size={14} />
                       </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {wishlist.map((item) => (
                         <div key={item.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm group hover:border-zinc-300 transition-all">
                            <div className="relative aspect-square bg-zinc-50 flex items-center justify-center p-6">
                               <Image 
                                  src={item.image} 
                                  alt={item.name} 
                                  fill 
                                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                               />
                               <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                     onClick={() => toggleWishlist(item)}
                                     className="p-2 bg-white shadow-md rounded-full text-zinc-400 hover:text-red-500 transition-colors"
                                  >
                                     <Trash2 size={14} />
                                  </button>
                               </div>
                            </div>
                            <div className="p-4 space-y-3">
                               <div>
                                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.brand}</h4>
                                  <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">{item.name}</h3>
                               </div>
                               <div className="flex items-center justify-between pt-2">
                                  <span className="text-sm font-bold text-zinc-900">₹{item.price?.toLocaleString()}</span>
                                  <button 
                                     onClick={() => {
                                        addToCart(item);
                                        toast.success('Added to bag');
                                     }}
                                     className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                                  >
                                     <ShoppingBag size={14} />
                                  </button>
                               </div>
                               <button 
                                  onClick={() => router.push(`/shop/${item.id}`)}
                                  className="w-full py-2 border border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
                               >
                                  View Details <ExternalLink size={10} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold text-zinc-900">Address Registry</h2>
                     <button 
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 transition-colors"
                     >
                        {showAddressForm ? 'Cancel' : <><Plus size={16} /> Register New</>}
                     </button>
                  </div>

                  <AnimatePresence>
                    {showAddressForm && (
                       <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mb-8"
                       >
                          <form onSubmit={handleAddAddress} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <label className="text-sm font-medium text-zinc-700">Label (Home/Work) *</label>
                                  <input 
                                     required 
                                     placeholder="e.g. Primary Residence"
                                     className="block w-full px-4 py-2.5 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 text-sm transition-all"
                                     value={newAddress.label}
                                     onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                                  />
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-sm font-medium text-zinc-700">Street Address *</label>
                                  <input 
                                     required 
                                     className="block w-full px-4 py-2.5 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 text-sm transition-all"
                                     value={newAddress.street}
                                     onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                  />
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-sm font-medium text-zinc-700">City *</label>
                                  <input 
                                     required 
                                     className="block w-full px-4 py-2.5 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 text-sm transition-all"
                                     value={newAddress.city}
                                     onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                  />
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-sm font-medium text-zinc-700">Postal Code *</label>
                                  <input 
                                     required 
                                     className="block w-full px-4 py-2.5 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 text-sm transition-all font-mono"
                                     value={newAddress.zip}
                                     onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                  />
                               </div>
                            </div>
                            <button 
                               type="submit"
                               disabled={loading}
                               className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-60"
                            >
                               {loading ? 'Processing...' : 'Save Registry Entry'}
                            </button>
                          </form>
                       </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {addresses.length === 0 ? (
                       <div className="col-span-full py-20 text-center bg-white border border-zinc-200 rounded-xl border-dashed">
                          <Map className="mx-auto text-zinc-300 mb-4" size={40} />
                          <p className="text-sm font-medium text-zinc-900">No addresses registered</p>
                          <p className="text-xs text-zinc-500 mt-1">Start by adding your first shipping destination.</p>
                       </div>
                     ) : (
                       addresses.map(addr => (
                         <div key={addr.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm group hover:border-zinc-300 transition-all">
                            <div className="flex justify-between items-start mb-4">
                               <div>
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Destination</span>
                                  <h3 className="text-sm font-bold text-zinc-900">{addr.label}</h3>
                               </div>
                               <button 
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                               >
                                  <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="space-y-1 text-sm text-zinc-600">
                               <p>{addr.street}</p>
                               <p>{addr.city}, {addr.state} {addr.zip}</p>
                               <p className="text-xs text-zinc-400 mt-2 font-medium">{addr.country}</p>
                            </div>
                            {addr.isDefault && (
                              <div className="mt-4 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-zinc-200 bg-zinc-50 text-zinc-600">
                                 Primary Account Address
                              </div>
                            )}
                         </div>
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
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-zinc-900 mb-4">Order History</h2>
                  <OrderList status={status} />
                </motion.div>
              )}
           </AnimatePresence>
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

  if (loadingOrders) return (
    <div className="py-20 text-center space-y-4">
      <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 animate-spin rounded-full mx-auto" />
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Searching Records...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="py-20 text-center bg-white border border-zinc-200 rounded-xl border-dashed">
      <Package className="mx-auto text-zinc-300 mb-4" size={40} />
      <p className="text-sm font-medium text-zinc-900">No orders found</p>
      <p className="text-xs text-zinc-500 mt-1">Your acquisition history is currently empty.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Artifacts</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-900">#{order._id?.toString().slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4 text-sm text-zinc-600">
                  {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <div key={i} className="relative w-8 h-8 rounded-full bg-white border border-zinc-200 p-1 overflow-hidden ring-2 ring-white">
                        <Image src={item.image} fill sizes="32px" className="object-contain p-1" alt="" />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[8px] font-bold text-zinc-500 ring-2 ring-white">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-zinc-900">₹{order.total?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    order.status === 'DELIVERED' 
                      ? 'text-green-700 border-green-200 bg-green-50' 
                      : 'text-amber-700 border-amber-200 bg-amber-50'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button 
                      onClick={() => router.push(`/profile/orders/${order._id}`)}
                      className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors flex items-center gap-1 ml-auto"
                   >
                     Details <ChevronRight size={12} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
