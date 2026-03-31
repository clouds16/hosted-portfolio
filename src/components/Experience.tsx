import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { data } from "../data";
import { SectionLabel } from "./Skills";

export function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" style={{ padding: "8rem 3rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionLabel label="03" title="Experience" />

        <div ref={ref} style={{ marginTop: "4rem", position: "relative" }}>
          {/* vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: 1, background: "var(--border2)",
              transformOrigin: "top",
            }}
          />

          <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column", gap: "4rem" }}>
            {data.experience.map((job, i) => (
              <motion.div
                key={job.company}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                style={{ position: "relative" }}
              >
                {/* dot on timeline */}
                <div style={{
                  position: "absolute", left: -38, top: 8,
                  width: 9, height: 9, borderRadius: "50%",
                  background: i === 0 ? "var(--accent)" : "var(--border2)",
                  border: `2px solid ${i === 0 ? "var(--accent)" : "var(--text-dim)"}`,
                  boxShadow: i === 0 ? "0 0 12px var(--accent)" : "none",
                }} />

                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <h3 style={{
                        fontFamily: "var(--sans)", fontSize: "1.3rem", fontWeight: 700,
                        color: "var(--text)", letterSpacing: "-0.01em",
                      }}>
                        {job.role}
                      </h3>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--accent)", marginTop: 4 }}>
                        @ {job.company}
                        <span style={{ color: "var(--text-dim)", marginLeft: 8 }}>// {job.location}</span>
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: "0.68rem",
                      color: "var(--text-muted)", letterSpacing: "0.08em",
                      background: "var(--bg3)", border: "1px solid var(--border)",
                      padding: "0.3rem 0.75rem",
                    }}>
                      {job.period}
                    </span>
                  </div>
                </div>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {job.bullets.map((b, bi) => (
                    <motion.li
                      key={bi}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.2 + bi * 0.07 + 0.3 }}
                      style={{
                        fontFamily: "var(--mono)", fontSize: "0.82rem",
                        color: "var(--text-muted)", lineHeight: 1.7,
                        display: "flex", gap: "0.75rem",
                      }}
                    >
                      <span style={{ color: "var(--accent)", flexShrink: 0 }}>▸</span>
                      {b}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
