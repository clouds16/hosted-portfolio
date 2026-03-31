import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setTrail(pos), 80);
    return () => clearTimeout(timeout);
  }, [pos]);

  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: clicking ? 6 : 8,
          height: clicking ? 6 : 8,
          borderRadius: "50%",
          background: "var(--accent)",
          pointerEvents: "none",
          zIndex: 9999,
          x: pos.x - 4,
          y: pos.y - 4,
          mixBlendMode: "difference",
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      />
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid var(--accent)",
          pointerEvents: "none",
          zIndex: 9998,
          x: trail.x - 14,
          y: trail.y - 14,
          opacity: 0.4,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      />
    </>
  );
}
