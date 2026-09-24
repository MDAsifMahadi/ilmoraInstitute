"use client";

import { useEffect, useRef, useState } from "react";

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function bengaliToNumber(value: string): number {
  const base = "০".charCodeAt(0);
  let digits = "";
  for (const ch of value) {
    if (ch >= "০" && ch <= "৯") {
      digits += String(ch.charCodeAt(0) - base);
    } else if (ch >= "0" && ch <= "9") {
      digits += ch;
    }
  }
  return digits ? parseInt(digits, 10) : 0;
}

function numberToBengali(value: number): string {
  return String(value).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
}

export default function StatsCounter({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [display, setDisplay] = useState(0);
  const target = bengaliToNumber(value);
  const suffix = value.includes("%") ? "%" : value.includes("+") ? "+" : "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const startCount = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const duration = 1800;

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      startCount();
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCount();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return (
    <p
      ref={ref}
      className="font-display text-4xl font-black tracking-tight text-gold tabular-nums sm:text-5xl"
    >
      {numberToBengali(display)}
      <span className="text-gold">{suffix}</span>
    </p>
  );
}