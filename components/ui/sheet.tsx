"use client";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

export type SheetProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Sheet({
  children,
  open: controlledOpen,
  onOpenChange,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(
    (o: boolean) => {
      if (!isControlled) setUncontrolledOpen(o);
      onOpenChange?.(o);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    return undefined;
  }, [open, setOpen]);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export type SheetTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

export function SheetTrigger({ asChild, ...props }: SheetTriggerProps) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) return null;
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      aria-haspopup='dialog'
      aria-expanded={ctx.open}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick?.(e);
        ctx.setOpen(true);
      }}
      {...props}
    />
  );
}

export type SheetContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: "left" | "right" | "top" | "bottom";
};

export function SheetContent({
  className,
  side = "left",
  children,
  ...props
}: SheetContentProps) {
  const ctx = React.useContext(SheetContext);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!ctx) return null;

  if (!ctx.open && !mounted) return null;

  const sideClass: Record<NonNullable<SheetContentProps["side"]>, string> = {
    left: "left-0 top-0 h-full w-10/12 max-w-sm -translate-x-full data-[open=true]:translate-x-0",
    right:
      "right-0 top-0 h-full w-10/12 max-w-sm translate-x-full data-[open=true]:translate-x-0",
    top: "left-0 top-0 w-full -translate-y-full data-[open=true]:translate-y-0",
    bottom:
      "left-0 bottom-0 w-full translate-y-full data-[open=true]:translate-y-0",
  };

  return (
    <>
      {/* Overlay */}
      <div
        role='presentation'
        aria-hidden
        onClick={() => ctx.setOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity",
          ctx.open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      {/* Panel */}
      <div
        role='dialog'
        aria-modal='true'
        data-open={ctx.open}
        className={cn(
          "fixed z-50 bg-background p-4 shadow-lg transition-transform duration-300 will-change-transform",
          sideClass[side],
          className
        )}
        {...props}>
        {children}
      </div>
    </>
  );
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function SheetDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export type SheetCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};
export function SheetClose({ asChild, ...props }: SheetCloseProps) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) return null;
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick?.(e);
        ctx.setOpen(false);
      }}
      {...props}
    />
  );
}
