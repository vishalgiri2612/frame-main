'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function RefreshPage() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState(0);

  const startRefresh = async () => {
    setStatus('loading');
    setLog(['Initiating Global AI Pipeline...', 'Synchronizing with OpenRouter & Magnific...']);
    setProgress(0);

    const SLOTS = [
      { id: 'celebrity', name: 'Celebrity Watch' },
      { id: 'bestseller', name: 'Trend Forecast' },
      { id: 'model', name: 'Editorial Model' },
      { id: 'detail', name: 'Design Craft' },
      { id: 'street', name: 'Street Style' }
    ];

    try {
      let currentProgress = 0;
      
      for (let i = 0; i < SLOTS.length; i++) {
        const slot = SLOTS[i];
        setLog(prev => [...prev, `\n📰 Processing Section: ${slot.name}...`, `🎨 Generating AI Image for ${slot.id}...`]);
        
        const response = await fetch(`/api/magazine/update-full?slotId=${slot.id}`);
        const result = await response.json();

        if (result.success) {
          currentProgress += 20;
          setProgress(currentProgress);
          setLog(prev => [...prev, `✅ Section Complete: "${result.title}"`]);
        } else {
          throw new Error(`Failed on ${slot.name}: ${result.error}`);
        }
      }

      setLog(prev => [...prev, '\n✨ TOTAL REFRESH COMPLETE.', 'All 5 sections are now live.']);
      setStatus('success');
    } catch (error) {
      setLog(prev => [...prev, `\n❌ FATAL ERROR: ${error.message}`]);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-8 text-center">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic text-[#C9A84C]">System Refresh</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Global AI Magazine Pipeline</p>
        </div>

        {/* Main Console */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C9A84C]/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Click below to trigger the full AI rewrite. This will update all 5 magazine sections including Celebrity Watch, Trends, and editorials.
                </p>
                <button
                  onClick={startRefresh}
                  className="w-full py-4 bg-[#C9A84C] text-[#0A0E1A] rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-[#D4B96A] transition-all shadow-lg shadow-[#C9A84C]/20"
                >
                  Confirm & Refresh All
                </button>
              </motion.div>
            )}

            {status === 'loading' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Circular Progress */}
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-white/10 stroke-current" strokeWidth="4" cx="50" cy="50" r="40" fill="transparent" />
                    <motion.circle 
                      className="text-[#C9A84C] stroke-current" strokeWidth="4" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent"
                      initial={{ strokeDasharray: "0 251" }}
                      animate={{ strokeDasharray: `${(progress / 100) * 251} 251` }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-[#C9A84C]">
                    {progress}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">AI is writing...</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Generating Images & Editorial Content</p>
                </div>

                {/* Log Console */}
                <div className="bg-black/40 rounded-xl p-4 text-left font-mono text-[9px] text-[#C9A84C]/80 h-32 overflow-y-auto space-y-1 border border-white/5">
                  {log.map((line, i) => <div key={i} className="flex gap-2"><span>&gt;</span> {line}</div>)}
                </div>
                
                <p className="text-[9px] text-white/30 italic">Please do not close this window (approx 3-5 mins)</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Refresh Complete</h3>
                <p className="text-sm text-white/60">Your magazine is now up to date with fresh AI content.</p>
                <div className="flex flex-col gap-3">
                  <Link href="/" className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold uppercase tracking-widest text-[11px] transition-all">
                    View Website
                  </Link>
                  <button onClick={() => setStatus('idle')} className="text-[10px] text-white/40 uppercase underline tracking-widest">
                    Run Again
                  </button>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Refresh Failed</h3>
                <div className="bg-red-500/10 p-4 rounded-xl text-xs text-red-400 font-mono">
                  {log[log.length - 1]}
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="w-full py-4 bg-red-500 text-white rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-red-600 transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer */}
        <Link href="/" className="inline-block text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors">
          ← Back to Homepage
        </Link>

      </div>
    </div>
  );
}
