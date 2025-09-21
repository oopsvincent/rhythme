"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ✅ Placeholder auth check (replace with real auth later)
const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return { loggedIn, setLoggedIn };
};

export default function Home() {
  const { loggedIn } = useAuth();

  // 👆 Cursor follower state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setIsPointer(window.getComputedStyle(e.target as Element).cursor === "pointer");
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-border bg-background/70 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        <h1 className="text-2xl font-head text-primary">Rhythmé</h1>
        <ul className="flex gap-6 font-body">
          <li><Link href="#features">Get Started</Link></li>
          <li><Link href="#pricing">Pricing</Link></li>
          {loggedIn ? (
            <li><Link href="/dashboard">Dashboard</Link></li>
          ) : (
            <li><Link href="/login">Login</Link></li>
          )}
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-6xl md:text-8xl font-head text-primary drop-shadow-lg">
          Hello, Rhythmé
        </h1>
        <p className="text-xl md:text-2xl font-body text-accent mt-4">
          The Ultimate Productivity Ecosystem
        </p>
        <p className="text-lg font-body text-foreground/80 mt-2 max-w-2xl">
          Align your habits, focus, and growth — all in one seamless experience.
        </p>

        {/* CTA */}
        <div className="mt-8 flex gap-4">
          <Link href="#get-started" className="bg-primary text-white px-6 py-3 rounded-md hover:scale-105 transition">
            Get Started
          </Link>
          <Link href="#pricing" className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition">
            See Pricing
          </Link>
        </div>
      </section>

      {/* Placeholder Sections */}
      <section id="features" className="py-24 bg-surface text-center">
        <h2 className="text-4xl font-head text-primary">Features</h2>
        <p className="mt-4 text-text-secondary max-w-xl mx-auto">
          [Placeholder: Describe your killer features here...]
        </p>
      </section>

      <section id="pricing" className="py-24 text-center">
        <h2 className="text-4xl font-head text-primary">Pricing</h2>
        <p className="mt-4 text-text-secondary max-w-xl mx-auto">
          [Placeholder: Pricing tiers will go here...]
        </p>
      </section>

      {/* Wave Footer */}
      <footer className="relative">
        <svg
          className="w-full h-32"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            className="text-primary"
            d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,197.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </footer>

      {/* Cute Cursor Follower */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-50"
        animate={{ x: cursorPos.x - 12, y: cursorPos.y - 12 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {isPointer ? (
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="4" />
          </svg>
        )}
      </motion.div>
    </div>
  );
}
