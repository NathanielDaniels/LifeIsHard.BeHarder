"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Check } from "lucide-react";

const COPIED_RESET_MS = 2500;

/**
 * Opens the native share sheet where there is one (phones), otherwise copies
 * the link. A dismissed share sheet is not an error and is ignored.
 */
export default function ShareButton({ url, title, className = "" }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const share = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // User closed the share sheet.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button type="button" onClick={share} className={className}>
      {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Share2 className="w-4 h-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Link copied" : "Share the campaign"}</span>
    </button>
  );
}
