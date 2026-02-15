'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { getOrders, updateOrderStatus } from '@/lib/firestore-service';
import { Order } from '@/lib/db-types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const statusColors: Record<Order['status'], string> = {
    pending: 'bg-gray-500/20 text-gray-400',
    confirmed: 'bg-yellow-500/20 text-yellow-400',
    shipped: 'bg-blue-500/20 text-blue-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F]">
      {/* Header */}
      <div className="bg-[#12131A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-[#A6ACB8] hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Orders</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#A6ACB8]">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-[#A6ACB8]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#7B2FF7]">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-[#A6ACB8] mb-1">Customer</p>
                    <p className="text-white font-medium">
                      {order.shippingAddress?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A6ACB8] mb-1">Items</p>
                    <p className="text-white font-medium">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A6ACB8] mb-1">Subtotal</p>
                    <p className="text-white font-medium">${order.subtotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A6ACB8] mb-1">Status</p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as Order['status'])
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-medium bg-transparent border ${statusColors[order.status]} cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <p className="text-sm text-white font-medium mb-3">Items Ordered:</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-[#A6ACB8]">
                        <span>
                          {item.productName} (x{item.quantity}) - {item.color}, Size {item.size}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-white font-medium mb-2">Shipping Address:</p>
                  <p className="text-sm text-[#A6ACB8]">
                    {order.shippingAddress?.address}
                    <br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                    {order.shippingAddress?.zip}
                    <br />
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
