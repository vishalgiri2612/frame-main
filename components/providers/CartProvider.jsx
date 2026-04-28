'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: session, status } = useSession();

  // Load cart from MongoDB on login or mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    } else if (status === 'unauthenticated') {
      setCart([]); // Clear local state if logged out
    }
  }, [status]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/user/cart', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || []);
      }
    } catch (e) {
      console.error('Failed to fetch cart from DB');
    }
  };

  const syncCartWithDB = async (newCart) => {
    if (status !== 'authenticated') return;
    try {
      await fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: newCart }),
        cache: 'no-store'
      });
    } catch (e) {
      console.error('Failed to sync cart with DB');
    }
  };

  const addToCart = async (product) => {
    if (status !== 'authenticated') {
      toast.error('Please log in to add items to your bag');
      return;
    }

    const newCart = [...cart];
    const existingItem = newCart.find((item) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }
    
    setCart(newCart);
    await syncCartWithDB(newCart);
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    await syncCartWithDB(newCart);
  };

  const updateQuantity = async (productId, delta) => {
    const newCart = cart.map((item) => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(newCart);
    await syncCartWithDB(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    if (status === 'authenticated') {
      await fetch('/api/user/cart', { method: 'DELETE' });
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
