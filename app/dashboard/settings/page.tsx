'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name || '');

  const handleUpdate = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { name });
      
      // Update local state
      setUser({ ...user, name });
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F] pt-28 px-4 text-white">
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h2 className="text-2xl font-black uppercase italic mb-6 text-[#7B2FF7]">Account Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#A6ACB8] mb-2 uppercase font-bold">Display Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="prime-input" 
            />
          </div>
          <div>
            <label className="block text-sm text-[#A6ACB8] mb-2 uppercase font-bold">Email Address</label>
            <input value={user?.email} disabled className="prime-input opacity-50 cursor-not-allowed" />
          </div>
          <Button onClick={handleUpdate} className="w-full prime-btn-primary py-6 mt-4">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}