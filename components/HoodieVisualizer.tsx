'use client';

import { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  useGLTF,
  Decal,
  useTexture,
  ContactShadows
} from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Upload, RefreshCcw } from 'lucide-react';
import * as THREE from 'three';

function HoodieModel({
  baseColor,
  logoImage,
  logoScale,
  logoY,
  logoSide
}: any) {
  // Load model and texture
  const { scene } = useGLTF('/hoodie.glb');
  const logoTexture = useTexture(logoImage);

  // Memoize material to prevent unnecessary re-renders
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.7,
    metalness: 0.1,
    side: THREE.DoubleSide, // FIX: Renders both sides to fix "holes"
    transparent: false,
    depthWrite: true,
  }), [baseColor]);

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
        
        // FIX: Prevents parts of the mesh from disappearing when close to camera
        child.frustumCulled = false; 
        
        // Ensure lighting hits the surface correctly
        child.geometry.computeVertexNormals();
      }
    });
  }, [scene, material]);

  // Adjust these based on your specific GLB scale
  const rotationY = logoSide === 'front' ? 0 : Math.PI;
  const decalZ = logoSide === 'front' ? 20 : -20; 

  return (
    <group position={[0, -1, 0]} scale={0.01}> {/* Scale adjusted for standard GLB sizes */}
      <primitive object={scene} />

      <Decal
        position={[0, logoY, decalZ]} 
        rotation={[0, rotationY, 0]}
        scale={[logoScale, logoScale, 50]}
      >
        <meshStandardMaterial
          map={logoTexture}
          transparent
          polygonOffset
          polygonOffsetFactor={-10} // Forces decal to sit "above" the fabric
          depthTest={true}
          depthWrite={false}
        />
      </Decal>
    </group>
  );
}

export default function HoodieVisualizer() {
  const [mounted, setMounted] = useState(false);
  const [hoodieColor, setHoodieColor] = useState('#ffffff');
  const [logoScale, setLogoScale] = useState(15);
  const [logoY, setLogoY] = useState(1.4);
  const [logoSide, setLogoSide] = useState<'front' | 'back'>('front');
  const [logoImage, setLogoImage] = useState('/logo.png');

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-8 py-10 bg-black min-h-screen">
      {/* 3D VIEW */}
      <div className="lg:col-span-8 bg-[#0a0a0a] rounded-[3rem] h-[600px] lg:h-[800px] relative border border-white/10 overflow-hidden shadow-2xl">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-[#7B2FF7] font-black animate-pulse">
              INITIALIZING STUDIO...
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 35 }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
          >
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[2048, 2048]} castShadow />

            <HoodieModel
              baseColor={hoodieColor}
              logoImage={logoImage}
              logoScale={logoScale}
              logoY={logoY}
              logoSide={logoSide}
            />

            <OrbitControls
              enablePan={false}
              minDistance={2}
              maxDistance={10}
              target={[0, 0, 0]}
            />

            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={1.5}
            />
          </Canvas>
        </Suspense>

        {/* View Switcher */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex bg-black/60 backdrop-blur-3xl p-1.5 rounded-2xl border border-white/10">
          {(['front', 'back'] as const).map((side) => (
            <button
              key={side}
              onClick={() => setLogoSide(side)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                logoSide === side ? 'bg-[#7B2FF7] text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {side} View
            </button>
          ))}
        </div>
      </div>

      {/* CONTROL PANEL */}
      <div className="lg:col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-black uppercase italic text-xl tracking-tighter">Configurator</h2>
          <RefreshCcw className="w-5 h-5 text-[#7B2FF7] cursor-pointer hover:rotate-180 transition-transform duration-500" />
        </div>

        <div className="space-y-10">
          {/* Color Picker */}
          <div className="group">
            <label className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-4 block group-hover:text-[#7B2FF7] transition-colors">
              Base Fabric Color
            </label>
            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <input
                type="color"
                value={hoodieColor}
                onChange={(e) => setHoodieColor(e.target.value)}
                className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg"
              />
              <span className="text-white/60 font-mono text-sm uppercase">{hoodieColor}</span>
            </div>
          </div>

          {/* Placement Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/30">Logo Scale</span>
                <span className="text-[#7B2FF7]">{logoScale}</span>
              </div>
              <input
                type="range" min="1" max="50" step="0.1"
                value={logoScale}
                onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7B2FF7]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/30">Vertical Position</span>
                <span className="text-[#7B2FF7]">{logoY}</span>
              </div>
              <input
                type="range" min="-5" max="5" step="0.01"
                value={logoY}
                onChange={(e) => setLogoY(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7B2FF7]"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="relative">
            <input
              type="file" id="logo-upload" className="hidden" accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setLogoImage(URL.createObjectURL(file));
              }}
            />
            <label
              htmlFor="logo-upload"
              className="w-full py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center gap-3 cursor-pointer hover:bg-[#7B2FF7]/5 hover:border-[#7B2FF7]/40 transition-all group"
            >
              <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-[#7B2FF7]" />
              </div>
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Drop Artwork Here</span>
            </label>
          </div>
        </div>

        <Button className="w-full bg-[#7B2FF7] hover:bg-[#8c4dff] text-white py-8 rounded-2xl font-black uppercase italic tracking-tighter shadow-xl shadow-[#7B2FF7]/20 mt-auto">
          <ShoppingBag className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

useGLTF.preload('/hoodie.glb');
