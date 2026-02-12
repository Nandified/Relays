"use client";

import * as React from "react";

interface AnimatedCounterProps {
  value: string;
  label: string;
}

function parseNumericValue(value: string): { prefix: string; number: number; suffix: string; hasComma: boolean } {
  // Handle patterns like "2,400+", "15,000+", "4.8", "< 2hrs"
  const match = value.match(/^([<>\s]*)([0-9,.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: value, hasComma: false };

  const prefix = match[1];
  const numStr = match[2].replace(/,/g, "");
  const suffix = match[3];
  const hasComma = match[2].includes(",");
  const number = parseFloat(numStr);

  return { prefix, number, suffix, hasComma };
}

function formatNumber(n: number, hasComma: boolean, isFloat: boolean): string {
  if (isFloat) {
    return n.toFixed(1);
  }
  if (hasComma) {
    return Math.round(n).toLocaleString("en-US");
  }
  return Math.round(n).toString();
}

export function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = React.useState(value);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.unobserve(el);
          animateValue();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  });

  function animateValue() {
    const { prefix, number, suffix, hasComma } = parseNumericValue(value);
    if (number === 0) {
      setDisplayValue(value);
      return;
    }

    const isFloat = value.includes(".") && !value.includes(",");
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * number;

      setDisplayValue(`${prefix}${formatNumber(current, hasComma, isFloat)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    }

    requestAnimationFrame(update);
  }

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl font-bold text-slate-100">{displayValue}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}
