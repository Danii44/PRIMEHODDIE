"use client";
import { motion } from "framer-motion";

interface MarqueeProps {
  direction?: "left" | "right";
}

export const MarqueeBanner = ({ direction = "left" }: MarqueeProps) => {
  const isRight = direction === "right";
  
  return (
    <div className="py-10 bg-[#7B2FF7] -rotate-1 scale-105 overflow-hidden flex whitespace-nowrap z-20 border-y-2 border-black">
      <motion.div 
        animate={{ x: isRight ? [-1000, 0] : [0, -1000] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="flex gap-12 items-center text-4xl lg:text-6xl font-black italic text-black uppercase"
      >
        <span>Prime Hoodie</span>
        <span className="w-3 h-3 bg-black rounded-full" />
        <span>New Drop 2026</span>
        <span className="w-3 h-3 bg-black rounded-full" />
        <span>Customizable</span>
        <span className="w-3 h-3 bg-black rounded-full" />
        <span>Prime Hoodie</span>
        <span className="w-3 h-3 bg-black rounded-full" />
        <span>New Drop 2026</span>
        <span className="w-3 h-3 bg-black rounded-full" />
        <span>Customizable</span>
      </motion.div>
    </div>
  );
};