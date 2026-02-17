'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, ShieldCheck, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPath = pathname.startsWith('/admin');

  // Get store state
  const { setIsCartOpen, getCartCount, user, isAuthenticated } = useStore();
  
  const isAdmin = user?.role === 'admin';
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out');
      setIsMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Customize', href: '/customize' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin/dashboard' }] : []),
    ...(isAuthenticated && !isAdmin ? [{ label: 'Account', href: '/dashboard' }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0B0C0F]/90 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO SECTION */}
          <Link href="/" className="text-xl lg:text-3xl font-black tracking-tighter text-white italic uppercase flex items-center gap-2">
            PRIME<span className="text-[#7B2FF7]">HOODIE</span>
            {isAdminPath && (
              <span className="text-[10px] bg-[#7B2FF7] text-white px-2 py-0.5 rounded not-italic tracking-normal font-bold">
                ADMIN
              </span>
            )}
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs font-black transition-colors uppercase tracking-[0.2em] ${
                  pathname === link.href ? 'text-[#7B2FF7]' : 'text-[#A6ACB8] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2 text-[#A6ACB8] hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#A6ACB8] hover:text-white transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7B2FF7] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0B0C0F]">
                  {cartCount}
                </span>
              )}
            </button>
            
            <Link 
              href={isAdmin ? "/admin/dashboard" : isAuthenticated ? "/dashboard" : "/auth/login"}
              className={`p-2 transition-colors ${isAuthenticated ? 'text-[#7B2FF7]' : 'text-[#A6ACB8] hover:text-white'}`}
            >
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </Link>

            {/* MOBILE MENU TRIGGER */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-[#A6ACB8] hover:text-white">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0B0C0F] border-white/10 text-white p-8 flex flex-col">
                  <div className="flex flex-col gap-6 mt-12 flex-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-3xl font-black italic uppercase tracking-tighter transition-colors ${
                          pathname === link.href ? 'text-[#7B2FF7]' : 'hover:text-[#7B2FF7]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* LOGOUT BUTTON IN MOBILE MENU */}
                  {isAuthenticated && (
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-red-500 font-black uppercase italic tracking-widest text-sm pt-6 border-t border-white/10"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}