'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, Package, ShoppingCart, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts, getOrders } from '@/lib/firestore-service';
import { Product, Order } from '@/lib/db-types';
import { AdminGuard } from '@/components/auth/AdminGuard';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          getAllProducts(),
          getOrders(),
        ]);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Updated Logout logic to redirect to the login page
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out successfully');
      router.push('/auth/login'); 
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0B0C0F]">
        {/* Header - Fixed Navigation Links */}
        <div className="bg-[#12131A] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#7B2FF7]" />
              {/* Logo Link updated to go to Home Screen (/) */}
              <Link href="/" className="text-2xl font-black text-white uppercase italic hover:opacity-80 transition-opacity">
                PRIME<span className="text-[#7B2FF7]">HOODIE</span> 
                <span className="text-xs font-medium text-[#A6ACB8] ml-2 tracking-widest uppercase not-italic">
                  Admin Panel
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Optional: Add a link back to dashboard if you are on sub-pages */}
              <Link href="/admin/dashboard" className="text-sm text-[#A6ACB8] hover:text-white uppercase tracking-widest font-bold hidden md:block">
                Dashboard
              </Link>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* ... (Stats Grid and Navigation Buttons remain the same) */}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A6ACB8] text-sm mb-2 uppercase tracking-widest font-bold">Total Revenue</p>
                  <p className="text-4xl font-black text-[#7B2FF7] italic">
                    {totalRevenue.toLocaleString()} <span className="text-sm">AED</span>
                  </p>
                </div>
                <BarChart3 className="w-12 h-12 text-[#7B2FF7]/30" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A6ACB8] text-sm mb-2 uppercase tracking-widest font-bold">Total Orders</p>
                  <p className="text-4xl font-black text-white italic">{totalOrders}</p>
                </div>
                <ShoppingCart className="w-12 h-12 text-white/30" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A6ACB8] text-sm mb-2 uppercase tracking-widest font-bold">Total Products</p>
                  <p className="text-4xl font-black text-white italic">{totalProducts}</p>
                </div>
                <Package className="w-12 h-12 text-white/30" />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link
              href="/admin/products"
              className="bg-white/5 border border-white/10 hover:border-[#7B2FF7]/50 rounded-xl p-8 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-[#7B2FF7]/10 text-[#7B2FF7] group-hover:bg-[#7B2FF7] group-hover:text-white transition-colors">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase italic">Manage Products</h3>
                  <p className="text-[#A6ACB8]">Add, edit, or delete products</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-white/5 border border-white/10 hover:border-[#7B2FF7]/50 rounded-xl p-8 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-[#7B2FF7]/10 text-[#7B2FF7] group-hover:bg-[#7B2FF7] group-hover:text-white transition-colors">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase italic">View Orders</h3>
                  <p className="text-[#A6ACB8]">Manage customer orders and status</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white uppercase italic">Recent Orders</h3>
              <Link href="/admin/orders" className="text-[#7B2FF7] hover:underline text-sm font-bold uppercase tracking-widest">
                View all
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#7B2FF7] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-[#A6ACB8]">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-[#A6ACB8] text-xs uppercase tracking-widest font-bold">Order ID</th>
                      <th className="text-left py-3 text-[#A6ACB8] text-xs uppercase tracking-widest font-bold">Total</th>
                      <th className="text-left py-3 text-[#A6ACB8] text-xs uppercase tracking-widest font-bold">Status</th>
                      <th className="text-left py-3 text-[#A6ACB8] text-xs uppercase tracking-widest font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 text-white font-mono text-sm">{order.id.slice(0, 8)}</td>
                        <td className="py-4 text-white font-black italic">{order.total.toLocaleString()} AED</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${
                            order.status === 'delivered'
                              ? 'bg-green-500/20 text-green-400'
                              : order.status === 'shipped'
                              ? 'bg-blue-500/20 text-blue-400'
                              : order.status === 'confirmed'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-white/10 text-[#A6ACB8]'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-[#A6ACB8] text-sm font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}