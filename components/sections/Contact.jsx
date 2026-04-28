'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section className="py-24 bg-navy-deep">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Map Side */}
          <div className="space-y-8 h-full flex flex-col">
            <div className="flex-grow min-h-[400px] w-full bg-navy-surface border border-gold/10 relative overflow-hidden group">
              {/* Stylized Google Maps Placeholder */}
              <div className="absolute inset-0 grayscale invert opacity-30 group-hover:opacity-50 transition-opacity duration-1000">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.5513467623!2d74.3413833!3d31.5111166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMwJzQwLjAiTiA3NMKwMjAnMjkuMCJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative">
                   <div className="w-12 h-12 bg-gold/20 rounded-full animate-ping absolute -inset-0" />
                   <div className="w-4 h-4 bg-gold rounded-full relative z-10 border-2 border-navy" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ContactInfo item={{ icon: MapPin, title: 'Main Branch', desc: 'Gulberg Gallery, Lahore, PK' }} />
              <ContactInfo item={{ icon: MapPin, title: 'Defence Branch', desc: 'Phase 5, DHA, Lahore, PK' }} />
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-navy-surface p-12 border border-gold/10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-cream">Visit the Atelier</h2>
              <p className="text-cream/50 font-light">Schedule a personal consultation or eye test.</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="NAME"
                  className="w-full bg-transparent border-b border-gold/20 py-4 text-[10px] uppercase tracking-widest text-cream focus:border-gold outline-none transition-colors"
                />
                <input 
                  type="tel" 
                  placeholder="PHONE"
                   className="w-full bg-transparent border-b border-gold/20 py-4 text-[10px] uppercase tracking-widest text-cream focus:border-gold outline-none transition-colors"
                />
              </div>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                 className="w-full bg-transparent border-b border-gold/20 py-4 text-[10px] uppercase tracking-widest text-cream focus:border-gold outline-none transition-colors"
              />
              <select className="w-full bg-transparent border-b border-gold/20 py-4 text-[10px] uppercase tracking-widest text-cream focus:border-gold outline-none transition-colors appearance-none">
                <option className="bg-navy">PREFERRED TIME</option>
                <option className="bg-navy">MORNING (11AM - 1PM)</option>
                <option className="bg-navy">AFTERNOON (2PM - 5PM)</option>
                <option className="bg-navy">EVENING (6PM - 8PM)</option>
              </select>
              <textarea 
                placeholder="MESSAGE" 
                rows="3"
                 className="w-full bg-transparent border-b border-gold/20 py-4 text-[10px] uppercase tracking-widest text-cream focus:border-gold outline-none transition-colors resize-none"
              ></textarea>
              
              <button className="w-full bg-gold text-navy py-5 text-xs uppercase tracking-[0.3em] font-bold hover:bg-gold-light transition-colors duration-300">
                Send Message
              </button>
            </form>

            <div className="pt-8 grid grid-cols-2 gap-6 border-t border-gold/5">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-teal" />
                <span className="text-[10px] text-cream/40 uppercase tracking-widest">+92 42 1234567</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-teal" />
                <span className="text-[10px] text-cream/40 uppercase tracking-widest">11AM - 9PM Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ item }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 pt-1">
        <item.icon size={16} className="text-gold" />
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-teal font-bold mb-1">{item.title}</h4>
        <p className="text-cream/60 font-serif text-lg">{item.desc}</p>
      </div>
    </div>
  );
}
