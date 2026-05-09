import { useEffect } from "react";

const IDLE_MS = 12_000;
const NEXT_GLITCH_MIN_MS = 5_000;
const NEXT_GLITCH_MAX_MS = 12_000;
const GLITCH_DURATION_MS = 320;
const GLITCH_DURATION_MS_LONG = 520; // occasional longer one

/**
 * Ghost-in-the-Shell-style page glitches that fire while the user is idle.
 * Sets `body[data-glitching="true"]` for a short burst — CSS in index.css does
 * the heavy lifting (body shake + inherited text-shadow RGB split + scan tear).
 *
 * Resets on any user activity. The visible effect is brief and intentionally
 * not too frequent.
 */
export function IdleGlitch() {
  useEffect(() => {
    let lastActiveAt = Date.now();
    let scheduled = 0;
    let revertTimer = 0;
    let cancelled = false;

    const onActivity = () => {
      lastActiveAt = Date.now();
    };

    const fireGlitch = () => {
      if (cancelled) return;

      const idleFor = Date.now() - lastActiveAt;
      if (idleFor < IDLE_MS) {
        // Came back from idle; check again later.
        scheduled = window.setTimeout(fireGlitch, IDLE_MS - idleFor + 500);
        return;
      }

      const isLong = Math.random() < 0.2;
      const duration = isLong ? GLITCH_DURATION_MS_LONG : GLITCH_DURATION_MS;

      document.body.dataset.glitching = isLong ? "long" : "true";
      window.clearTimeout(revertTimer);
      revertTimer = window.setTimeout(() => {
        delete document.body.dataset.glitching;
      }, duration);

      const next = NEXT_GLITCH_MIN_MS + Math.random() * (NEXT_GLITCH_MAX_MS - NEXT_GLITCH_MIN_MS);
      scheduled = window.setTimeout(fireGlitch, next);
    };

    scheduled = window.setTimeout(fireGlitch, IDLE_MS + 500);

    window.addEventListener("mousemove", onActivity, { passive: true });
    window.addEventListener("scroll", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("touchstart", onActivity, { passive: true });

    return () => {
      cancelled = true;
      window.clearTimeout(scheduled);
      window.clearTimeout(revertTimer);
      delete document.body.dataset.glitching;
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("touchstart", onActivity);
    };
  }, []);

  return null;
}
