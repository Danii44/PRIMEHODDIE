'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useStore } from '@/store/useStore';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Loader2, Filter } from 'lucide-react';
import Link from 'next/link';

// Using a wrapper component to handle the SearchParams correctly in Next.js
function ShopContent() {
  const { products, fetchProducts, isLoading, addToCart } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial category from URL (e.g., /shop?category=Oversized%20Hoodies)
  const categoryQuery = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryQuery);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update internal state if the URL changes
  useEffect(() => {
    setSelectedCategory(categoryQuery);
  }, [categoryQuery]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)))
      .filter((cat): cat is string => typeof cat === 'string');
  }, [products]);

  const filteredProducts = products.filter((p) => 
    selectedCategory ? p.category === selectedCategory : true
  );

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    // Update URL without refreshing the page
    if (cat) {
      router.push(`/shop?category=${encodeURIComponent(cat)}`, { scroll: false });
    } else {
      router.push('/shop', { scroll: false });
    }
  };

  return (
    <main className="max-w-7xl mx-auto pt-32 px-4 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-[#7B2FF7]" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#7B2FF7] uppercase">
              Premium Streetwear
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            THE <span className="text-[#7B2FF7] italic">COLLECTION</span>
          </h1>
        </div>
        <p className="text-white/40 max-w-xs text-sm uppercase tracking-widest font-medium">
          {filteredProducts.length} items available in {selectedCategory || 'All Categories'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-8 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border ${
            selectedCategory === null 
              ? 'bg-[#7B2FF7] border-[#7B2FF7] shadow-[0_0_20px_rgba(123,47,247,0.3)]' 
              : 'bg-white/5 border-white/5 hover:border-white/20'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-8 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border uppercase ${
              selectedCategory === cat 
                ? 'bg-[#7B2FF7] border-[#7B2FF7] shadow-[0_0_20px_rgba(123,47,247,0.3)]' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-[#7B2FF7] animate-spin" />
          <p className="text-xs font-bold tracking-widest text-white/20 uppercase">Syncing with Vault...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-[#16171D]/50 border border-white/5 p-4 rounded-[2.5rem] group hover:bg-[#16171D] hover:border-[#7B2FF7]/30 transition-all duration-500"
            >
              {/* Product Image Wrapper */}
              <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-[1.8rem] mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {/* Overlay Badge */}
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-[#7B2FF7] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                    New Drop
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="flex justify-between items-start mb-6 px-2">
                <div>
                  <h3 className="font-bold text-xl uppercase tracking-tighter group-hover:text-[#7B2FF7] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block font-black text-2xl text-white italic">
                    {product.price}<span className="text-[10px] ml-1 not-italic opacity-50">AED</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => addToCart(
                    product,
                    product.colors?.[0]?.name || 'Standard',
                    'M'
                  )}
                  className="flex-1 bg-white text-black hover:bg-[#7B2FF7] hover:text-white font-black py-7 rounded-2xl transition-all uppercase text-xs gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </Button>
                <Link 
                  href={`/product/${product.id}`}
                  className="w-14 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-2xl transition-all group/btn"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
          <p className="text-white/20 font-black uppercase tracking-tighter text-4xl">No Items Found</p>
          <Button 
            onClick={() => handleCategoryChange(null)}
            className="mt-6 bg-[#7B2FF7] text-white rounded-xl px-10 py-6"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </main>
  );
}

// Main Export with Suspense (Required for useSearchParams in Next.js)
export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#0B0C0F] text-white">
      <Navigation />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-[#0B0C0F]">
          <Loader2 className="w-12 h-12 text-[#7B2FF7] animate-spin" />
        </div>
      }>
        <ShopContent />
      </Suspense>
    </div>
  );
}