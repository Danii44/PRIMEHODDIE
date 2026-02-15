'use client';

import { useState, use } from 'react'; // Import 'use' from react
import { Navigation } from '@/components/Navigation';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Star, ShoppingBag } from 'lucide-react';
import { useStore, Product } from '@/lib/store';
import { toast } from 'sonner';
import Link from 'next/link';

// Mock product - replace with Firestore data later
const MOCK_PRODUCT: Product = {
  id: '1',
  name: 'Street Essential Hoodie',
  price: 89,
  image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
  category: 'Oversized',
  description: 'Our signature oversized Hoodie crafted from 400gsm premium cotton fleece. Features dropped shoulders, double-stitched hem, and a relaxed fit that moves with you.',
  inStock: true,
};

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#808080' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Navy', value: '#001F3F' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// FIX: params is a Promise in Next.js 15
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the promise using React's use() hook or make the component async
  const resolvedParams = use(params); 
  const productId = resolvedParams.id;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);
  
  // Store actions
  const { addToCart, addToWishlist, isInWishlist, setIsCartOpen } = useStore();
  const isWishlisted = isInWishlist(MOCK_PRODUCT.id);

  const handleAddToCart = () => {
    addToCart({
      product: MOCK_PRODUCT,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    toast.success('Added to cart!');
    setIsCartOpen(true); // Automatically open cart drawer to show progress
  };

  const handleWishlist = () => {
    addToWishlist(MOCK_PRODUCT);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F]">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Image Section */}
            <div className="space-y-8">
              <div className="aspect-[4/5] bg-white/5 rounded-2xl overflow-hidden border border-white/10 group">
                <img
                  src={MOCK_PRODUCT.image}
                  alt={MOCK_PRODUCT.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Color Selector */}
              <div>
                <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Available Colors</h3>
                <div className="flex gap-4">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === color.name
                          ? 'border-[#7B2FF7] scale-110 shadow-[0_0_15px_rgba(123,47,247,0.5)]'
                          : 'border-transparent hover:border-white/30'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#7B2FF7]/10 text-[#7B2FF7] text-xs font-bold rounded-full border border-[#7B2FF7]/20">
                    NEW ARRIVAL
                  </span>
                  <span className="text-white/40 text-sm">ID: {productId}</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">
                  {MOCK_PRODUCT.name}
                </h1>
                <p className="text-[#A6ACB8] text-lg leading-relaxed">{MOCK_PRODUCT.description}</p>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                <div>
                  <p className="text-5xl font-black text-[#7B2FF7] italic tracking-tighter">
                    ${MOCK_PRODUCT.price}
                  </p>
                  <p className={`text-sm mt-2 font-bold ${MOCK_PRODUCT.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {MOCK_PRODUCT.inStock ? '● IN STOCK' : '● OUT OF STOCK'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#7B2FF7] text-[#7B2FF7]" />
                    ))}
                  </div>
                  <span className="text-[#A6ACB8] text-xs font-bold uppercase tracking-widest">128 REVIEWS</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">Select Size</h3>
                  <button className="text-white/40 text-xs underline hover:text-white">Size Guide</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 rounded-lg font-black transition-all ${
                        selectedSize === size
                          ? 'bg-[#7B2FF7] text-white shadow-[0_0_20px_rgba(123,47,247,0.3)]'
                          : 'bg-white/5 border border-white/10 text-white hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4 mb-10">
                <div className="flex gap-4">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <Button
                    onClick={handleAddToCart}
                    disabled={!MOCK_PRODUCT.inStock}
                    className="flex-1 bg-white text-black hover:bg-[#7B2FF7] hover:text-white transition-all duration-500 py-6 font-black uppercase italic tracking-tighter text-lg"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Bag
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleWishlist}
                    variant="outline"
                    className="flex-1 border-white/10 text-white hover:bg-white/5 py-6 font-bold"
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </Button>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 px-6">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-white font-bold text-xs uppercase mb-1">Fast Delivery</span>
                  <span className="text-white/40 text-[10px] text-center">3-5 Business Days</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-white font-bold text-xs uppercase mb-1">Easy Returns</span>
                  <span className="text-white/40 text-[10px] text-center">30-Day Guarantee</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-white font-bold text-xs uppercase mb-1">Secure Pay</span>
                  <span className="text-white/40 text-[10px] text-center">100% Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer />
    </div>
  );
}