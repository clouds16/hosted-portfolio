import { useEffect, useRef, useState } from "react";

export type TypewriterResult = {
  displayed: string;
  done: boolean;
};

/**
 * Reveals `text` one character at a time after `delay` ms.
 *
 * Optional `onTick` is called once per character — useful for playing a sound
 * effect on each keystroke. Stored in a ref so changing the callback between
 * renders doesn't restart typing.
 */
export function useTypewriter(
  text: string,
  speed = 45,
  delay = 0,
  onTick?: () => void,
): TypewriterResult {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

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
        onTickRef.current?.();
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
