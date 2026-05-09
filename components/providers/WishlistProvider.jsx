'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { data: session } = useSession();

  // Load from local storage or DB on mount
  useEffect(() => {
    const loadWishlist = async () => {
      // First check local storage
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        const localData = JSON.parse(saved);
        if (localData.length > 0) {
           setWishlist(localData);
        }
      }

      // If logged in, fetch from DB and merge/sync
      if (session) {
        try {
          const res = await axios.get('/api/user/wishlist');
          if (res.data.wishlist && res.data.wishlist.length > 0) {
             setWishlist(res.data.wishlist);
          }
        } catch (err) {
          console.error("Failed to sync wishlist from DB", err);
        }
      }
    };
    
    loadWishlist();
  }, [session]);

  // Save to local storage and DB on change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    const syncToDB = async () => {
      if (session) {
        try {
          await axios.post('/api/user/wishlist', { wishlist });
        } catch (err) {
          console.error("Failed to sync wishlist to DB", err);
        }
      }
    };

    if (wishlist.length > 0 || (session && wishlist.length === 0)) {
       syncToDB();
    }
  }, [wishlist, session]);

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast.success('Removed from Curated Wishlist');
    } else {
      setWishlist([...wishlist, product]);
      toast.success('Added to Curated Wishlist');
    }
  };

  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
