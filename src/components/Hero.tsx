import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { data } from "../data";

function useTypewriter(text: string, speed = 45, delay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);
  return { displayed, done };
}

function GridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.ceil(canvas.width / 48);
    const rows = Math.ceil(canvas.height / 48);
    const cells: { x: number; y: number; alpha: number; speed: number }[] = [];

    for (let i = 0; i < 18; i++) {
      cells.push({
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
        alpha: Math.random(),
        speed: 0.004 + Math.random() * 0.008,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(30,30,46,0.6)";
      ctx.lineWidth = 0.5;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath(); ctx.moveTo(c * 48, 0); ctx.lineTo(c * 48, canvas.height); ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * 48); ctx.lineTo(canvas.width, r * 48); ctx.stroke();
      }
      cells.forEach((cell) => {
        cell.alpha += cell.speed;
        if (cell.alpha > 1) { cell.alpha = 0; cell.x = Math.floor(Math.random() * cols); cell.y = Math.floor(Math.random() * rows); }
        ctx.fillStyle = `rgba(0,255,136,${cell.alpha * 0.12})`;
        ctx.fillRect(cell.x * 48 + 1, cell.y * 48 + 1, 46, 46);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

export function Hero() {
  const { displayed: title, done: titleDone } = useTypewriter(data.title, 50, 600);
  const { displayed: tagline } = useTypewriter(data.tagline, 30, titleDone ? 200 : 9999);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 3rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GridBg />

      {/* Glow */}
      <div style={{
        position: "absolute", top: "30%", left: "10%",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <span style={{
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontFamily: "var(--mono)",
          }}>
            <span style={{ color: "var(--text-dim)" }}>~/</span>portfolio<span style={{ color: "var(--text-dim)" }}> $</span> whoami
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "var(--sans)",
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            marginBottom: "1rem",
          }}
        >
          {data.name.split(" ").map((word, i) => (
            <span key={i} style={{ display: "block", color: i === 0 ? "var(--text)" : i === 1 ? "var(--text-muted)" : "var(--accent)" }}>
              {word}
            </span>
          ))}
        </motion.h1>

        <div style={{
          fontFamily: "var(--mono)",
          fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
          color: "var(--accent2)",
          marginBottom: "1.2rem",
          minHeight: "2rem",
        }}>
          <span style={{ color: "var(--text-dim)" }}>// </span>{title}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            style={{ display: "inline-block", width: 2, height: "1em", background: "var(--accent2)", marginLeft: 3, verticalAlign: "middle" }}
          />
        </div>

        <div style={{
          fontFamily: "var(--mono)",
          fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
          color: "var(--text-muted)",
          marginBottom: "3rem",
          minHeight: "1.5rem",
        }}>
          {tagline}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <a href="#projects" style={btnStyle("var(--accent)", "var(--bg)")}>
            ./view_projects
          </a>
          <a href="#contact" style={btnStyle("transparent", "var(--accent)", "var(--accent)")}>
            ./get_in_touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          style={{ marginTop: "4rem", display: "flex", gap: "2rem", fontSize: "0.72rem", color: "var(--text-dim)" }}
        >
          {[["loc", data.location], ["status", "open to work"], ["stack", "TS · Go · AWS"]].map(([k, v]) => (
            <span key={k}>
              <span style={{ color: "var(--text-muted)" }}>{k}</span>
              <span style={{ color: "var(--text-dim)" }}>={`"`}</span>
              <span style={{ color: "var(--accent)" }}>{v}</span>
              <span style={{ color: "var(--text-dim)" }}>{`"`}</span>
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{
          position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          color: "var(--text-dim)", fontSize: "0.65rem", letterSpacing: "0.15em",
        }}
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          style={{ width: 1, height: 28, background: "linear-gradient(to bottom, var(--text-dim), transparent)" }}
        />
      </motion.div>
    </section>
  );
}

function btnStyle(bg: string, color: string, border?: string) {
  return {
    display: "inline-block",
    padding: "0.75rem 1.75rem",
    fontFamily: "var(--mono)",
    fontSize: "0.8rem",
    letterSpacing: "0.05em",
    background: bg,
    color,
    border: `1px solid ${border ?? bg}`,
    textDecoration: "none",
    cursor: "none",
    transition: "all 0.2s",
  } as React.CSSProperties;
}
