import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a real number once it scrolls into view. The initial (and
 * server-rendered) state is the final value itself, not zero — a crawler,
 * a no-JS visitor, or the pre-hydration paint must see the correct number
 * at every moment, not a placeholder that is only true once JavaScript has
 * both run AND the element has been scrolled to. That is why the drop to
 * zero happens inside the intersection callback itself, immediately before
 * the animation starts, rather than at mount: nothing sits at a wrong value
 * for any length of time except the ~900ms of the animation itself, which
 * only plays while the element is actually on screen.
 */
export const CountUp = ({ value, durationMs = 900 }: { value: number; durationMs?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        setDisplay(0);
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - (1 - progress) ** 3;
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return <span ref={ref}>{display}</span>;
};
