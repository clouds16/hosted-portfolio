import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "abcdefghijklmnopqrstuvwxyz0123456789{}<>$#*+=";

const FONT_SIZE = 14;
const FADE_ALPHA = 0.06; // higher = shorter trails
const BASE_SPEED = 0.5; // grid cells per frame (slower than before)
const SCROLL_BOOST = 1.6; // multiplier while user is scrolling
const TARGET_OPACITY = 0.5; // peak opacity (user opted in via the Curious? toggle)

/**
 * Two fixed canvases — one on each side of the viewport — running the classic
 * matrix rain. Hidden below 900px so it never crowds mobile content.
 *
 * Speed accelerates while the page is scrolling, then eases back.
 */
export function MatrixRain() {
  return (
    <>
      <RainStrip side="left" />
      <RainStrip side="right" />
    </>
  );
}

function RainStrip({ side }: { side: "left" | "right" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.max(1, Math.floor(canvas.offsetWidth / FONT_SIZE));
      drops = Array.from({ length: cols }, () => Math.random() * -20);
    };
    resize();
    window.addEventListener("resize", resize);

    let speedMul = 1;
    let scrollTimer = 0;
    const onScroll = () => {
      speedMul = SCROLL_BOOST;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        speedMul = 1;
      }, 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.fillStyle = `rgba(10, 10, 15, ${FADE_ALPHA})`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        // Bright leading char on the very front of the column
        const y = drops[i] * FONT_SIZE;
        ctx.fillStyle = "rgba(0, 255, 136, 0.95)";
        ctx.fillText(text, i * FONT_SIZE, y);

        // Mid-column glyphs slightly dimmer
        if (drops[i] > 1) {
          const prevText = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
          ctx.fillStyle = "rgba(0, 255, 136, 0.45)";
          ctx.fillText(prevText, i * FONT_SIZE, y - FONT_SIZE);
        }

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += BASE_SPEED * speedMul;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        [side]: 0,
        width: "clamp(60px, 7vw, 120px)",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
        opacity: TARGET_OPACITY,
        transition: "opacity 0.4s ease",
        display: "var(--matrix-display, block)",
      }}
    />
  );
}
