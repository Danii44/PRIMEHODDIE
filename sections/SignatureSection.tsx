'use client';

import { Check, Ruler, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function SignatureSection() {
  const features = [
    '400gsm Heavyweight Cotton',
    'Oversized Fit',
    'Dropped Shoulders',
    'Double-Stitched Hem',
    'Pre-Shrunk Fabric',
    'Brushed Interior',
  ];

  return (
    <section
      id="signature"
      className="prime-section relative overflow-hidden"
      style={{ zIndex: 30 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/backgrounds/signature-bg.jpg"
          alt="Signature Hoodie"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C0F]/70 via-[#0B0C0F]/50 to-[#0B0C0F]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full prime-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Content */}
          <div className="animate-fade-in-left">
            <h2 className="prime-headline text-white mb-6 uppercase tracking-tighter">
              SIGNATURE
              <br />
              <span className="text-[#7B2FF7]">Hoodie</span>
            </h2>
            
            <p className="prime-subheadline max-w-md mb-8 text-white/70">
              Heavyweight cotton. Brushed interior. Built to last. 
              Our signature piece that defines the Prime standard.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7B2FF7]/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#7B2FF7]" />
                  </div>
                  <span className="text-sm font-medium text-[#A6ACB8]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Specs Card */}
          <div className="flex justify-end">
            <div className="w-full max-w-md prime-glass rounded-[2rem] p-8 lg:p-10 animate-fade-in-right border border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#7B2FF7]/20 flex items-center justify-center">
                  <Ruler className="w-7 h-7 text-[#7B2FF7]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Size Guide</h3>
                  <p className="text-sm text-[#A6ACB8]">Precision engineered fit</p>
                </div>
              </div>

              {/* Size Table Header */}
              <div className="grid grid-cols-4 gap-2 text-[10px] font-black uppercase tracking-widest text-[#7B2FF7] mb-4 px-2">
                <span>Size</span>
                <span>Chest</span>
                <span>Length</span>
                <span>Sleeve</span>
              </div>

              {/* Size Table Body */}
              <div className="space-y-1">
                {[
                  { size: 'S', chest: '38"', length: '26"', sleeve: '24"' },
                  { size: 'M', chest: '40"', length: '27"', sleeve: '25"' },
                  { size: 'L', chest: '42"', length: '28"', sleeve: '26"' },
                  { size: 'XL', chest: '44"', length: '29"', sleeve: '27"' },
                  { size: 'XXL', chest: '46"', length: '30"', sleeve: '28"' },
                ].map((row) => (
                  <div
                    key={row.size}
                    className="grid grid-cols-4 gap-2 text-sm py-3 px-2 rounded-xl hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                  >
                    <span className="font-bold text-white">{row.size}</span>
                    <span className="text-[#A6ACB8]">{row.chest}</span>
                    <span className="text-[#A6ACB8]">{row.length}</span>
                    <span className="text-[#A6ACB8]">{row.sleeve}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-[#A6ACB8]/60 mt-6 leading-relaxed italic">
                * All measurements are in inches. Our oversized fit is generous; if you prefer a standard fit, we recommend sizing down.
              </p>

              {/* ACTION BUTTON - Redirecting to the actual 3D Visualizer */}
              <Link 
                href="/customize" 
                className="w-full mt-8 flex items-center justify-center gap-3 py-4 bg-[#7B2FF7] hover:bg-[#8e4dfa] text-white font-black uppercase text-xs rounded-xl transition-all group"
              >
                Start Customizing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}