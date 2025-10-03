"use client";

import { motion } from "framer-motion";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { 
  Briefcase, 
  BarChart2, 
  Cpu, 
  Shield, 
  Zap, 
  TrendingUp 
} from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";
import { cn } from "~/lib/utils";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Briefcase,
      title: "Role-Based KPI Management",
      description: "Predefined KPI library for HQ staff and field engineers with custom KPI creation capabilities.",
    },
    {
      icon: BarChart2,
      title: "Real-Time Dashboards",
      description: "Multi-level dashboards for employees, managers, and organizations with live productivity insights.",
    },
    {
      icon: Cpu,
      title: "AI-Powered Insights",
      description: "Intelligent KPI recommendations, performance predictions, and personalized training suggestions.",
    },
    {
      icon: Shield,
      title: "Transparent Scoring",
      description: "Objective 0-100 scoring system with 80% quantitative metrics and 20% qualitative feedback.",
    },
    {
      icon: Zap,
      title: "Workflow Integration",
      description: "Seamless integration with e-Office file movement logs for automatic task capture and tracking.",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "AI models predict deadline misses, identify bottlenecks, and recommend optimal staffing levels.",
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden bg-gray-950 py-20">
      {/* 3D Starfield Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-2 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
            Features
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Powerful Features for Modern Governance
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-400">
            Everything you need to transform government productivity and create a transparent, 
            data-driven performance management system.
          </p>
        </motion.div>

        {/* Features Grid with Glowing Effect */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature, index) => (
            <motion.li
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="list-none"
            >
              <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-800 p-2 md:rounded-[1.5rem] md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <div className="relative flex h-full flex-col gap-6 overflow-hidden rounded-xl border-[0.75px] border-gray-800 bg-gray-900 p-6 shadow-sm">
                  <div className="relative flex flex-1 flex-col gap-3">
                    <div className="w-fit rounded-lg border-[0.75px] border-gray-700 bg-gray-800 p-3">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="pt-0.5 text-xl font-semibold leading-[1.375rem] tracking-[-0.04em] text-white md:text-2xl md:leading-[1.875rem]">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-[1.125rem] text-gray-400 md:text-base md:leading-[1.375rem]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 sm:flex-row sm:gap-6">
            <div className="text-left">
              <h3 className="mb-2 text-2xl font-bold text-white">
                Ready to Transform Your Organization?
              </h3>
              <p className="text-gray-400">
                Start measuring productivity with data-driven insights today.
              </p>
            </div>
            <a href="/contact">
              <button className="whitespace-nowrap rounded-full border-2 border-white bg-white px-8 py-3 font-semibold text-gray-950 transition-all hover:scale-105 hover:border-[#13FFAA] hover:bg-[#13FFAA]">
                Get Started
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
