"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-full border-border/70 bg-card/80 backdrop-blur hover:bg-accent/20 hover:border-primary/50 transition-all duration-200"
          aria-label="Select theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-violet-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 rounded-xl border-border/80 bg-card/95 backdrop-blur-md">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium ${
            theme === "light" ? "bg-primary/10 text-primary font-semibold" : ""
          }`}
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium ${
            theme === "dark" ? "bg-primary/10 text-primary font-semibold" : ""
          }`}
        >
          <Moon className="h-4 w-4 text-violet-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium ${
            theme === "system" ? "bg-primary/10 text-primary font-semibold" : ""
          }`}
        >
          <Monitor className="h-4 w-4 text-indigo-400" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
