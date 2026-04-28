'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Clock, MessageSquare, Send, User } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatDate } from '@/lib/admin/client';

const priorityColors = {
  LOW: 'bg-cream/10 text-cream/40',
  MEDIUM: 'bg-gold/10 text-gold',
  HIGH: 'bg-red-400/10 text-red-400',
  URGENT: 'bg-red-600/20 text-red-600',
};

export default function SupportTickets() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { data, isLoading, refetch } = useAdminResource('/api/admin/support', {
    q: query,
    status,
    limit: 20,
  });

  const tickets = useMemo(() => data?.items || [], [data]);

  useEffect(() => {
    if (!tickets.length) {
      setSelectedTicketId('');
      setSelectedTicket(null);
      return;
    }

    const stillExists = tickets.some((ticket) => ticket.id === selectedTicketId);
    const nextId = stillExists ? selectedTicketId : tickets[0].id;

    if (nextId !== selectedTicketId) {
      setSelectedTicketId(nextId);
    }
  }, [tickets, selectedTicketId]);

  useEffect(() => {
    if (!selectedTicketId) return;

    let cancelled = false;

    (async () => {
      try {
        const ticket = await adminFetch(`/api/admin/support/${selectedTicketId}`);
        if (!cancelled) {
          setSelectedTicket(ticket);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load ticket details');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedTicketId]);

  const sendReply = async (event) => {
    event.preventDefault();
    if (!selectedTicketId || !message.trim()) return;

    setIsSending(true);
    setError('');

    try {
      await adminFetch('/api/admin/support', {
        method: 'POST',
        body: JSON.stringify({
          ticketId: selectedTicketId,
          message: message.trim(),
          status: 'IN_PROGRESS',
        }),
      });

      setMessage('');
      await refetch();
      const ticket = await adminFetch(`/api/admin/support/${selectedTicketId}`);
      setSelectedTicket(ticket);
    } catch (err) {
      setError(err.message || 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-tighter">Support <span className="italic font-serif text-gold">Hub.</span></h1>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase mt-2">Client Concierge & Dispatch</p>
      </header>

      <section className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by ticket id, subject, or customer"
          className="md:col-span-3 bg-navy-surface border border-gold/10 px-3 py-3 text-sm outline-none focus:border-gold/30"
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="bg-navy-surface border border-gold/10 px-3 py-3 text-sm outline-none focus:border-gold/30">
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </section>

      {error && (
        <div className="mb-5 border border-red-500/20 bg-red-500/5 text-red-300 px-3 py-2 text-sm inline-flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-320px)]">
        <div className="lg:col-span-1 bg-navy-surface border border-gold/5 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gold/5 font-mono text-[8px] tracking-[0.3em] text-cream/30 uppercase">Active Inquiries</div>
          <div className="flex-1 overflow-y-auto divide-y divide-gold/5">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`w-full p-6 text-left transition-all relative ${
                  selectedTicketId === ticket.id ? 'bg-gold/[0.03] border-l-2 border-gold shadow-inner' : 'hover:bg-gold/[0.01]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-mono tracking-widest text-gold">{ticket.ticketNumber || ticket.id}</span>
                   <span className={`px-2 py-0.5 rounded-full text-[7px] font-mono tracking-[0.2em] uppercase ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                   </span>
                </div>
                <h3 className="text-sm font-light text-cream mb-1 truncate">{ticket.subject}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-cream/40 font-light">{ticket.customerName}</span>
                  <span className="text-[8px] font-mono text-cream/20">{formatDate(ticket.updatedAt)}</span>
                </div>
              </button>
            ))}

            {!isLoading && !tickets.length && (
              <div className="p-6 text-sm text-cream/40">No tickets found for this filter.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-navy-surface border border-gold/5 flex flex-col relative overflow-hidden">
          {selectedTicket ? (
            <>
              <div className="p-8 border-b border-gold/5 flex justify-between items-center bg-gold/[0.01]">
                <div>
                  <h2 className="text-2xl font-light tracking-tight text-cream">{selectedTicket.subject}</h2>
                  <div className="flex gap-4 mt-2">
                    <span className="font-mono text-[8px] tracking-[0.2em] text-cream/40 uppercase flex items-center gap-2">
                      <User className="w-3 h-3 text-gold" />
                      Client: <span className="text-gold">{selectedTicket.customerName}</span>
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-cream/40 uppercase flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gold" />
                      Opened: <span className="text-gold">{formatDate(selectedTicket.createdAt)}</span>
                    </span>
                  </div>
                </div>
                <div className="text-xs font-mono text-gold border border-gold/20 px-3 py-2">{selectedTicket.status}</div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-[url('/noise.png')] opacity-95">
                 {selectedTicket.messages?.map((entry, idx) => {
                   const isAdmin = entry.sender === 'ADMIN';
                   return (
                     <div key={`${entry.createdAt || idx}-${idx}`} className={`max-w-[80%] flex flex-col gap-2 ${isAdmin ? 'ml-auto items-end' : ''}`}>
                       <div className={`p-5 border leading-relaxed text-sm ${isAdmin ? 'bg-gold/10 border-gold/20 text-cream/90' : 'bg-navy border-gold/10 text-cream/80'}`}>
                         {entry.text}
                       </div>
                       <span className={`font-mono text-[8px] tracking-[0.2em] uppercase px-1 ${isAdmin ? 'text-gold' : 'text-cream/30'}`}>
                         {entry.sender} • {formatDate(entry.createdAt)}
                       </span>
                     </div>
                   );
                 })}

                 {!selectedTicket.messages?.length && (
                   <div className="text-sm text-cream/50">No conversation history yet.</div>
                 )}
              </div>

              <form className="p-8 border-t border-gold/5 bg-navy/30" onSubmit={sendReply}>
                 <div className="flex gap-4">
                    <div className="flex-1 relative">
                       <input
                         type="text"
                         value={message}
                         onChange={(event) => setMessage(event.target.value)}
                         placeholder="Transmit response..."
                         className="w-full bg-navy border border-gold/10 p-5 font-mono text-[10px] tracking-widest outline-none focus:border-gold/30 transition-all text-cream"
                       />
                       <button type="submit" disabled={isSending} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold transition-colors disabled:opacity-50">
                         <Send className="w-5 h-5" />
                       </button>
                    </div>
                </div>
                 <div className="mt-3 text-[10px] font-mono text-cream/30 uppercase tracking-[0.2em]">
                   {isSending ? 'Dispatching response...' : 'Press Enter to dispatch'}
                 </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-center items-center justify-center opacity-20 flex-col gap-4">
               <MessageSquare className="w-16 h-16 text-gold" />
               <span className="font-mono text-[10px] tracking-[0.5em] uppercase">No active frequency selected</span>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
