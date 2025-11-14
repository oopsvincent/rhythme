import React from 'react';
import { Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react';
import Image from 'next/image';

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
    <footer className="relative bg-background border-t border-border overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                <Image src={"/Rhythme.svg"} alt='logo' width={25} height={25} />
                Rhythmé
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Build better habits, achieve your goals, and live your best life.
              </p>
            </div>

            {/* Newsletter */}
            <div className="backdrop-blur-xl bg-background/40 border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Get the latest features and tips
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-background/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold mb-4 text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-3">
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
        <div className="relative mb-8">
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>© {currentYear} YourApp. Made with</span>
            <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
            <span>for productivity</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="backdrop-blur-xl bg-background/40 border border-border rounded-lg p-2.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>

          {/* Additional Links */}
          <div className="flex items-center gap-4 text-sm">
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
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 backdrop-blur-xl bg-background/40 border border-border rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-xl bg-background/40 border border-border rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-xl bg-background/40 border border-border rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-xl bg-background/40 border border-border rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;