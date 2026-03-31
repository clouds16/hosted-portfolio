import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = ["hero", "skills", "experience", "projects", "contact"];

export function Nav() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of [...links].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.2rem 3rem",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        background: scrolled ? "rgba(10,10,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <span style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--accent)", letterSpacing: "0.08em" }}>
        HAT<span style={{ color: "var(--text-muted)" }}>.dev</span>
      </span>
      <div style={{ display: "flex", gap: "2.5rem" }}>
        {links.map((l) => (
          <a
            key={l}
            href={`#${l}`}
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: active === l ? "var(--accent)" : "var(--text-muted)",
              transition: "color 0.2s",
              position: "relative",
            }}
          >
            <AnimatePresence>
              {active === l && (
                <motion.span
                  layoutId="nav-dot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "block",
                  }}
                />
              )}
            </AnimatePresence>
            {l}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
