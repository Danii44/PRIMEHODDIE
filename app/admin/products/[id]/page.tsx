'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { addProduct, updateProduct, getProduct } from '@/lib/firestore-service';

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const isEdit = productId !== 'new' && !!productId;

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initial state ensures all fields are defined
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    image: '/placeholder.svg?height=400&width=300',
    inStock: true,
    stock: 0,
  });

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [isEdit, productId]);

  const loadProduct = async () => {
    try {
      const product = await getProduct(productId);
      if (product) {
        // We use || and ?? to prevent fields from becoming 'undefined' 
        // if they are missing in the Firestore document
        setFormData({
          name: product.name || '',
          price: product.price || 0,
          description: product.description || '',
          category: product.category || '',
          image: product.image || '/placeholder.svg?height=400&width=300',
          inStock: product.inStock ?? true,
          stock: product.stock || 0,
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (isEdit) {
        await updateProduct(productId, {
          ...payload,
          id: productId,
        } as any);
        toast.success('Product updated successfully');
      } else {
        await addProduct({
          ...payload,
          createdAt: new Date().toISOString(),
        } as any);
        toast.success('Product added successfully');
      }
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7B2FF7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C0F]">
      {/* Header */}
      <div className="bg-[#12131A] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-[#A6ACB8] hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white italic uppercase tracking-tight">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest italic">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#A6ACB8] uppercase tracking-widest mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7] transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A6ACB8] uppercase tracking-widest mb-2">Price (AED)</label>
                  <input
                    type="number"
                    // Handling empty string to prevent NaN
                    value={formData.price || ''} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7] transition-colors"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#A6ACB8] uppercase tracking-widest mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock || ''}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A6ACB8] uppercase tracking-widest mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7] transition-colors min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A6ACB8] uppercase tracking-widest mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Oversized, Streetwear"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#A6ACB8] uppercase tracking-widest mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7] transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#7B2FF7] focus:ring-[#7B2FF7]"
                />
                <label htmlFor="inStock" className="text-sm font-medium text-white cursor-pointer select-none">
                  Visible in store (In Stock)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#7B2FF7] hover:bg-[#6a28d9] text-white font-bold py-6 rounded-xl transition-all disabled:opacity-50 uppercase italic"
            >
              {isSaving ? 'Processing...' : isEdit ? 'Update Product' : 'Create Product'}
            </Button>
            <Link href="/admin/products" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 py-6 rounded-xl uppercase font-bold italic"
              >
                Discard Changes
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}