export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = [
    { href: "/admin", label: "Carousel" },
    { href: "/admin/packages", label: "Packages" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/about-hero", label: "About Us Hero" },
    { href: "/admin/about-details", label: "About Us Details" },
    { href: "/admin/why-choose-us", label: "Why Choose Us Hero" },
    { href: "/admin/company-info", label: "Company Info" },
    { href: "/admin/contact", label: "Contact" },
  ];

  const NavList = ({ closeOnClick = false }: { closeOnClick?: boolean }) => (
    <nav className='flex flex-col'>
      {nav.map((n) =>
        closeOnClick ? (
          <SheetClose asChild key={n.href}>
            <Link
              href={n.href}
              className='rounded-md px-3 py-2 text-sm hover:bg-accent'>
              {n.label}
            </Link>
          </SheetClose>
        ) : (
          <Link
            key={n.href}
            href={n.href}
            className='rounded-md px-3 py-2 text-sm hover:bg-accent'>
            {n.label}
          </Link>
        )
      )}
    </nav>
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Mobile header */}
      <div className='mb-4 flex items-center justify-between md:hidden'>
        <div className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
          Admin
        </div>

        <div className='flex items-center gap-4'>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                aria-label='Open admin menu'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-72 p-4'>
              <div className='mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                Menu
              </div>
              <NavList closeOnClick />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-[240px_1fr]'>
        {/* Desktop sidebar */}
        <aside className='sticky top-4 hidden h-max rounded-md border bg-card p-4 md:block'>
          <div className='mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            Admin
          </div>
          <NavList />
          <div className='mt-6 flex items-center gap-3 pl-3'>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <ThemeToggle />
          </div>
        </aside>
        <section>{children}</section>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}
