import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GitBranch, Link, Mail, MapPin } from "lucide-react";
import { data } from "../data";
import { SectionLabel } from "./Skills";

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const links = [
    { icon: Mail, label: "Email", value: data.email, href: `mailto:${data.email}` },
    { icon: GitBranch, label: "GitHub", value: "github.com/hectoralvarez", href: data.github },
    { icon: Link, label: "LinkedIn", value: "in/hectoralvarez", href: data.linkedin },
    { icon: MapPin, label: "Location", value: data.location, href: "#" },
  ];

  return (
    <section id="contact" style={{ padding: "8rem 3rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionLabel label="05" title="Contact" />

        <div ref={ref} style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p style={{
              fontFamily: "var(--mono)", fontSize: "0.88rem",
              color: "var(--text-muted)", lineHeight: 2, marginBottom: "2rem",
            }}>
              <span style={{ color: "var(--text-dim)" }}>/*</span><br />
              &nbsp;Open to new opportunities — full-stack,<br />
              &nbsp;DevOps, and frontend-heavy roles.<br />
              &nbsp;Let's build something.<br />
              <span style={{ color: "var(--text-dim)" }}>&nbsp;*/</span>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {["TypeScript", "React", "Go", "AWS", "Docker"].map((tech, i) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-dim)" }}
                >
                  <span style={{ color: "var(--accent)" }}>const</span>{" "}
                  <span style={{ color: "var(--accent2)" }}>{tech.toLowerCase()}</span>{" "}
                  <span style={{ color: "var(--text-dim)" }}>=</span>{" "}
                  <span style={{ color: "#c3a0ff" }}>"{tech} ✓"</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {links.map(({ icon: Icon, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 + 0.2 }}
                whileHover={{ x: 6 }}
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.25rem",
                  background: "var(--bg3)", border: "1px solid var(--border)",
                  textDecoration: "none", cursor: "none",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <Icon size={16} color="var(--accent)" />
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>{value}</div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "6rem", paddingTop: "2rem",
          borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text-dim)",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <span><span style={{ color: "var(--accent)" }}>HAT</span>.dev — Hector Alvarez Toledo</span>
          <span>Built with React + Vite · Deployed on AWS/Nginx</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
}
