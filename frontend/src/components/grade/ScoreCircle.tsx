"use client";
import React, { useEffect, useState } from "react";

export default function ScoreCircle({ overallBand }: { overallBand: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setProgress((p) => {
        if (p < overallBand) {
          frame = requestAnimationFrame(animate);
          return +(p + 0.1).toFixed(1);
        }
        return overallBand;
      });
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [overallBand]);

  const circleRadius = 55;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (progress / 9) * circumference;

  const getColor = (score: number) => {
    if (score < 5.5) return "#dc2626"; // red
    if (score < 7) return "#f59e0b"; // orange
    return "#0d9488"; // teal
  };

  return (
    <svg viewBox="0 0 150 150" className="w-36 h-36">
      <circle
        cx="75"
        cy="75"
        r={circleRadius}
        stroke="#e5e7eb"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="75"
        cy="75"
        r={circleRadius}
        stroke={getColor(overallBand)}
        strokeWidth="10"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.3s" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-3xl font-bold fill-teal-700"
      >
        {progress.toFixed(1)}
      </text>
    </svg>
  );
}
