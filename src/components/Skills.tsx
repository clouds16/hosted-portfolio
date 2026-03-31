import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { data } from "../data";

export function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" style={{ padding: "8rem 3rem", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel label="02" title="Skills & Stack" />

        <div ref={ref} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginTop: "4rem",
        }}>
          {data.skills.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: gi * 0.1, duration: 0.5 }}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                padding: "1.75rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: gi % 3 === 0 ? "var(--accent)" : gi % 3 === 1 ? "var(--accent2)" : "var(--accent3)",
              }} />
              <div style={{
                fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--text-dim)", marginBottom: "1.25rem", fontFamily: "var(--mono)",
              }}>
                <span style={{ color: "var(--accent)" }}>$</span> {group.category}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {group.items.map((item, ii) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: gi * 0.1 + ii * 0.04 }}
                    style={{
                      fontSize: "0.72rem",
                      fontFamily: "var(--mono)",
                      color: "var(--text-muted)",
                      background: "var(--bg2)",
                      border: "1px solid var(--border2)",
                      padding: "0.3rem 0.75rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionLabel({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <span style={{
        fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent)",
        letterSpacing: "0.15em", opacity: 0.6,
      }}>
        [{label}]
      </span>
      <h2 style={{
        fontFamily: "var(--sans)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
        fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)",
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: "var(--border)", marginLeft: "1rem" }} />
    </div>
  );
}
