"use client";

import { motion } from "framer-motion";
import { FiTarget, FiTrendingUp, FiUsers, FiAward } from "react-icons/fi";

export const AboutSection = () => {
  const features = [
    {
      icon: FiTarget,
      title: "Role-Based KPIs",
      description: "Customized performance indicators for HQ staff and field engineers, ensuring fair and relevant evaluation.",
    },
    {
      icon: FiTrendingUp,
      title: "Real-Time Analytics",
      description: "Live dashboards providing instant insights into individual, team, and organizational productivity.",
    },
    {
      icon: FiUsers,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms predict performance trends and recommend personalized training paths.",
    },
    {
      icon: FiAward,
      title: "Transparent Scoring",
      description: "Objective 0-100 scoring system combining quantitative metrics (80%) and qualitative feedback (20%).",
    },
  ];

  return (
    <section id="about" className="bg-gray-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            About Karya-Mitra
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-400">
            A revolutionary performance management system designed for government organizations, 
            replacing subjective appraisals with data-driven, transparent evaluation.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-xl border border-gray-800 bg-gray-950 p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <feature.icon className="text-2xl text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Problem & Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid gap-8 md:grid-cols-2"
        >
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-8">
            <h3 className="mb-4 text-2xl font-bold text-white">The Problem</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✗</span>
                Subjective APAR system based on opinions, not data
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✗</span>
                No real-time productivity tracking
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✗</span>
                Uniform evaluation despite different roles
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✗</span>
                Zero accountability and benchmarking
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-blue-950 to-purple-950 p-8">
            <h3 className="mb-4 text-2xl font-bold text-white">Our Solution</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 text-green-400">✓</span>
                Data-driven performance measurement
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-400">✓</span>
                Continuous real-time monitoring
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-400">✓</span>
                Role-specific KPI evaluation
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-400">✓</span>
                Transparent benchmarking & accountability
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
