"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export type NavItem = { href: string; label: string };

type MobileNavSheetProps = {
  navItems: NavItem[];
  pathname: string;
};

export function MobileNavSheet({ navItems, pathname }: MobileNavSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          aria-label='Open menu'
          className='md:hidden'>
          <Menu className='size-4' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex h-full w-[85vw] max-w-xs flex-col border-l bg-white dark:bg-slate-950 text-foreground'>
        <SheetHeader className='flex items-center justify-between'>
          <SheetTitle>Menu</SheetTitle>
          <SheetClose
            aria-label='Close menu'
            className='inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-foreground/80 hover:bg-accent hover:text-accent-foreground'>
            <X className='size-4 text-red-500' />
          </SheetClose>
        </SheetHeader>
        <nav className='flex flex-1 flex-col gap-1 p-2'>
          {navItems.map((item) => (
            <SheetClose key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(
                  "rounded-md border bg-background px-3 py-2 text-sm font-medium text-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                )}>
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
