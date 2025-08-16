"use client";

import { Button } from "@/components/ui/button";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size='icon'
      variant='outline'
      aria-label='Toggle theme'
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <MoonStar className='hidden size-4 dark:inline' />
      <Sun className='inline size-4 dark:hidden' />
    </Button>
  );
}
