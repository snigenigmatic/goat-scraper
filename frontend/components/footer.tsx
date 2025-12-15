"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-center gap-6 flex-nowrap text-sm text-slate-500 dark:text-slate-400">
          <Link href="https://github.com/polarhive/goat-scraper" target="_blank" rel="noopener" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            GitHub
          </Link>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">Press ⌘K to search</span>
        <span className="hidden sm:inline">•</span>

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
