'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Clock, MessageSquare, Search, Send, User } from 'lucide-react';
import { useAdminResource } from '@/hooks/useAdminResource';
import { adminFetch, formatDate } from '@/lib/admin/client';

const priorityColors = {
  LOW: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  URGENT: 'bg-red-50 text-red-700 border-red-200',
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
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Support Hub</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage customer inquiries and provide support.</p>
      </header>

      {/* Filters */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by ticket id, subject, or customer"
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
          />
        </div>
        <select 
          value={status} 
          onChange={(event) => setStatus(event.target.value)} 
          className="block w-full pl-3 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </section>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
        {/* Ticket List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-200 bg-zinc-50/80">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active Inquiries</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`w-full p-4 text-left transition-all ${
                  selectedTicketId === ticket.id ? 'bg-zinc-50 border-l-2 border-l-zinc-900' : 'hover:bg-zinc-50/50 border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                   <span className="text-[10px] font-mono text-zinc-500">{ticket.ticketNumber || ticket.id}</span>
                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${priorityColors[ticket.priority] || priorityColors['LOW']}`}>
                      {ticket.priority}
                   </span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1 truncate">{ticket.subject}</h3>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-zinc-500">{ticket.customerName}</span>
                  <span className="text-xs text-zinc-400">{formatDate(ticket.updatedAt)}</span>
                </div>
              </button>
            ))}

            {!isLoading && !tickets.length && (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-8 h-8 text-zinc-300 mb-3" />
                <p className="text-sm font-medium text-zinc-900">No tickets found</p>
                <p className="text-sm text-zinc-500 mt-1">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Detail & Chat */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col overflow-hidden relative">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-white z-10">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">{selectedTicket.subject}</h2>
                  <div className="flex gap-6 mt-2 text-sm text-zinc-500">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-400" />
                      {selectedTicket.customerName}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      {formatDate(selectedTicket.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-semibold px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200">
                  {selectedTicket.status}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-zinc-50/50">
                 {selectedTicket.messages?.map((entry, idx) => {
                   const isAdmin = entry.sender === 'ADMIN';
                   return (
                     <div key={`${entry.createdAt || idx}-${idx}`} className={`max-w-[80%] flex flex-col gap-1.5 ${isAdmin ? 'ml-auto items-end' : ''}`}>
                       <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isAdmin ? 'bg-zinc-900 text-white rounded-br-sm' : 'bg-white border border-zinc-200 text-zinc-900 rounded-bl-sm shadow-sm'}`}>
                         {entry.text}
                       </div>
                       <span className="text-[10px] font-medium text-zinc-400 px-1 uppercase tracking-wider">
                         {entry.sender} • {formatDate(entry.createdAt)}
                       </span>
                     </div>
                   );
                 })}

                 {!selectedTicket.messages?.length && (
                   <div className="h-full flex items-center justify-center text-sm text-zinc-400">
                     No conversation history yet.
                   </div>
                 )}
              </div>

              {/* Chat Input */}
              <form className="p-4 border-t border-zinc-200 bg-white" onSubmit={sendReply}>
                 <div className="relative flex items-center">
                    <input
                      type="text"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Type a response..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-5 pr-14 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors shadow-sm"
                    />
                    <button 
                      type="submit" 
                      disabled={isSending} 
                      className="absolute right-2 p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                 </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50/50">
               <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 border border-zinc-200">
                 <MessageSquare className="w-8 h-8 text-zinc-300" />
               </div>
               <h3 className="text-base font-semibold text-zinc-900">No conversation selected</h3>
               <p className="text-sm text-zinc-500 mt-1">Select an active inquiry from the list to view or respond.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
