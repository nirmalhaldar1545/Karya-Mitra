"use client";

import Link from "next/link";
import Image from "next/image";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: "Home", href: "/" },
      { name: "Features", href: "/#features" },
      { name: "Meet the Team", href: "/#team" },
      { name: "Log In", href: "/login" },
    ],
    social: [
      { name: "GitHub", href: "https://github.com/nirmalhaldar1545/Karya-Mitra", icon: FiGithub },
      { name: "LinkedIn", href: "#", icon: FiLinkedin },
      { name: "Twitter", href: "#", icon: FiTwitter },
    ],
  };

  return (
    <footer className="relative overflow-hidden border-t border-gray-800 bg-gray-950">
      {/* 3D Starfield Background - Reduced density for footer */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={800} factor={4} fade speed={2} />
        </Canvas>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.png.png"
                alt="Karya Mitra Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-white">Karya-Mitra</span>
            </div>
            <p className="text-sm text-gray-400">
              A Smart India Hackathon project transforming government productivity through AI-powered performance management and transparent KPI tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label={social.name}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
            <div className="mt-4">
              <a
                href="https://karya-mitra.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                🌐 Production Site
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Karya-Mitra. All rights reserved. Built for Smart India Hackathon.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
