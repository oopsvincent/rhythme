"use client";

import React from 'react';
import { Twitter, Linkedin, Github, Mail, Heart, Shield, Lock, Brain } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'About', href: '/about' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Our Vision', href: '/about#vision' },
        { label: 'Research', href: '/about#research' },
        { label: 'Careers', href: '#careers' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/legal/privacy' },
        { label: 'Terms of Service', href: '/legal/terms' },
        { label: 'Cookie Policy', href: '/legal/cookie' },
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: <Twitter className="w-4 h-4" />,
      href: '#twitter',
      label: 'Twitter',
    },
    {
      icon: <Linkedin className="w-4 h-4" />,
      href: '#linkedin',
      label: 'LinkedIn',
    },
    {
      icon: <Github className="w-4 h-4" />,
      href: '#github',
      label: 'GitHub',
    },
    {
      icon: <Mail className="w-4 h-4" />,
      href: 'mailto:hello@rhythme.app',
      label: 'Email',
    },
  ];

  return (
    <footer className="relative bg-background border-t border-border/50 overflow-hidden">
      {/* Subtle glow effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all duration-500"></div>
                <div className="relative backdrop-blur-sm bg-background/50 border border-primary/30 rounded-xl p-2 group-hover:border-primary/50 transition-all duration-500">
                  <Image 
                    src="/Rhythme.svg" 
                    alt="Rhythmé logo" 
                    width={24} 
                    height={24}
                  />
                </div>
              </div>
              <span className="text-xl font-bold font-primary">Rhythmé</span>
            </Link>
            
            <p className="text-muted-foreground text-sm mb-6 max-w-sm leading-relaxed">
              Building human-aware systems that understand attention, motivation, and focus. 
              Helping people take meaningful action toward their goals.
            </p>

            {/* Mission Statement */}
            <div className="glass-card rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium mb-1">Our Mission</p>
                  <p className="text-xs text-muted-foreground">
                    Research and develop AI that genuinely understands human psychology 
                    in the age of endless distraction.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="backdrop-blur-sm bg-muted/50 border border-border rounded-lg p-2.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 hover:bg-primary/5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold mb-4 text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Security Badges */}
        <div className="border-t border-border/50 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="w-3.5 h-3.5 text-primary" />
              <span>No Data Selling</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {currentYear} Rhythmé Inc.</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">All rights reserved</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/about#partner" className="hover:text-primary transition-colors">Partner</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
