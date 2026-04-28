'use client';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen pt-32 pb-32 bg-navy text-cream transition-colors duration-700"
    >
      <main className="container mx-auto px-6">
        <section className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-gold/20 pb-12">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-3">
              <span className="w-8 h-px bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-gold">PRIVATE CONCIERGE</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-6xl md:text-8xl font-light leading-[0.9] tracking-tighter">
              AWAITING <br /><span className="italic font-serif text-gold">INQUIRIES.</span>
            </motion.h1>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Details */}
          <div className="space-y-16">
            <div>
              <h2 className="text-xl md:text-2xl font-light tracking-widest mb-4">FLAGSHIP BOUTIQUE</h2>
              <div className="text-sm tracking-widest text-cream/80 space-y-2 uppercase">
                <p className="text-cream font-medium">Sector 17, High Street</p>
                <p>Chandigarh, Punjab 160017</p>
                <p>India</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-light tracking-widest mb-4">COMMUNICATION</h2>
              <div className="text-sm tracking-widest text-cream/80 space-y-2 uppercase">
                <p>E: <a href="mailto:concierge@EYELOVEYOU.com" className="text-gold hover:text-cream transition-colors">concierge@EYELOVEYOU.com</a></p>
                <p>T: <span className="text-cream">+91 98765 43210</span></p>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-light tracking-widest mb-4">HOURS OF OPERATION</h2>
              <div className="text-sm tracking-widest text-cream/80 space-y-2 uppercase">
                <p>MON - SAT: <span className="text-cream">10:00 AM — 08:00 PM</span></p>
                <p>SUNDAY: <span className="text-gold">BY INVITATION ONLY</span></p>
              </div>
            </div>

            <button className="border border-gold px-10 py-4 text-xs uppercase tracking-widest font-semibold text-gold hover:bg-gold hover:text-navy transition-all duration-300">
              BOOK PRIVATE FITTING
            </button>
          </div>

          {/* Minimalist Form */}
          <div className="bg-navy-surface p-12 border border-gold/10 rounded-xl">
            <h2 className="text-3xl font-serif italic text-gold mb-8">Initiate Dialogue</h2>
            <form className="space-y-8">
              <div className="flex flex-col space-y-2">
                <label className="text-xs tracking-widest text-cream/70 uppercase">IDENTITY</label>
                <input type="text" className="bg-transparent border-b border-gold/30 pb-3 outline-none focus:border-gold transition-colors text-cream text-lg placeholder:text-cream/40" placeholder="Enter your name" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs tracking-widest text-cream/70 uppercase">TRANSMISSION (EMAIL)</label>
                <input type="email" className="bg-transparent border-b border-gold/30 pb-3 outline-none focus:border-gold transition-colors text-cream text-lg placeholder:text-cream/40" placeholder="Enter your email address" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs tracking-widest text-cream/70 uppercase">SUBJECT</label>
                <select className="bg-transparent border-b border-gold/30 pb-3 outline-none focus:border-gold transition-colors text-cream text-lg appearance-none cursor-pointer">
                  <option className="bg-navy text-cream">General Inquiry</option>
                  <option className="bg-navy text-cream">Product Sourcing</option>
                  <option className="bg-navy text-cream">Aftersales Support</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs tracking-widest text-cream/70 uppercase">DISCOURSE</label>
                <textarea rows="4" className="bg-transparent border-b border-gold/30 pb-3 outline-none focus:border-gold transition-colors text-cream text-lg resize-none placeholder:text-cream/40" placeholder="Enter your message..."></textarea>
              </div>
              <button type="submit" className="w-full bg-gold text-navy py-5 text-sm uppercase tracking-widest font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-shadow duration-300 rounded-sm mt-4">
                DISPATCH MESSAGE
              </button>
            </form>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
