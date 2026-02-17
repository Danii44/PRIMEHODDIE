'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth finishes loading and there is no user, send to login
    if (!auth?.loading && !auth?.user) {
      router.push('/auth/login');
    }
  }, [auth, router]);

  if (auth?.loading) {
    return <div className="h-screen bg-[#0B0C0F] flex items-center justify-center animate-pulse" />;
  }

  return auth?.user ? <>{children}</> : null;
}