"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Shared animation settings for the orbs
const orbAnimation = {
  scale: [1, 1.15, 1],
  opacity: [0.25, 0.4, 0.25],
};

// Orb transition settings
const orbTransition = {
  duration: 4,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

// Main component
export default function AuthVisual() {
  return (
    <div className="hidden lg:flex flex-1 min-h-screen items-center justify-center relative overflow-hidden before:absolute before:inset-0 before:bg-black/45 before:z-10 before:content-['']">
      {/* Background Image */}
      <Image
        src="/heart.webp"
        alt="heart in Research Institute"
        fill
        priority
        quality={75}
        sizes="50vw"
        className="object-cover z-0 select-none pointer-events-none"
      />

      {/* ECG Line */}
      <svg
        className="absolute inset-0 w-full h-full z-20 opacity-20 pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M 0 400 L 250 400 L 290 250 L 340 550 L 390 320 L 430 400 L 1200 400"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            willChange: "transform",
          }}
        />
      </svg>

      {/* Orb Top Right */}
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white/5 blur-xl z-20"
        animate={orbAnimation}
        transition={orbTransition}
        style={{
          willChange: "transform, opacity",
        }}
      />

      {/* Orb Bottom Left */}
      <motion.div
        className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-white/5 blur-xl z-20"
        animate={orbAnimation}
        transition={{
          ...orbTransition,
          duration: 5,
        }}
        style={{
          willChange: "transform, opacity",
        }}
      />

      {/* Center Pulse */}
      <motion.div
        className="absolute w-44 h-44 rounded-full bg-white/5 blur-md z-20"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
        }}
        style={{
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
