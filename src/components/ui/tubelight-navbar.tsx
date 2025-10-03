"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "~/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function TubelightNavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "")

  useEffect(() => {
    // Set initial active tab based on current URL
    const hash = window.location.hash || window.location.pathname;
    const matchingItem = items.find(item => item.url === hash || item.url === window.location.pathname);
    if (matchingItem) {
      setActiveTab(matchingItem.name);
    }
  }, [items])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6 pointer-events-none",
        className,
      )}
    >
      <div className="flex items-center gap-2 bg-gray-900/90 border-2 border-gray-700/50 backdrop-blur-xl py-2 px-2 rounded-full shadow-2xl shadow-[#13FFAA]/10 pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300",
                isActive 
                  ? "text-gray-950 bg-[#13FFAA] shadow-lg shadow-[#13FFAA]/50" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50",
              )}
            >
              <span className="hidden md:inline relative z-10">{item.name}</span>
              <span className="md:hidden relative z-10">
                <Icon size={20} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-[#13FFAA] rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Top glow effect */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-[#13FFAA] rounded-t-full shadow-[0_0_20px_rgba(19,255,170,0.8)]">
                    <div className="absolute w-16 h-8 bg-[#13FFAA]/40 rounded-full blur-xl -top-3 -left-3" />
                    <div className="absolute w-12 h-6 bg-[#13FFAA]/60 rounded-full blur-lg -top-2 -left-1" />
                    <div className="absolute w-6 h-6 bg-[#13FFAA]/80 rounded-full blur-md top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
