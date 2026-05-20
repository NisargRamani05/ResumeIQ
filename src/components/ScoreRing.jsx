import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScoreRing({ score, size = 160, strokeWidth = 12 }) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    // Animate score count up
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setCurrentScore(score);
        clearInterval(timer);
      } else {
        setCurrentScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (currentScore / 100) * circumference;

  let color = "#ef4444"; // red
  if (score >= 40 && score < 70) color = "#eab308"; // yellow
  if (score >= 70) color = "var(--accent-primary)"; // cyan

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-[var(--bg-secondary)]"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold" style={{ color }}>
          {currentScore}
        </span>
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mt-1">
          ATS Score
        </span>
      </div>
    </div>
  );
}
