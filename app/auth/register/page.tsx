'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createStoreUser } from '@/lib/firestore-service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: formData.name,
      });

      // FIX: Added createdAt and updatedAt to satisfy the StoreUser type
      await createStoreUser(firebaseUser.uid, {
        name: formData.name,
        email: formData.email,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success('Account created successfully!');
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#12131A]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center md:text-left">
            <Link href="/" className="text-2xl font-black text-white mb-6 block tracking-tighter italic">
              PRIME<span className="text-[#7B2FF7]">HOODIE</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2 uppercase italic">Join the Movement</h1>
            <p className="text-[#A6ACB8] text-sm">Create an account for exclusive drops and faster checkout.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#A6ACB8] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6ACB8]" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#7B2FF7] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#A6ACB8] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6ACB8]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#7B2FF7] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#A6ACB8] mb-2">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6ACB8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:border-[#7B2FF7] focus:outline-none transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6ACB8] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#A6ACB8] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6ACB8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#7B2FF7] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7B2FF7] hover:bg-white hover:text-black text-white font-black uppercase italic py-7 rounded-xl transition-all duration-300 disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(123,47,247,0.3)]"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>

            <p className="text-center text-sm text-[#A6ACB8] mt-6">
              Already a member?{' '}
              <Link
                href="/auth/login"
                className="text-[#7B2FF7] hover:text-white font-bold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link
              href="/"
              className="text-center block text-xs font-bold text-[#A6ACB8] hover:text-[#7B2FF7] transition-colors uppercase tracking-widest"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}