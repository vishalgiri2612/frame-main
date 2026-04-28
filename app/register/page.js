'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registry Entry Created');
        router.push('/login');
      } else {
        toast.error(data.error || 'Registration failed');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Connection failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6 pt-32">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(166,138,59,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-12 relative z-10"
      >
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[10px] tracking-[0.5em] text-gold uppercase"
          >
            Create Account
          </motion.div>
          <h1 className="text-5xl font-serif italic text-cream tracking-tight">Register.</h1>
          <p className="text-cream/40 font-mono text-[10px] tracking-widest uppercase">Join our community</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2 group">
              <label className="block font-mono text-[9px] tracking-[0.3em] text-cream/60 uppercase group-focus-within:text-gold transition-colors">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-navy-deep border border-gold/20 p-5 outline-none focus:border-gold/60 text-cream font-mono text-sm transition-all shadow-2xl placeholder:text-cream/20"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2 group">
              <label className="block font-mono text-[9px] tracking-[0.3em] text-cream/60 uppercase group-focus-within:text-gold transition-colors">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy-deep border border-gold/20 p-5 outline-none focus:border-gold/60 text-cream font-mono text-sm transition-all shadow-2xl placeholder:text-cream/20"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2 group">
              <label className="block font-mono text-[9px] tracking-[0.3em] text-cream/60 uppercase group-focus-within:text-gold transition-colors">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy-deep border border-gold/20 p-5 outline-none focus:border-gold/60 text-cream font-mono text-sm transition-all shadow-2xl placeholder:text-cream/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-navy py-5 font-mono text-[10px] font-black tracking-[0.5em] uppercase hover:shadow-[0_0_30_px_rgba(166,138,59,0.3)] transition-all disabled:opacity-50"
          >
            {loading ? 'REGISTERING...' : 'REGISTER'}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-gold/10">
          <p className="font-mono text-[9px] tracking-widest text-cream/30 uppercase mb-4">Already have an account?</p>
          <Link href="/login" className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase hover:text-cream transition-colors">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
