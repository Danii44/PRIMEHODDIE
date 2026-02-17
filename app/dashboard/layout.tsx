'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

const sidebarLinks = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Orders', href: '/dashboard/orders', icon: Package },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#12131A] border-r border-white/5 flex-col fixed inset-y-0 pt-24">
        <div className="flex-1 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase italic text-xs tracking-widest transition-all ${
                  isActive ? 'bg-[#7B2FF7] text-white' : 'text-[#A6ACB8] hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 font-bold uppercase italic text-xs">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-32 px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}