"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Shield, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalSection {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated?: string;
  type?: "terms" | "privacy" | "cookie";
  sections?: LegalSection[];
}

const typeIcons = {
  terms: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
  privacy: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
  cookie: <Cookie className="w-6 h-6 sm:w-8 sm:h-8" />,
};

const LegalLayout: React.FC<LegalLayoutProps> = ({ 
  children, 
  title, 
  lastUpdated = "March 2026",
  type = "terms",
  sections = []
}) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (sections.length === 0) return;
    
    const observers = new Map<string, IntersectionObserver>();
    
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          { rootMargin: "-20% 0px -80% 0px" }
        );
        observer.observe(element);
        observers.set(id, observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-40 mix-blend-screen"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] opacity-40 mix-blend-screen"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            
            <div className="flex bg-muted/40 p-1 rounded-lg border border-border/50">
              <Link href="/legal/terms">
                <Button variant="ghost" size="sm" className={`h-8 px-4 rounded-md text-xs font-medium transition-all ${type === "terms" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  Terms
                </Button>
              </Link>
              <Link href="/legal/privacy">
                <Button variant="ghost" size="sm" className={`h-8 px-4 rounded-md text-xs font-medium transition-all ${type === "privacy" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  Privacy
                </Button>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span>Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Title Section */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6 shadow-sm border border-primary/20">
            {typeIcons[type]}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-primary tracking-tight mb-6 text-foreground">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Please read these terms carefully. This document constitutes a legally binding agreement detailing your rights and responsibilities.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Sidebar Navigation */}
          {sections.length > 0 && (
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-6 custom-scrollbar pb-10">
                <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold mb-6">On this page</h4>
                <nav className="flex flex-col space-y-[2px] relative border-l border-border/50 pl-4">
                  {sections.map(({ id, title }) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={(e) => scrollToSection(e, id)}
                      className={`text-[13px] py-2 block transition-all relative -ml-4 pl-4 border-l-2 ${
                        activeSection === id 
                          ? "text-foreground font-semibold border-primary" 
                          : "text-muted-foreground hover:text-foreground border-transparent hover:border-border"
                      }`}
                    >
                      {title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Legal Content */}
          <div className="flex-1 max-w-3xl min-w-0">
            <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none
              prose-headings:font-primary prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-foreground prose-h2:scroll-m-28 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-4
              prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-foreground/90
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-li:text-muted-foreground prose-li:my-2
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-4
              prose-ul:my-6 prose-ol:my-6
              [&>section]:mb-16 [&>section]:scroll-m-28
              marker:text-primary
            ">
              {children}
            </div>
            
            <div className="mt-20 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground mb-20">
              <p>Questions about these {title.toLowerCase()}? Contact us at <a href="mailto:rhythmeauth@gmail.com" className="text-primary hover:underline font-medium">rhythmeauth@gmail.com</a></p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default LegalLayout;
