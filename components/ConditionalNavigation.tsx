'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

export function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Define which paths should NOT show the normal navbar
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return null; // Don't render anything on admin pages
  }

  return <Navigation />;
}