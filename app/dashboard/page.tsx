'use client';

import { useStore } from '@/store/useStore';
import { Package, User, Settings, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-[#0B0C0F] text-white pt-28 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic uppercase italic tracking-tighter">
            Account <span className="text-[#7B2FF7]">Overview</span>
          </h1>
          <p className="text-[#A6ACB8] mt-2">Welcome back, {user?.name || 'User'}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Status Card */}
          <Link href="/dashboard/orders" className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[#7B2FF7]/50 transition-all">
            <Package className="w-10 h-10 text-[#7B2FF7] mb-4" />
            <h3 className="text-xl font-bold uppercase italic">My Orders</h3>
            <p className="text-[#A6ACB8] text-sm mt-2">Track your active shipments and history.</p>
          </Link>

          {/* Settings Card */}
          <Link href="/dashboard/settings" className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[#7B2FF7]/50 transition-all">
            <Settings className="w-10 h-10 text-[#7B2FF7] mb-4" />
            <h3 className="text-xl font-bold uppercase italic">Settings</h3>
            <p className="text-[#A6ACB8] text-sm mt-2">Update your profile and shipping details.</p>
          </Link>

          {/* Shop Card */}
          <Link href="/shop" className="group bg-[#7B2FF7] p-8 rounded-2xl hover:bg-white hover:text-black transition-all">
            <ShoppingBag className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold uppercase italic">New Drops</h3>
            <p className="opacity-80 text-sm mt-2">Browse the latest Prime Hoodie collection.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}