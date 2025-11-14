"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sparkles } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  user?: {
    id: string;
  } | null;
}

const NavbarClient: React.FC<NavbarProps> = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: NavLink[] = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "pricing" },
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Glassmorphism navbar */}
      <nav className="backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-lg shadow-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-300"></div>
                <div className="relative backdrop-blur-sm bg-background/50 border border-primary/30 rounded-lg p-1.5 sm:p-2 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110">
                  <Image 
                    src="/Rhythme.svg" 
                    alt="Rhythmé logo" 
                    width={20} 
                    height={20}
                    className="sm:w-[25px] sm:h-[25px] group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent group-hover:from-primary group-hover:via-accent group-hover:to-foreground transition-all duration-300">
                Rhythmé
              </h1>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative text-sm xl:text-base text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user && user.id ? (
                <>
                  {/* Logged in state */}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-xl bg-background/40 border border-border hover:border-primary/50 rounded-lg text-sm sm:text-base text-foreground hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Dashboard</span>
                    <span className="xs:hidden">App</span>
                  </Link>
                </>
              ) : (
                <>
                  {/* Logged out state */}
                  <Link
                    href="/login"
                    className="hidden sm:flex px-3 md:px-4 py-1.5 md:py-2 backdrop-blur-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-lg text-sm md:text-base text-foreground hover:text-primary transition-all duration-300 font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup/intro"
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg text-sm sm:text-base font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group"
                  >
                    <span className="hidden xs:inline">Get Started</span>
                    <span className="xs:hidden">Start</span>
                    <span className="hidden md:inline">Free</span>
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 backdrop-blur-xl bg-background/40 border border-border hover:border-primary/50 rounded-lg transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2 pb-4 border-t border-border/50 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block px-4 py-2.5 backdrop-blur-xl bg-background/40 border border-border hover:border-primary/50 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
              {!user && (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="sm:hidden block px-4 py-2.5 backdrop-blur-xl bg-primary/5 border border-primary/20 rounded-lg text-foreground hover:text-primary text-center transition-all duration-300 font-medium"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Ambient glow effect under navbar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-16 sm:h-24 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent blur-3xl pointer-events-none"></div>
    </header>
  );
};

export default NavbarClient;