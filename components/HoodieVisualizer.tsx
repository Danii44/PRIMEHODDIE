'use client';

import React, { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  useGLTF,
  Decal,
  useTexture,
  ContactShadows,
  Center
} from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Upload, RefreshCcw, Loader2 } from 'lucide-react';
import * as THREE from 'three';

// 1. Error Boundary to prevent the "Client-side exception" crash
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-[#050505] text-white p-10 text-center">
          <h2 className="text-xl font-bold mb-4">Graphics Error</h2>
          <p className="text-white/50 mb-6">There was an issue loading the 3D engine. Please refresh the page.</p>
          <Button onClick={() => window.location.reload()} className="bg-[#7B2FF7]">Refresh Studio</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

function HoodieModel({ baseColor, logoImage, logoScale, logoY, logoSide }: any) {
  // Load model and texture
  const { scene } = useGLTF('/hoodie.glb');
  const logoTexture = useTexture(logoImage);

  // Apply materials and fix "Swiss Cheese" transparency holes
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        // We create a fresh material to override any baked-in Sketchfab transparency
        child.material = new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.6,
          metalness: 0.1,
          side: THREE.DoubleSide, // FIX: Renders both sides to fill holes
          transparent: false,
          depthWrite: true,
        });
        child.castShadow = true;
        child.receiveShadow = true;
        
        // FIX: Recompute normals to ensure light hits correctly
        child.geometry.computeVertexNormals();
      }
    });
  }, [scene, baseColor]);

  // Based on your GLB analysis: 
  // Model sits between Y=97 and Y=176. Center is ~136.
  const rotationY = logoSide === 'front' ? 0 : Math.PI;
  const decalZ = logoSide === 'front' ? 22 : -22; 

  return (
    <group position={[0, -136, 0]}> {/* Shift down to center the hoodie in view */}
      <primitive object={scene} />

      {/* Logo Placement */}
      <Decal
        position={[0, logoY, decalZ]} 
        rotation={[0, rotationY, 0]}
        scale={[logoScale, logoScale, 50]}
      >
        <meshStandardMaterial
          map={logoTexture}
          transparent
          polygonOffset
          polygonOffsetFactor={-10} // Ensures logo stays on top of fabric
          depthTest={true}
          depthWrite={false}
        />
      </Decal>
    </group>
  );
}

export default function HoodieVisualizer() {
  const [mounted, setMounted] = useState(false);
  const [hoodieColor, setHoodieColor] = useState('#1a1a1a');
  const [logoScale, setLogoScale] = useState(30);
  const [logoY, setLogoY] = useState(145);
  const [logoSide, setLogoSide] = useState<'front' | 'back'>('front');
  const [logoImage, setLogoImage] = useState('/logo.png');

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-8 py-10 min-h-screen bg-black">
      {/* 3D VIEWPORT */}
      <div className="lg:col-span-8 bg-[#080808] rounded-[3rem] h-[600px] lg:h-[800px] relative border border-white/5 overflow-hidden shadow-2xl">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center h-full text-[#7B2FF7]">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <span className="font-black uppercase tracking-widest text-sm">Loading 3D Assets...</span>
              </div>
            }
          >
            <Canvas
              shadows
              camera={{ position: [0, 0, 180], fov: 40 }}
              gl={{ antialias: true, alpha: false }}
            >
              <color attach="background" args={['#080808']} />
              <Environment preset="city" />
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

              <HoodieModel
                baseColor={hoodieColor}
                logoImage={logoImage}
                logoScale={logoScale}
                logoY={logoY}
                logoSide={logoSide}
              />

              <OrbitControls
                enablePan={false}
                minDistance={100}
                maxDistance={300}
                target={[0, 0, 0]}
              />

              <ContactShadows
                position={[0, -45, 0]}
                opacity={0.6}
                scale={150}
                blur={2.5}
                far={10}
              />
            </Canvas>
          </Suspense>
        </ErrorBoundary>

        {/* View Toggles */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex bg-black/80 backdrop-blur-2xl p-2 rounded-2xl border border-white/10 shadow-2xl">
          <button
            onClick={() => setLogoSide('front')}
            className={`px-10 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${
              logoSide === 'front' ? 'bg-[#7B2FF7] text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setLogoSide('back')}
            className={`px-10 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${
              logoSide === 'back' ? 'bg-[#7B2FF7] text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="lg:col-span-4 bg-[#111111] border border-white/10 rounded-[3rem] p-10 flex flex-col gap-10">
        <header className="flex justify-between items-center">
          <h2 className="text-white font-black italic uppercase text-2xl">Studio v1.0</h2>
          <RefreshCcw className="text-[#7B2FF7] w-5 h-5" />
        </header>

        <div className="space-y-12">
          {/* Color Section */}
          <div className="space-y-4">
            <label className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Fabric Color</label>
            <input
              type="color"
              value={hoodieColor}
              onChange={(e) => setHoodieColor(e.target.value)}
              className="w-full h-14 bg-transparent border-none cursor-pointer rounded-xl"
            />
          </div>

          {/* Logo Tuning */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Graphic Size</label>
                <span className="text-white text-xs font-mono">{logoScale}px</span>
              </div>
              <input
                type="range" min="10" max="100" step="1"
                value={logoScale}
                onChange={(e) => setLogoScale(parseInt(e.target.value))}
                className="w-full accent-[#7B2FF7]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Vertical Offset</label>
                <span className="text-white text-xs font-mono">{logoY}</span>
              </div>
              <input
                type="range" min="110" max="165" step="0.5"
                value={logoY}
                onChange={(e) => setLogoY(parseFloat(e.target.value))}
                className="w-full accent-[#7B2FF7]"
              />
            </div>
          </div>

          {/* Upload */}
          <div className="pt-2">
            <input
              type="file" id="logo-up" className="hidden" accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setLogoImage(URL.createObjectURL(file));
              }}
            />
            <label
              htmlFor="logo-up"
              className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center gap-4 cursor-pointer hover:bg-white/5 hover:border-[#7B2FF7]/50 transition-all"
            >
              <Upload className="w-8 h-8 text-[#7B2FF7]" />
              <span className="text-[10px] text-white/40 font-black uppercase italic">Swap Custom Artwork</span>
            </label>
          </div>
        </div>

        <Button className="w-full bg-[#7B2FF7] hover:bg-[#6a28d4] py-10 rounded-[2rem] font-black italic text-xl shadow-[0_20px_50px_rgba(123,47,247,0.2)] mt-auto border-none">
          <ShoppingBag className="w-6 h-6 mr-3" />
          Review & Order
        </Button>
      </div>
    </div>
  );
}

useGLTF.preload('/hoodie.glb');
