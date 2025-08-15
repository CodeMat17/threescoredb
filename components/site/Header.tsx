"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNavSheet } from "@/components/site/MobileNavSheet";
import Logo from "../Logo";

const navItems: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background py-2'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link href='/' className='text-lg font-semibold tracking-tight'>
          <div className="flex items-center gap-2">
          <Logo className="w-16 h-16" />
           <p className="hidden sm:flex md:hidden lg:flex">Threescore Tours</p> </div>
        </Link>

        <nav className='hidden gap-6 md:flex'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-blue-500 font-semibold"
                  : "text-foreground/60"
              )}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          <Button
            asChild
            size='sm'
            variant='secondary'
            className='hidden sm:flex'>
            <Link href='/packages'>Explore Packages</Link>
          </Button>
          <Button
            size='icon'
            variant='outline'
            aria-label='Toggle theme'
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <MoonStar className='hidden size-4 dark:inline' />
            <Sun className='inline size-4 dark:hidden' />
          </Button>

          <MobileNavSheet navItems={navItems} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
