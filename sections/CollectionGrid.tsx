'use client';

import { useEffect } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface CollectionGridProps {
  onProductClick: (categoryName: string) => void;
}

export function CollectionGrid({ onProductClick }: CollectionGridProps) {
  const { fetchProducts, getCategories, isLoading, products } = useStore();
  
  // Fetch products on mount if not already loaded
  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [fetchProducts, products.length]);

  const categories = getCategories();

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center items-center bg-[#0B0C0F]">
        <Loader2 className="w-10 h-10 text-[#7B2FF7] animate-spin" />
      </div>
    );
  }

  return (
    <section id="collection" className="relative py-24 lg:py-32 bg-[#0B0C0F]" style={{ zIndex: 40 }}>
      <div className="prime-container">
        <div className="mb-12 lg:mb-16">
          <h2 className="prime-headline text-white mb-4 uppercase italic">COLLECTION</h2>
          <p className="prime-subheadline max-w-xl text-white/50">
            {categories.length > 0 
              ? `Exploring ${products.length} designs across ${categories.length} style categories.`
              : "No products found in the database."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`category-card group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
              onClick={() => onProductClick(category.name)}
            >
              {/* Background Image */}
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/20 to-transparent opacity-90" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-[#7B2FF7] mb-2 uppercase">
                      {category.count} {category.count === 1 ? 'Product' : 'Products'}
                    </p>
                    <h3 className="text-2xl lg:text-4xl font-black text-white group-hover:text-[#7B2FF7] transition-colors uppercase italic tracking-tighter">
                      {category.name}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Subtle Border */}
              <div className="absolute inset-0 rounded-3xl border border-white/5 group-hover:border-[#7B2FF7]/30 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}