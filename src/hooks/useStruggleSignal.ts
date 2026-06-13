import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Silent-Struggle Detector — pure behavioral, NO camera.
 * Watches signals that usually precede giving up: long time-on-item, repeated
 * scroll-ups / re-reads, large deletions, and long idle. When thresholds trip,
 * the consumer can offer help before the user quits. Always dismissible.
 */

interface StruggleState {
  struggling: boolean;
  reason: string;
}

interface Options {
  /** Expected time on this item in seconds before time-based concern. */
  expectedSeconds?: number;
  enabled?: boolean;
}

export function useStruggleSignal({ expectedSeconds = 75, enabled = true }: Options = {}) {
  const [state, setState] = useState<StruggleState>({ struggling: false, reason: "" });
  const dismissedRef = useRef(false);
  const scrollUpsRef = useRef(0);
  const lastScrollY = useRef(0);
  const lastLenRef = useRef(0);
  const startedAt = useRef(Date.now());

  const trip = useCallback((reason: string) => {
    if (dismissedRef.current) return;
    setState({ struggling: true, reason });
  }, []);

  const dismiss = useCallback(() => {
    dismissedRef.current = true;
    setState({ struggling: false, reason: "" });
  }, []);

  const reset = useCallback(() => {
    dismissedRef.current = false;
    scrollUpsRef.current = 0;
    lastLenRef.current = 0;
    startedAt.current = Date.now();
    setState({ struggling: false, reason: "" });
  }, []);

  // Time-on-item: concern at ~1.6x expected.
  useEffect(() => {
    if (!enabled) return undefined;
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      if (elapsed > expectedSeconds * 1.6) {
        trip("You've been on this a while — want a hint or a simpler version?");
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [enabled, expectedSeconds, trip]);

  // Repeated scroll-ups (re-reading).
  useEffect(() => {
    if (!enabled) return undefined;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < lastScrollY.current - 40) {
        scrollUpsRef.current += 1;
        if (scrollUpsRef.current >= 4) trip("Re-reading this section? A simpler version might help.");
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, trip]);

  /** Feed editor content length to catch large deletions. */
  const reportLength = useCallback(
    (len: number) => {
      if (!enabled) return;
      if (lastLenRef.current - len > 60) {
        trip("Big rewrite? Want a hint before you start over?");
      }
      lastLenRef.current = len;
    },
    [enabled, trip]
  );

  return { ...state, dismiss, reset, reportLength };
}
