'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar, User, Clock, CheckCircle, Phone } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const DOCTORS = [
  { id: 1, name: "Dr. Elena Sterling", role: "Senior Optometrist", availability: "Mon-Fri" },
  { id: 2, name: "Dr. Marcus Vane", role: "Lens Specialist", availability: "Tue-Sat" },
  { id: 3, name: "Dr. Sarah Kim", role: "Contact Lens Expert", availability: "Mon-Wed" }
];

const TIME_SLOTS = [
  "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"
];

export default function BookingSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1); // 1: Date/Physician, 2: Details, 3: SMS/Confirm
  const [phone, setPhone] = useState("");
  const [isSendingSMS, setIsSendingSMS] = useState(false);

  const handleBookingFinish = () => {
    setIsSendingSMS(true);
    // Mimic Twilio SMS delay
    setTimeout(() => {
      setStep(4);
      setIsSendingSMS(false);
    }, 2000);
  };

  return (
    <section id="booking" className="py-24 bg-navy text-cream overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col mb-16 text-center">
          <span className="text-teal uppercase tracking-[0.5em] text-[10px] font-bold mb-4">Precision Care</span>
          <h2 className="text-5xl md:text-7xl font-serif tracking-tight italic">Secure Your Experience</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* STEPPER / PROGRESS (Left Column) */}
          <div className="lg:col-span-4 space-y-8">
            <div className={`p-6 rounded-2xl border transition-all ${step >= 1 ? 'border-gold bg-gold/5' : 'border-cream/10 opacity-40'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-gold text-navy' : 'bg-cream/10 text-cream/40'}`}>1</div>
                <div>
                  <h4 className="font-serif text-lg tracking-widest uppercase">Consultation</h4>
                  <p className="text-[10px] text-cream/60 tracking-widest">Select Date & Professional</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${step >= 2 ? 'border-gold bg-gold/5' : 'border-cream/10 opacity-40'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-gold text-navy' : 'bg-cream/10 text-cream/40'}`}>2</div>
                <div>
                  <h4 className="font-serif text-lg tracking-widest uppercase">Verification</h4>
                  <p className="text-[10px] text-cream/60 tracking-widest">Contact Information</p>
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <AnimatePresence>
              {(selectedDate || selectedSlot || selectedDoctor) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-navy-surface border border-gold/10 relative overflow-hidden group shadow-xl"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Calendar size={80} className="text-gold" />
                  </div>
                  <h5 className="text-[10px] uppercase tracking-[0.3em] text-teal mb-6">Booking Summary</h5>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm">
                      <Calendar size={14} className="text-gold" />
                      <span className="text-cream/80">{selectedDate ? format(selectedDate, 'PPP') : 'Selection Pending...'}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <User size={14} className="text-gold" />
                      <span className="text-cream/80">{selectedDoctor?.name || 'Physician Pending...'}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <Clock size={14} className="text-gold" />
                      <span className="text-cream/80">{selectedSlot || 'Time Pending...'}</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MAIN WIDGET (Right Column) */}
          <div className="lg:col-span-8 bg-navy-surface border border-cream/10 rounded-[40px] p-8 md:p-12 shadow-2xl min-h-[600px] flex flex-col justify-between">
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12"
                >
                  <div className="custom-calendar flex justify-center lg:justify-start w-full overflow-hidden">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="m-0 text-cream"
                    />
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-gold mb-4 font-bold">Medical Professionals</h4>
                      <div className="space-y-3">
                        {DOCTORS.map(doc => (
                          <button
                            key={doc.id}
                            onClick={() => setSelectedDoctor(doc)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedDoctor?.id === doc.id ? 'border-gold bg-gold/5' : 'border-cream/10 hover:border-gold/30'}`}
                          >
                            <div className="font-serif text-cream">{doc.name}</div>
                            <div className="text-[9px] text-cream/40 uppercase tracking-widest">{doc.role}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-gold mb-4 font-bold">Available Slots</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 text-[10px] rounded-lg border transition-all ${selectedSlot === slot ? 'bg-gold text-navy' : 'border-cream/10 text-cream/60 hover:border-gold/30'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-md mx-auto w-full py-12"
                >
                  <div className="text-center mb-12">
                    <Phone className="text-gold mx-auto mb-4" size={32} />
                    <h3 className="text-3xl font-serif italic mb-2">Patient Verification</h3>
                    <p className="text-xs text-cream/40">Enter your device number for secure confirmation</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                       <input 
                         type="tel" 
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         placeholder="+91"
                         className="w-full bg-navy border-b border-gold/30 py-4 text-center text-3xl font-serif text-gold focus:border-gold outline-none transition-all placeholder:text-gold/20"
                       />
                       <div className="mt-4 text-[8px] uppercase tracking-widest text-cream/30 text-center">SMS Verification will be sent via Twilio Secure</div>
                    </div>
                    
                    <button 
                      onClick={handleBookingFinish}
                      disabled={phone.length < 10 || isSendingSMS}
                      className="w-full bg-gold text-navy py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all disabled:opacity-20 mt-8"
                    >
                      {isSendingSMS ? "Finalizing Encryption..." : "Complete Booking"}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <CheckCircle className="text-teal mb-8" size={80} />
                  <span className="text-[10px] uppercase tracking-[0.5em] text-teal font-bold mb-4">Confirmed</span>
                  <h3 className="text-4xl font-serif italic mb-6 tracking-wide">See You Soon, {selectedDoctor?.name.split(' ')[1]}</h3>
                  <p className="text-xs text-cream/60 max-w-xs leading-relaxed">
                    Check your messages. A digital invitation has been sent to your device.
                  </p>
                  <button onClick={() => setStep(1)} className="mt-12 text-[10px] uppercase tracking-widest text-gold border-b border-gold/30 pb-2">Book Another Session</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Controls */}
            {step < 3 && step !== 4 && (
              <div className="flex justify-between items-center pt-8 border-t border-cream/10">
                <button
                  onClick={() => setStep(prev => Math.max(1, prev - 1))}
                  className={`text-[10px] uppercase tracking-widest ${step === 1 ? 'opacity-0 disabled' : 'text-cream/60'}`}
                >
                  ← Back
                </button>
                {step === 1 && (
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedDoctor || !selectedSlot}
                    className="flex items-center gap-3 bg-gold text-navy px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] disabled:opacity-30 transition-all hover:scale-105 shadow-lg"
                  >
                    Next Stage →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-calendar .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: var(--gold);
          --rdp-background-color: var(--gold);
        }
        .custom-calendar .rdp-day_selected, 
        .custom-calendar .rdp-day_selected:focus, 
        .custom-calendar .rdp-day_selected:hover {
          background-color: var(--gold);
          color: var(--background);
        }
        .custom-calendar .rdp-day:hover:not(.rdp-day_selected) {
          background-color: rgba(var(--gold-rgb), 0.1);
        }
      `}} />
    </section>
  );
}
