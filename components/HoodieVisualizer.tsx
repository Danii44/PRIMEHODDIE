'use client'

import React, { useState, useEffect, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  useGLTF,
  Decal,
  useTexture
} from '@react-three/drei'
import { Loader2, Palette, MoveVertical, Maximize } from 'lucide-react'
import * as THREE from 'three'

/* =========================
   HOODIE MODEL COMPONENT
========================= */

function Hoodie({ baseColor, logoImage, logoScale, logoY, logoSide }: any) {
  const { nodes } = useGLTF('/Hoodie.glb') as any
  const logoTexture = useTexture(logoImage)

 

  const isFront = logoSide === 'front'
  const decalZ = isFront ? 0.25 : -0.25
  const rotationY = isFront ? 0 : Math.PI

  // Get all mesh nodes
  const meshes = Object.values(nodes).filter(
    (node: any) => node.type === 'Mesh'
  )

  return (
    <group>
      {meshes.map((mesh: any, index: number) => (
        <mesh
          key={index}
          geometry={mesh.geometry}
          castShadow
          receiveShadow
        >
          {/* Fabric Material */}
          <meshStandardMaterial
            color={baseColor}
            roughness={0.8}
            metalness={0.1}
            side={THREE.DoubleSide}
          />

          {/* DECAL MUST BE CHILD OF MESH */}
          <Decal
            position={[0, logoY, decalZ]}
            rotation={[0, rotationY, 0]}
            scale={[logoScale, logoScale, 1]}
          >
            <meshStandardMaterial
              map={logoTexture}
              transparent
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-4}
            />
          </Decal>
        </mesh>
      ))}
    </group>
  )
}


/* =========================
   MAIN VISUALIZER
========================= */

export default function HoodieVisualizer() {
  const [mounted, setMounted] = useState(false)
  const [hoodieColor, setHoodieColor] = useState('#121212')
  const [logoScale, setLogoScale] = useState(0.7)
  const [logoY, setLogoY] = useState(0.1)
  const [logoSide, setLogoSide] = useState<'front' | 'back'>('front')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-8 py-10 min-h-screen bg-black text-white font-sans">

      {/* LEFT: 3D VIEW */}
      <div className="lg:col-span-8 bg-[#0a0a0a] rounded-[3rem] h-[600px] lg:h-[800px] relative border border-white/10 overflow-hidden shadow-2xl">

        <Suspense fallback={
          <div className="flex h-full items-center justify-center flex-col gap-4">
            <Loader2 className="animate-spin text-[#7B2FF7] w-10 h-10" />
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              Initializing Studio...
            </p>
          </div>
        }>

          <Canvas shadows camera={{ position: [0, 0, 4], fov: 35 }}>

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
            />

            <Environment preset="city" />

            <Hoodie
              baseColor={hoodieColor}
              logoImage="/logo.png"
              logoScale={logoScale}
              logoY={logoY}
              logoSide={logoSide}
            />

            <OrbitControls enablePan={false} />

          </Canvas>

        </Suspense>

        {/* FRONT / BACK TOGGLE */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex bg-zinc-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
          <button
            onClick={() => setLogoSide('front')}
            className={`px-10 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${
              logoSide === 'front'
                ? 'bg-[#7B2FF7] text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setLogoSide('back')}
            className={`px-10 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${
              logoSide === 'back'
                ? 'bg-[#7B2FF7] text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* RIGHT: CONTROLS */}
      <div className="lg:col-span-4 bg-zinc-950 border border-white/5 rounded-[3rem] p-10 flex flex-col gap-10 shadow-2xl">

        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-[#7B2FF7]">
            Prime Studio
          </h1>
         
        </div>

        <div className="space-y-12">

          {/* FABRIC COLOR */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Palette size={14} className="text-[#7B2FF7]" />
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                Fabric Color
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              {['#121212', '#7B2FF7', '#FFFFFF', '#FF4B4B', '#2D2D2D'].map((c) => (
                <button
                  key={c}
                  onClick={() => setHoodieColor(c)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                    hoodieColor === c
                      ? 'border-white ring-2 ring-white/20'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* POSITION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MoveVertical size={14} className="text-[#7B2FF7]" />
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                Position
              </label>
            </div>

            <input
              type="range"
              min="-0.4"
              max="0.7"
              step="0.01"
              value={logoY}
              onChange={(e) => setLogoY(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7B2FF7]"
            />
          </div>

          {/* SCALE */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Maximize size={14} className="text-[#7B2FF7]" />
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                Scale
              </label>
            </div>

            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.01"
              value={logoScale}
              onChange={(e) => setLogoScale(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7B2FF7]"
            />
          </div>

        </div>

        <button className="mt-auto w-full py-5 bg-white text-black font-black uppercase text-xs rounded-2xl hover:bg-[#7B2FF7] hover:text-white transition-all shadow-lg active:scale-95">
          Order Design
        </button>

      </div>
    </div>
  )
}

useGLTF.preload('/Hoodie.glb')
