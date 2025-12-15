"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Shield, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated?: string;
  type?: "terms" | "privacy" | "cookie";
}

const typeIcons = {
  terms: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
  privacy: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
  cookie: <Cookie className="w-6 h-6 sm:w-8 sm:h-8" />,
};

const LegalLayout: React.FC<LegalLayoutProps> = ({ 
  children, 
  title, 
  lastUpdated = "December 2024",
  type = "terms" 
}) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            {typeIcons[type]}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-primary mb-2">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective as of {lastUpdated}
          </p>
        </div>

        {/* Legal Content */}
        <div className="backdrop-blur-xl bg-background/60 border border-border/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
            prose-headings:font-primary prose-headings:font-bold
            prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-foreground
            prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-li:text-muted-foreground
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-ul:my-4 prose-ol:my-4
            prose-li:my-1
          ">
            {children}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-3 sm:gap-4">
          <Link href="/legal/terms">
            <Button variant="outline" size="sm" className={type === "terms" ? "border-primary text-primary" : ""}>
              Terms of Service
            </Button>
          </Link>
          <Link href="/legal/privacy">
            <Button variant="outline" size="sm" className={type === "privacy" ? "border-primary text-primary" : ""}>
              Privacy Policy
            </Button>
          </Link>
          <Link href="/legal/cookie">
            <Button variant="outline" size="sm" className={type === "cookie" ? "border-primary text-primary" : ""}>
              Cookie Policy
            </Button>
          </Link>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Questions? Contact us at <a href="mailto:rhythmeauth@gmail.com" className="text-primary hover:underline">rhythmeauth@gmail.com</a></p>
        </div>
      </main>
    </div>
  );
};

export default LegalLayout;
