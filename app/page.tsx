"use client";

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { HeroSection } from '@/sections/HeroSection';
import { NewDropSection } from '@/sections/NewDropSection';
import { SignatureSection } from '@/sections/SignatureSection';
import { CollectionGrid } from '@/sections/CollectionGrid';
import { UrbanFitSection } from '@/sections/UrbanFitSection';
import { BestSellerSection } from '@/sections/BestSellerSection';
import { StudioDetailSection } from '@/sections/StudioDetailSection';
import { ColorwaysSection } from '@/sections/ColorwaysSection';
import { NightModeSection } from '@/sections/NightModeSection';
import { EssentialsStackSection } from '@/sections/EssentialsStackSection';
import { FinalCTASection } from '@/sections/FinalCTASection';
import { Footer } from '@/sections/Footer';
import { Navigation } from '@/components/Navigation';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollReveal } from '@/components/ScrollReveal'; // Import the wrapper
import { MarqueeBanner } from '@/components/MarqueeBanner'; // Import the wrapper

export default function Home() {
  const { fetchProducts, products, isLoading } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (product: any) => {
    console.log("Selected product details:", product);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#0B0C0F] flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7B2FF7] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#7B2FF7] font-bold tracking-widest uppercase animate-pulse">
            Syncing Prime Collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0B0C0F] selection:bg-[#7B2FF7] selection:text-white">
      {/* 1. Global Background Effects */}
      <div className="noise-overlay fixed inset-0 z-0 opacity-20 pointer-events-none" />
      
      {/* Subtle Glow following the scroll */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7B2FF7]/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <Navigation />
      
      <main className="relative z-10">
        {/* Hero doesn't need ScrollReveal because it's already visible on load */}
        <HeroSection />
        
        {/* 2. Wrapped Sections for 'Reveal' Effect */}
        <ScrollReveal>
          <NewDropSection onProductClick={handleProductClick} />
        </ScrollReveal>
        
        <ScrollReveal>
          <SignatureSection />
        </ScrollReveal>
        
        {/* EYE-CATCHING BREAK: Marquee */}
        <MarqueeBanner />

        <ScrollReveal>
          <CollectionGrid />
        </ScrollReveal>
        
        <ScrollReveal>
          <UrbanFitSection />
        </ScrollReveal>
        
        <ScrollReveal>
          <BestSellerSection onProductClick={handleProductClick} />
        </ScrollReveal>
        
        <ScrollReveal>
          <StudioDetailSection />
        </ScrollReveal>

        <ScrollReveal>
          <ColorwaysSection />
        </ScrollReveal>

        <ScrollReveal>
          <NightModeSection />
        </ScrollReveal>

        <ScrollReveal>
          <EssentialsStackSection />
        </ScrollReveal>

        <ScrollReveal>
          <FinalCTASection />
        </ScrollReveal>

        <Footer />
      </main>
      
      <CartDrawer />
    </div>
  );
}