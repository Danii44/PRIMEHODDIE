'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { getOrders } from '@/lib/firestore-service';
import { Order } from '@/lib/db-types';

export default function UserOrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      getOrders(user.id).then(setOrders);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0B0C0F] pt-28 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8">My <span className="text-[#7B2FF7]">Orders</span></h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[#A6ACB8]">No orders found yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-mono text-xs text-[#7B2FF7] uppercase">Order #{order.id.slice(0,8)}</p>
                  <p className="text-lg font-bold">{order.total.toLocaleString()} AED</p>
                </div>
                <div className="text-right">
                  <span className="bg-[#7B2FF7]/20 text-[#7B2FF7] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}