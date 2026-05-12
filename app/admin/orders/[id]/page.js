'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  MapPin,
  CreditCard,
  ChevronRight,
  ExternalLink,
  Printer,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { adminFetch, formatCurrency, formatDate } from '@/lib/admin/client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const statusSteps = [
  { label: 'Confirmed', value: 'confirmed', icon: CheckCircle2, color: 'text-green-500' },
  { label: 'Pending', value: 'PENDING', icon: Clock, color: 'text-amber-500' },
  { label: 'Processing', value: 'PROCESSING', icon: Package, color: 'text-blue-500' },
  { label: 'Shipped', value: 'SHIPPED', icon: Truck, color: 'text-indigo-500' },
  { label: 'Delivered', value: 'DELIVERED', icon: ShoppingBag, color: 'text-zinc-700' },
  { label: 'Cancelled', value: 'CANCELLED', icon: XCircle, color: 'text-red-500' },
];

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await adminFetch(`/api/admin/orders/${id}`);
      setOrder(data);
    } catch (err) {
      toast.error('Failed to load order details');
      router.push('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (nextStatus) => {
    setIsUpdating(true);
    try {
      await adminFetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      setOrder({ ...order, status: nextStatus });
      toast.success(`Order marked as ${nextStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) return null;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                  Order {order.orderNumber || `#${order._id.substring(0, 8)}`}
                </h1>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                    order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <Printer size={16} />
              Print Invoice
            </button>
          </div>
        </header>

        {/* Premium Invoice Print Template (Hidden by default) */}
        <div className="print-only hidden print:block bg-white p-12 text-zinc-900 min-h-screen">
          <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-8 mb-12">
            <div>
              <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold font-serif italic">F</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">Punjab Optical</h1>
              <p className="text-xs text-zinc-500 uppercase tracking-[0.3em] font-medium mt-1">Premium Eyewear Collective</p>
            </div>
            <div className="text-right">
              <h2 className="text-5xl font-black text-zinc-100 uppercase absolute right-12 top-12 -z-10 opacity-50">INVOICE</h2>
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900">Order No: {order.orderNumber || `#${order._id.substring(0, 8)}`}</p>
                <p className="text-xs text-zinc-500">Date: {formatDate(order.createdAt)}</p>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest pt-2">Status: {order.status}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-20 mb-16">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Billed To</h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-zinc-900">{order.customer?.name || 'Valued Customer'}</p>
                <p className="text-sm text-zinc-600">{order.customer?.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Shipping Address</h3>
              {order.address ? (
                <div className="text-sm text-zinc-700 leading-relaxed">
                  <p className="font-bold text-zinc-900 mb-1 uppercase tracking-tight">{order.address.name}</p>
                  <p>{order.address.addressLine}, {order.address.area}</p>
                  <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  <p className="font-mono font-bold mt-2 text-zinc-900">PH: {order.address.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-zinc-400 italic">No address details available</p>
              )}
            </div>
          </div>

          <table className="w-full mb-16">
            <thead>
              <tr className="border-y border-zinc-900">
                <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest">Description</th>
                <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest">Qty</th>
                <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest">Price</th>
                <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-6">
                    <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{item.brand}</p>
                    <p className="text-xs text-zinc-500 mt-1">{item.name}</p>
                  </td>
                  <td className="py-6 text-center text-sm font-mono text-zinc-600">{item.quantity}</td>
                  <td className="py-6 text-right text-sm font-mono text-zinc-600">{formatCurrency(item.price)}</td>
                  <td className="py-6 text-right text-sm font-bold text-zinc-900 font-mono">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end border-t-2 border-zinc-900 pt-8">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 uppercase tracking-widest font-bold text-[10px]">Subtotal</span>
                <span className="text-zinc-900 font-mono">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 uppercase tracking-widest font-bold text-[10px]">Shipping</span>
                <span className="text-zinc-900 font-mono">₹0.00</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                <span className="text-lg font-black uppercase tracking-tighter italic text-zinc-900">Total Amount</span>
                <span className="text-2xl font-black text-zinc-900">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-40 pt-12 border-t border-zinc-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">Thank you for choosing Punjab Optical</p>
            <p className="text-[8px] text-zinc-400 mt-4 max-w-md mx-auto leading-relaxed">
              This is a computer generated document. For any queries regarding this invoice, please contact support@punjaboptical.com citing your order reference number.
            </p>
          </div>
        </div>

        <div className="print:hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <section className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900">Order Items</h2>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">{order.items?.length || 0} items</span>
              </div>
              <div className="divide-y divide-zinc-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="p-6 flex items-center gap-4 hover:bg-zinc-50/50 transition-colors">
                    <div className="w-16 h-16 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Package size={24} className="text-zinc-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-bold text-zinc-900 truncate uppercase tracking-tight">{item.brand}</div>
                        <div className="text-sm font-bold text-zinc-900">{formatCurrency(item.price)}</div>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">{item.name}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] text-zinc-400 font-mono">Qty: {item.quantity}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">SKU: {item.sku || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-50/50 p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-zinc-900 font-medium">{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-3 border-t border-zinc-200 flex justify-between items-center">
                  <span className="text-base font-bold text-zinc-900 uppercase tracking-tight">Total Amount</span>
                  <span className="text-xl font-black text-zinc-900">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </section>

            {/* Timeline / Status Update */}
            <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
              <h2 className="font-semibold text-zinc-900 mb-6">Fulfillment Pipeline</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {statusSteps.map((step) => {
                  const isActive = order.status === step.value;
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.value}
                      onClick={() => updateStatus(step.value)}
                      disabled={isUpdating}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${isActive
                          ? `border-zinc-900 bg-zinc-900 text-white shadow-md`
                          : 'border-zinc-100 bg-white hover:border-zinc-300 text-zinc-500'
                        }`}
                    >
                      <Icon size={20} className={isActive ? 'text-white' : step.color} />
                      <span className="text-[10px] font-bold uppercase tracking-widest mt-2">{step.label}</span>
                      {isActive && <div className="w-1 h-1 bg-white rounded-full mt-1 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Customer</h2>
              {order.customer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                      <User size={18} className="text-zinc-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900">{order.customer.name}</div>
                      <div className="text-xs text-zinc-500">{order.customer.email}</div>
                    </div>
                  </div>
                  <Link
                    href={`/admin/users?q=${order.customer.email}`}
                    className="flex items-center justify-between text-xs font-bold text-zinc-900 hover:text-gold transition-colors pt-2 border-t border-zinc-50"
                  >
                    View Profile
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">Guest Checkout or User Not Found</p>
              )}
            </section>

            {/* Shipping Address */}
            <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Shipping</h2>
                <MapPin size={14} className="text-zinc-300" />
              </div>
              {order.address ? (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{order.address.name}</div>
                  <div className="text-xs text-zinc-600 leading-relaxed">
                    {order.address.addressLine}, {order.address.area}<br />
                    {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                    <span className="block mt-2 font-mono font-bold text-zinc-900 tracking-tighter">PH: {order.address.phone}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">Address data not found</p>
              )}
            </section>

            {/* Payment Details */}
            <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Payment</h2>
                <CreditCard size={14} className="text-zinc-300" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{order.paymentMethod || 'Razorpay'}</span>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded">Paid</span>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-50">
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Transaction Ref</div>
                <div className="text-[10px] font-mono font-bold text-zinc-900 break-all">{order.paymentId || 'TXN_REF_ARCHIVE_5592'}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
