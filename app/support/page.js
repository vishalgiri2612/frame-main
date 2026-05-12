'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { HelpCircle, Truck, RefreshCcw, User, MessageSquare, ShieldCheck, ChevronRight, Search } from 'lucide-react';

const SupportCard = ({ icon: Icon, title, description, href }) => (
  <Link href={href}>
    <motion.div
      whileHover={{ y: -10 }}
      className="p-8 bg-gold/5 border border-gold/10 rounded-[2.5rem] hover:bg-gold/10 transition-all group flex flex-col h-full"
    >
      <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="text-gold w-7 h-7" />
      </div>
      <h3 className="text-xl font-serif italic text-cream mb-3">{title}</h3>
      <p className="text-cream/60 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
      <div className="flex items-center gap-2 text-gold font-mono text-[9px] tracking-widest uppercase">
        Explore <ChevronRight size={12} />
      </div>
    </motion.div>
  </Link>
);

export default function SupportHub() {
  return (
    <main className="bg-navy min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-48 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="w-8 h-px bg-gold/30" />
              <span className="font-mono text-[10px] tracking-[0.5em] text-gold uppercase">Concierge Support</span>
              <span className="w-8 h-px bg-gold/30" />
            </div>
            <h1 className="text-6xl md:text-8xl font-light text-cream leading-tight">
              HOW CAN WE <br />
              <span className="italic font-serif text-gold">ASSIST YOU?</span>
            </h1>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/40 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search the archive (e.g. 'Shipping times')" 
                className="w-full bg-gold/5 border border-gold/10 rounded-full py-5 pl-16 pr-8 text-cream font-mono text-[10px] tracking-widest uppercase outline-none focus:border-gold/40 transition-all placeholder:text-cream/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <SupportCard 
              icon={HelpCircle}
              title="Knowledge Archive"
              description="Find answers to frequently asked questions about our boutique services and standards."
              href="/support/faqs"
            />
            <SupportCard 
              icon={Truck}
              title="Delivery & Logistics"
              description="Information regarding secure shipping, international delivery, and order tracking."
              href="/support/shipping"
            />
            <SupportCard 
              icon={RefreshCcw}
              title="Exchange Policy"
              description="Learn about our commitment to your satisfaction and the exchange process."
              href="/support/returns-and-exchanges"
            />
            <SupportCard 
              icon={ShieldCheck}
              title="Privacy & Security"
              description="Our policies on data protection and boutique usage agreements."
              href="/support/privacy-policy"
            />
          </div>
        </div>
      </section>

      {/* Ticketing System Section */}
      <section className="pb-48">
        <div className="container mx-auto px-6">
          <div className="bg-gold/5 border border-gold/10 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <MessageSquare size={300} strokeWidth={0.5} className="text-gold" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-px bg-gold/30" />
                  <span className="font-mono text-[10px] tracking-[0.5em] text-gold uppercase">Direct Inquiry</span>
                </div>
                <h2 className="text-5xl font-light text-cream leading-tight">
                  UNABLE TO FIND <br />
                  <span className="italic font-serif text-gold">THE ANSWER?</span>
                </h2>
                <p className="text-cream/60 text-lg leading-relaxed max-w-md">
                  Our private concierge is available for personalized assistance. 
                  Submit a formal inquiry and we will respond within 4 business hours.
                </p>
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-4 text-cream/80">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-gold" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest uppercase">Response time: &lt; 4 Hours</span>
                  </div>
                </div>
              </div>

              <div className="bg-navy p-10 md:p-12 border border-gold/10 rounded-[3rem] shadow-2xl">
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-mono text-[9px] tracking-widest text-gold/60 uppercase">Full Identity</label>
                      <input type="text" className="w-full bg-gold/5 border-b border-gold/20 py-3 outline-none focus:border-gold text-cream transition-all placeholder:text-cream/10" placeholder="e.g. Vikram Sharma" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[9px] tracking-widest text-gold/60 uppercase">Digital Contact</label>
                      <input type="email" className="w-full bg-gold/5 border-b border-gold/20 py-3 outline-none focus:border-gold text-cream transition-all placeholder:text-cream/10" placeholder="e.g. contact@domain.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] tracking-widest text-gold/60 uppercase">Inquiry Type</label>
                    <select className="w-full bg-transparent border-b border-gold/20 py-3 outline-none focus:border-gold text-cream appearance-none cursor-pointer uppercase text-xs tracking-widest">
                      <option className="bg-navy">Order Inquiry</option>
                      <option className="bg-navy">Product Authenticity</option>
                      <option className="bg-navy">Optical Prescription</option>
                      <option className="bg-navy">Boutique Appointment</option>
                      <option className="bg-navy">Other Assistance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[9px] tracking-widest text-gold/60 uppercase">Message Narrative</label>
                    <textarea rows={4} className="w-full bg-gold/5 border-b border-gold/20 py-3 outline-none focus:border-gold text-cream transition-all resize-none placeholder:text-cream/10" placeholder="Describe your request in detail..." />
                  </div>

                  <button className="w-full py-6 bg-gold text-navy font-mono text-[11px] font-bold tracking-[0.4em] uppercase rounded-full hover:bg-gold-light transition-all shadow-xl">
                    Dispatch Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
