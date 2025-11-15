import React from 'react';
import { Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react';
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
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Roadmap', href: '#roadmap' },
        { label: 'Changelog', href: '#changelog' },
        { label: 'Status', href: '#status' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'Help Center', href: '#help' },
        { label: 'Blog', href: '#blog' },
        { label: 'Community', href: '#community' },
        { label: 'API Reference', href: '#api' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Contact', href: '#contact' },
        { label: 'Press Kit', href: '#press' },
        { label: 'Partners', href: '#partners' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Cookie Policy', href: '#cookies' },
        { label: 'GDPR', href: '#gdpr' },
        { label: 'Security', href: '#security' },
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: <Twitter className="w-5 h-5" />,
      href: '#twitter',
      label: 'Twitter',
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: '#linkedin',
      label: 'LinkedIn',
    },
    {
      icon: <Github className="w-5 h-5" />,
      href: '#github',
      label: 'GitHub',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: '#email',
      label: 'Email',
    },
  ];

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden mb-30">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 mb-56">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex justify-center items-center">
            <div className="mb-6">
              <Link href="/" className="flex justify-center w-auto items-center gap-2 mb-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all duration-300"></div>
                  <div className="relative backdrop-blur-sm bg-background/50 border border-primary/30 rounded-lg p-1.5 group-hover:border-primary/50 transition-all duration-300">
                    <Image 
                      src="/Rhythme.svg" 
                      alt="Rhythmé logo" 
                      width={25} 
                      height={25}
                      className="group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent group-hover:from-primary group-hover:via-accent group-hover:to-foreground transition-all duration-300">
                  Rhythmé
                </h3>
              </Link>
              <p className="text-muted-foreground text-sm">
                Build better habits, achieve your goals, and live your best life.
              </p>
            </div>

            {/* Newsletter */}
            {/* <div className="backdrop-blur-xl bg-background/40 border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Get the latest features and tips
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-background/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>*/}
          </div> 

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="min-w-0">
              <h4 className="text-sm font-semibold mb-3 sm:mb-4 text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-background px-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Copyright */}
            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 text-center sm:text-left">
              <span>© {currentYear} Rhythmé. Made with</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary animate-pulse flex-shrink-0" />
              <span>for productivity</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="backdrop-blur-xl bg-background/40 border border-border rounded-lg p-2 sm:p-2.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Additional Links */}
          <div className="flex justify-center sm:justify-end items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <a
              href="#accessibility"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Accessibility
            </a>
            <span className="text-border">•</span>
            <a
              href="#sitemap"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Sitemap
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/50">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 backdrop-blur-xl bg-background/40 border border-border rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
              <span className="whitespace-nowrap">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-xl bg-background/40 border border-border rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
              <span className="whitespace-nowrap">SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-xl bg-background/40 border border-border rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
              <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
              <span className="whitespace-nowrap">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-xl bg-background/40 border border-border rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
              <span className="whitespace-nowrap">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
      {/* Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-64"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            className="text-accent"
            d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,197.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>
      <div className="absolute -bottom-5 left-0 right-0">
        <svg
          className="w-full h-64"
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
      </div>
    </footer>
  );
};

export default Footer;