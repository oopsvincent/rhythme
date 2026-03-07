import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Shield, Cookie, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const legalLinks = [
  {
    title: "Terms of Service",
    description: "Read the rules and guidelines for using the Rhythmé platform.",
    href: "/legal/terms",
    icon: <FileText className="w-8 h-8 text-primary" />,
    color: "bg-primary/10",
  },
  {
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal data.",
    href: "/legal/privacy",
    icon: <Shield className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-500/10",
  },
  {
    title: "Cookie Policy",
    description: "Understand how we use cookies and similar tracking technologies.",
    href: "/legal/cookie",
    icon: <Cookie className="w-8 h-8 text-amber-500" />,
    color: "bg-amber-500/10",
  },
];

export default function LegalHome() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50 mix-blend-screen"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] opacity-40 mix-blend-screen"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Application</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto mb-20 fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black font-primary tracking-tight mb-6">
            Legal <span className="text-muted-foreground">Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about our terms, your privacy, and how we handle your data with respect and transparency.
          </p>
        </div>

        {/* Link Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legalLinks.map((link, idx) => (
            <Link key={idx} href={link.href} className="group block">
              <div className="h-full bg-card border border-border/40 rounded-3xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 relative overflow-hidden">
                {/* Accent glow on hover */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${link.color}`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 ${link.color}`}>
                    {link.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-primary tracking-tight mb-3">
                    {link.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {link.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-2 transition-transform duration-300">
                    Read Document <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-32 max-w-2xl mx-auto text-center border border-border/40 rounded-3xl p-10 bg-muted/10 backdrop-blur-sm">
          <h3 className="text-2xl font-bold font-primary mb-3">Need Help?</h3>
          <p className="text-muted-foreground mb-6">
            If you have any questions regarding our legal documents, privacy practices, or your data rights, our support team is here.
          </p>
          <a href="mailto:rhythmeauth@gmail.com">
           <Button className="rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform" size="lg">
             Contact Support
           </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
