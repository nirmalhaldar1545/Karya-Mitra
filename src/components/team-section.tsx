"use client";

import { motion } from "framer-motion";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { GlowCard } from "./ui/spotlight-card";

export const TeamSection = () => {
  const teamMembers = [
    {
      name: "Nirmal Haldar",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      github: "https://github.com/nirmalhaldar1545",
      linkedin: "#",
      email: "mailto:nirmal@example.com",
      glowColor: "blue" as const,
    },
    {
      name: "Team Member 2",
      role: "AI/ML Engineer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      github: "#",
      linkedin: "#",
      email: "mailto:member2@example.com",
      glowColor: "purple" as const,
    },
    {
      name: "Team Member 3",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      github: "#",
      linkedin: "#",
      email: "mailto:member3@example.com",
      glowColor: "green" as const,
    },
    {
      name: "Team Member 4",
      role: "Backend Developer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      github: "#",
      linkedin: "#",
      email: "mailto:member4@example.com",
      glowColor: "orange" as const,
    },
    {
      name: "Team Member 5",
      role: "DevOps Engineer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      github: "#",
      linkedin: "#",
      email: "mailto:member5@example.com",
      glowColor: "red" as const,
    },
    {
      name: "Team Member 6",
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      github: "#",
      linkedin: "#",
      email: "mailto:member6@example.com",
      glowColor: "blue" as const,
    },
  ];

  return (
    <section id="team" className="relative overflow-hidden bg-gray-950 py-20">
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
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Meet the Team
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-400">
            The brilliant minds behind Karya-Mitra, working together to revolutionize 
            government productivity and performance management.
          </p>
        </motion.div>

        {/* Team Grid with Spotlight Cards - Bigger Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlowCard
                glowColor={member.glowColor}
                customSize
                className="h-full w-full min-h-[400px]"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-64 w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {member.name}
                    </h3>
                    <p className="text-base text-gray-400">{member.role}</p>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-3">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-gray-800/50 p-3 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                      aria-label="GitHub"
                    >
                      <FiGithub size={22} />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-gray-800/50 p-3 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin size={22} />
                    </a>
                    <a
                      href={member.email}
                      className="rounded-lg bg-gray-800/50 p-3 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                      aria-label="Email"
                    >
                      <FiMail size={22} />
                    </a>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-gray-400">
            Interested in joining our mission?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center rounded-full border border-blue-500 bg-blue-500/10 px-6 py-3 text-blue-400 transition-all hover:bg-blue-500/20"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
};
