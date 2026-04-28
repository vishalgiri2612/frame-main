'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!session) {
      toast.error('Please log in to continue checkout');
      router.push('/login?callbackUrl=/shop/checkout');
    } else {
      router.push('/shop/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-navy-deep border-l border-gold/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-gold" size={20} />
                <h2 className="text-xl font-serif text-cream tracking-wider uppercase">My Bag</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gold/10 text-gold transition-colors rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-navy-surface rounded-full flex items-center justify-center border border-gold/5">
                    <ShoppingBag className="text-gold/20" size={32} />
                  </div>
                  <p className="text-cream/40 font-mono text-[10px] tracking-widest uppercase">
                    Your bag is empty
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gold text-[10px] tracking-[0.3em] uppercase underline underline-offset-8"
                  >
                    Back to Shop
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-24 h-24 bg-navy-surface border border-gold/5 flex-shrink-0 relative overflow-hidden group">
                       {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                          />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-mono text-gold/20">NO_IMG</div>
                       )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-cream font-serif text-lg leading-tight">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-cream/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-gold/60 text-[9px] tracking-widest uppercase mt-1">Brand: {item.brand || 'Luxury'}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gold/10 px-2 py-1 gap-4">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gold/50 hover:text-gold transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="text-cream font-mono text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gold/50 hover:text-gold transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-gold font-mono text-sm">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-navy-surface border-t border-gold/10 space-y-4">
                <div className="flex justify-between items-center text-sm tracking-widest uppercase">
                  <span className="text-cream/60">Subtotal</span>
                  <span className="text-gold font-mono text-lg">₹{cartTotal}</span>
                </div>
                <p className="text-[10px] text-cream/30 italic text-center">
                  Shipping and taxes calculated at checkout
                </p>
                <button
                  onClick={handleCheckout}
                  className="block w-full bg-gold text-navy text-center py-4 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white transition-colors duration-500"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
