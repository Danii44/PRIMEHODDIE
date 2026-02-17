import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ConditionalNavigation } from '@/components/ConditionalNavigation'; // Use the conditional version

// Define fonts
const geist = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans', // Add CSS variable for use
});
const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono', // Add CSS variable for use
});

export const metadata: Metadata = {
  title: 'Prime Hoodie - Premium Hoodies & Customization',
  description: 'Design your perfect Hoodie with our 3D customizer.',
  keywords: 'Hoodies, custom Hoodies, 3D customizer, premium fashion, streetwear',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#7B2FF7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
          {`
            .noise-overlay {
              position: fixed;
              top: 0; left: 0;
              width: 100%; height: 100%;
              pointer-events: none;
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='1' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
              opacity: 0.5;
              z-index: 0;
            }
          `}
        </style>
      </head>
      {/* Fixed: Both font variables applied to body to clear the 'unused' warning */}
      <body className={`${geist.variable} ${geistMono.variable} ${geist.className} bg-[#0B0C0F] text-white antialiased`} suppressHydrationWarning>
        <div className="noise-overlay" />
        <AuthProvider>
          {/* Handles hiding the bar for /admin routes */}
          <ConditionalNavigation /> 
          
          <main className="relative z-10">
            {children}
          </main>

          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: '#12131A',
                color: '#F2F4F8',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}