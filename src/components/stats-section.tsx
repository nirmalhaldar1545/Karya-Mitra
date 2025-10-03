"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const StatsSection = () => {
  const stats = [
    { label: "Government Offices", value: 100, suffix: "+", prefix: "" },
    { label: "Active Users", value: 5000, suffix: "+", prefix: "" },
    { label: "Performance Improvement", value: 90, suffix: "%", prefix: "" },
    { label: "Time Saved", value: 40, suffix: "%", prefix: "" },
  ];

  return (
    <section className="border-y border-gray-800 bg-gray-900 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                  {stat.prefix}
                  <CountUp end={stat.value} />
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm text-gray-400 md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simple CountUp component
function CountUp({ end }: { end: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 2000; // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return <>{count}</>;
}
