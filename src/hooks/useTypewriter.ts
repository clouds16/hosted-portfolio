import { useEffect, useState } from "react";

export type TypewriterResult = {
  displayed: string;
  done: boolean;
};

export function useTypewriter(text: string, speed = 45, delay = 0): TypewriterResult {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(text.length === 0);
    if (text.length === 0) return;

    let i = 0;
    let interval = 0;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          window.clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [text, speed, delay]);

  return { displayed, done };
}
