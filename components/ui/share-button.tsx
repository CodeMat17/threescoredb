"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Share2 } from "lucide-react";
import * as React from "react";

export type ShareButtonProps = {
  title: string;
  url?: string;
  text?: string;
  className?: string;
  buttonLabel?: string;
};

export function ShareButton({
  title,
  url,
  text,
  className,
  buttonLabel = "Share",
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const onShare = React.useCallback(async () => {
    const shareUrl = url ?? window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  }, [title, text, url]);

  return (
    <Button
      type='button'
      onClick={onShare}
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={buttonLabel}>
      {copied ? <Check className='h-4 w-4' /> : <Share2 className='h-4 w-4' />}
      <span>{copied ? "Copied" : buttonLabel}</span>
    </Button>
  );
}

