'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, ShieldCheck, Truck, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const { id } = useParams();
  const { products, fetchProducts, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');

  // Find the specific product
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (product?.colors?.[0]) setSelectedColor(product.colors[0].name);
  }, [products, product, fetchProducts]);

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0C0F] text-white">
        <Loader2 className="animate-spin text-[#7B2FF7]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C0F] text-white">
      <Navigation />

      <main className="max-w-7xl mx-auto pt-32 px-4 pb-20">
        {/* Breadcrumb */}
        <Link href="/shop" className="flex items-center gap-2 text-white/40 hover:text-[#7B2FF7] transition-colors mb-8 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Collection</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/5 border border-white/10">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* If you have multiple images in Firebase, map them here */}
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#7B2FF7]/10 text-[#7B2FF7] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold text-white">{product.rating}</span>
                  <span className="text-white/20 text-xs">({product.reviews} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
                {product.name}
              </h1>
              
              <p className="text-3xl font-black text-[#7B2FF7] italic">
                {product.price} AED
              </p>
            </div>

            <p className="text-white/60 leading-relaxed mb-8 text-lg">
              {product.description || "Premium heavyweight construction with our signature oversized fit. Engineered for the perfect drape and lasting comfort."}
            </p>

            {/* Color Selection */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/40">Select Color: <span className="text-white">{selectedColor}</span></h4>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-xl border-2 transition-all ${
                      selectedColor === color.name ? 'border-[#7B2FF7] scale-110' : 'border-transparent opacity-50'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Select Size</h4>
                <button className="text-[10px] font-bold text-[#7B2FF7] uppercase underline">Size Guide</button>
              </div>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all border ${
                      selectedSize === size 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Action */}
            <Button 
              onClick={() => addToCart(product, selectedColor, selectedSize)}
              className="w-full bg-[#7B2FF7] hover:bg-[#8e4dfa] text-white font-black py-8 rounded-[2rem] text-xl uppercase italic tracking-tighter mb-8 shadow-[0_20px_40px_rgba(123,47,247,0.3)]"
            >
              Add to Bag — {product.price} AED
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-white/5">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-white/20" />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-white/40">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="w-5 h-5 text-white/20" />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-white/40">14 Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white/20" />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-white/40">Secure Pay</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}