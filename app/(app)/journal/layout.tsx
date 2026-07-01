"use client";

import React from "react";

interface JournalLayoutProps {
  children: React.ReactNode;
}

export default function JournalLayout({ children }: JournalLayoutProps) {
  return (
    <div className="flex-1 flex flex-col min-h-screen relative">
      {/* Page Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
