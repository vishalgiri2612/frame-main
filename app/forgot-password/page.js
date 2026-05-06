"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      toast.success("If an account exists, a code was sent.");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
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
            Reset Access
          </motion.div>
          <h1 className="text-5xl font-serif italic text-cream tracking-tight">Forgot Password.</h1>
          <p className="text-cream/40 font-mono text-[10px] tracking-widest uppercase">We will email a code</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-navy py-5 font-mono text-[10px] font-black tracking-[0.5em] uppercase hover:shadow-[0_0_30px_rgba(166,138,59,0.3)] transition-all disabled:opacity-50"
          >
            {loading ? "SENDING..." : "SEND CODE"}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-gold/10">
          <Link href="/reset-password" className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase hover:text-cream transition-colors">
            I already have a code
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
