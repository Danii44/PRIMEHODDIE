'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToCollection = () => {
    const element = document.querySelector('#collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToShop = () => {
    router.push('/shop');
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="prime-section relative overflow-hidden min-h-screen"
      style={{ zIndex: 10 }}
    >
      {/* Background Image - Slow Parallax */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-110' : 'opacity-0 scale-125'
        }`}
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) scale(1.1)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <img
          src="/images/backgrounds/hero-bg.jpg"
          alt="Premium Hoodie"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0B0C0F]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full prime-container pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-20">
          
          {/* Left Content - Medium Parallax */}
          <div 
            className="flex flex-col justify-center"
            style={{
              transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <h1
              className={`prime-headline text-white mb-6 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <span className="inline-block">WEAR</span>{' '}
              <span className="inline-block">THE</span>{' '}
              <span className="inline-block text-[#7B2FF7]">PRIME.</span>
            </h1>
            
            <p
              className={`prime-subheadline max-w-md mb-8 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Premium Hoodies built for movement, designed for the city. 
              Experience the perfect blend of comfort and style.
            </p>
            
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <button 
                onClick={navigateToShop}
                className="prime-btn-primary group flex items-center gap-2 bg-[#7B2FF7] hover:bg-[#8e4dfa] text-white px-8 py-4 rounded-2xl font-bold transition-all"
              >
                Shop the Drop
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={scrollToCollection}
                className="prime-btn-outline border border-white/20 hover:border-[#7B2FF7] text-white px-8 py-4 rounded-2xl font-bold transition-all"
              >
                Explore Collection
              </button>
            </div>
          </div>

          {/* Right Content - Strong Parallax */}
          <div 
            className="relative flex items-center justify-center lg:justify-end"
            style={{
              transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <div
              className={`relative w-full max-w-md lg:max-w-lg transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
            >
              {/* Glow Effect - Moves opposite to create depth */}
              <div 
                className="absolute inset-0 bg-[#7B2FF7]/20 blur-[100px] rounded-full" 
                style={{
                  transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
                }}
              />
              
              {/* Hoodie Image - Tilt Effect */}
              <img
                src="/images/products/Hoddie-black.png"
                alt="Prime Hoodie"
                className="relative z-10 w-full h-auto drop-shadow-2xl animate-float"
                style={{
                  filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6))',
                  transform: `rotateX(${mousePos.y * -10}deg) rotateY(${mousePos.x * 10}deg)`,
                }}
              />
              
              {/* Floating Badge */}
              <div 
                className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center animate-bounce duration-[3s]"
                style={{
                  transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
                }}
              >
                <span className="text-2xl font-black text-[#7B2FF7] italic">NEW</span>
              </div>
              
              {/* Price Tag - Stays anchored but moves slightly with container */}
              <div className="absolute -bottom-4 -left-4 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                <p className="text-xs text-[#A6ACB8] uppercase font-bold tracking-widest">Starting from</p>
                <p className="text-2xl font-black text-white">69 AED</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToCollection}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A6ACB8] hover:text-white transition-colors cursor-pointer"
      >
        <span className="text-xs uppercase tracking-widest font-bold">Explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
}