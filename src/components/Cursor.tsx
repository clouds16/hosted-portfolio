import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: green tech arrow that follows the mouse without spring lag,
 * plus a scroll-percentage label that pops next to it while the user scrolls.
 *
 * Position is set with a direct DOM transform on each mousemove so React's
 * reconciler is never involved in the hot path.
 */
export function Cursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (arrowRef.current) {
        arrowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${x + 18}px, ${y + 14}px, 0)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      setScrollPct(pct);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setScrollPct(null), 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div
        ref={arrowRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      >
        <ArrowIcon />
      </div>
      <div
        ref={labelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          color: "var(--accent)",
          letterSpacing: "0.08em",
          opacity: scrollPct !== null ? 1 : 0,
          transition: "opacity 0.25s ease",
          textShadow: "0 0 6px rgba(0,255,136,0.5)",
          willChange: "transform, opacity",
          whiteSpace: "nowrap",
        }}
      >
        {scrollPct !== null && `▼ ${String(scrollPct).padStart(2, "0")}%`}
      </div>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      style={{
        display: "block",
        filter: "drop-shadow(0 0 4px rgba(0,255,136,0.6))",
      }}
    >
      <path
        d="M1 1 L13 8 L7.5 8.5 L9 14 L6.5 14 L5 9 Z"
        fill="var(--accent)"
        stroke="var(--bg)"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
