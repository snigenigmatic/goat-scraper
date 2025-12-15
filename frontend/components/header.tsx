"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/command-palette";
import { StudyCartButton } from "@/components/study-cart-button";
import { BookOpen } from "lucide-react";

interface SearchItem {
  type: "course" | "unit" | "file";
  title: string;
  subtitle?: string;
  href: string;
  download?: boolean;
}

interface HeaderProps {
  searchItems?: SearchItem[];
  showBackButton?: boolean;
  backHref?: string;
}

export function Header({ searchItems = [] }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <BookOpen className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Home</h1>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <CommandPalette items={searchItems} />
              <StudyCartButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
