import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { data } from "../data";
import { SectionLabel } from "./Skills";

export function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" style={{ padding: "8rem 3rem", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel label="04" title="Projects" />

        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))",
            gap: "1.5rem",
            marginTop: "4rem",
          }}
        >
          {data.projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              whileHover={{ y: -4 }}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
                cursor: "none",
              }}
            >
              {/* Corner accent */}
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: 60, height: 60,
                background: `linear-gradient(225deg, ${project.color}22, transparent 60%)`,
              }} />
              <div style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: 2,
                background: project.color,
                opacity: 0.7,
              }} />

              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: "1rem",
              }}>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: "0.65rem",
                  color: "var(--text-dim)", letterSpacing: "0.15em",
                }}>
                  <span style={{ color: project.color }}>//</span> project/{String(i + 1).padStart(2, "0")}
                </div>
                <ExternalLink size={14} color="var(--text-dim)" />
              </div>

              <h3 style={{
                fontFamily: "var(--sans)", fontSize: "1.4rem",
                fontWeight: 700, color: "var(--text)",
                letterSpacing: "-0.01em", marginBottom: "0.75rem",
              }}>
                {project.name}
              </h3>

              <p style={{
                fontFamily: "var(--mono)", fontSize: "0.8rem",
                color: "var(--text-muted)", lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}>
                {project.desc}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--mono)", fontSize: "0.65rem",
                      letterSpacing: "0.06em", color: project.color,
                      background: `${project.color}14`,
                      border: `1px solid ${project.color}33`,
                      padding: "0.25rem 0.6rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
