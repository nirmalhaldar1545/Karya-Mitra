"use client";

import { Home, Sparkles, Users, LogIn } from "lucide-react";
import { TubelightNavBar } from "~/components/ui/tubelight-navbar";

export const Navbar = () => {
  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Features", url: "/#features", icon: Sparkles },
    { name: "Meet the Team", url: "/#team", icon: Users },
    { name: "Log In", url: "/login", icon: LogIn },
  ];

  return <TubelightNavBar items={navItems} />;
};
