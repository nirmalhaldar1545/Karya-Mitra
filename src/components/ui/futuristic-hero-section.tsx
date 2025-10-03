"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
  useInView,
} from "framer-motion";
import { Building2, Users, TrendingUp, Clock } from "lucide-react";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

// Counter animation component
const AnimatedCounter = ({ value, duration = 2 }: { value: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const numericValue = parseInt(value.replace(/\D/g, ""));
    if (isNaN(numericValue)) return;

    let startTime: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(numericValue * progress));
        requestAnimationFrame(animateCount);
      } else {
        setCount(numericValue);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, value, duration]);

  const suffix = value.replace(/[0-9]/g, "");
  return <span ref={ref}>{count}{suffix}</span>;
};

export const AuroraHero = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS_TOP.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    color.set(COLORS_TOP[colorIndex]);
  }, [colorIndex, color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  const stats = [
    { label: "Government Offices", value: "100+", icon: Building2 },
    { label: "Active Users", value: "5000+", icon: Users },
    { label: "Performance Boost", value: "90%", icon: TrendingUp },
    { label: "Time Saved", value: "40%", icon: Clock },
  ];

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center">
        {/* Beta Badge */}
        <span className="mb-6 inline-block rounded-full bg-gray-600/50 px-4 py-2 text-sm backdrop-blur-sm">
          🚀 Beta Now Live!
        </span>

        {/* Main Title - KARYA MITRA with Neon Green Animated Color Flow */}
        <h1 className="mb-6 text-center font-black tracking-tight">
          <motion.span 
            className="block bg-gradient-to-r from-[#13FFAA] via-white to-[#13FFAA] bg-clip-text text-6xl text-transparent sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            KARYA MITRA
          </motion.span>
        </h1>

        {/* Tagline - Simple White Text */}
        <div className="mb-6 text-center text-xl text-white sm:text-2xl md:text-3xl">
          Empowering Government Efficiency
        </div>

        {/* Brief Info */}
        <p className="mb-8 max-w-2xl text-center text-base leading-relaxed text-gray-300 md:text-lg">
          Transform government productivity with AI-powered KPI tracking, real-time dashboards, 
          and objective performance measurement. Built for the Smart India Hackathon to bring 
          transparency and accountability to government offices.
        </p>

        {/* CTA Buttons */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row">
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-gray-950 transition-all hover:border-[#13FFAA] hover:bg-[#13FFAA]"
            >
              <span className="relative z-10">Start for Free</span>
            </motion.button>
          </Link>

          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border-2 border-gray-600 bg-gray-950/50 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-gray-400 hover:bg-gray-900/50"
            >
              Log In
            </motion.button>
          </Link>
        </div>

        {/* Statistics with Animation - Black & White Icons */}
        <div className="grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-xl border border-gray-800 bg-gray-950/50 p-4 text-center backdrop-blur-sm"
              >
                <div className="mb-2 flex justify-center">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="mb-1 text-2xl font-bold text-white md:text-3xl">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-xs text-gray-400 md:text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3D Starfield Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
};
