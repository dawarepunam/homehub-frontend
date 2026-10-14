"use client";

import React, { useEffect, useState } from "react";
import styles from "./BuyerHeroBackground.module.css";

// 52 particles with well-distributed coordinates across the full hero area
const PARTICLES = [
  { id: 1, x: 8, y: 18, size: 3.5, duration: 9, delay: 0, opacity: 0.75 },
  { id: 2, x: 14, y: 35, size: 2.2, duration: 11, delay: -2, opacity: 0.6 },
  { id: 3, x: 22, y: 12, size: 4.0, duration: 8, delay: -4, opacity: 0.8 },
  { id: 4, x: 28, y: 48, size: 2.5, duration: 13, delay: -1, opacity: 0.65 },
  { id: 5, x: 35, y: 22, size: 3.0, duration: 10, delay: -5, opacity: 0.7 },
  { id: 6, x: 18, y: 70, size: 3.2, duration: 12, delay: -3, opacity: 0.7 },
  { id: 7, x: 12, y: 82, size: 2.0, duration: 9, delay: -6, opacity: 0.55 },
  { id: 8, x: 26, y: 88, size: 3.8, duration: 14, delay: -2, opacity: 0.75 },
  { id: 9, x: 42, y: 15, size: 2.4, duration: 11, delay: -7, opacity: 0.65 },
  { id: 10, x: 48, y: 38, size: 3.5, duration: 8, delay: -1, opacity: 0.8 },
  { id: 11, x: 55, y: 18, size: 2.8, duration: 12, delay: -4, opacity: 0.7 },
  { id: 12, x: 62, y: 28, size: 3.6, duration: 10, delay: -8, opacity: 0.8 },
  { id: 13, x: 68, y: 12, size: 2.2, duration: 13, delay: -3, opacity: 0.6 },
  { id: 14, x: 74, y: 42, size: 4.2, duration: 9, delay: -5, opacity: 0.85 },
  { id: 15, x: 82, y: 20, size: 3.0, duration: 11, delay: -2, opacity: 0.7 },
  { id: 16, x: 88, y: 34, size: 2.5, duration: 14, delay: -6, opacity: 0.65 },
  { id: 17, x: 92, y: 16, size: 3.8, duration: 8, delay: -4, opacity: 0.8 },
  { id: 18, x: 78, y: 68, size: 3.4, duration: 12, delay: -1, opacity: 0.75 },
  { id: 19, x: 85, y: 80, size: 2.4, duration: 10, delay: -5, opacity: 0.6 },
  { id: 20, x: 70, y: 86, size: 4.0, duration: 13, delay: -7, opacity: 0.85 },
  { id: 21, x: 64, y: 60, size: 2.8, duration: 11, delay: -3, opacity: 0.7 },
  { id: 22, x: 38, y: 78, size: 3.0, duration: 9, delay: -8, opacity: 0.75 },
  { id: 23, x: 50, y: 84, size: 2.5, duration: 12, delay: -2, opacity: 0.65 },
  { id: 24, x: 6, y: 55, size: 3.5, duration: 10, delay: -4, opacity: 0.8 },
  { id: 25, x: 94, y: 62, size: 3.2, duration: 13, delay: -5, opacity: 0.75 },
  { id: 26, x: 16, y: 25, size: 2.0, duration: 8, delay: -1, opacity: 0.55 },
  { id: 27, x: 32, y: 30, size: 3.6, duration: 14, delay: -6, opacity: 0.8 },
  { id: 28, x: 45, y: 52, size: 2.2, duration: 10, delay: -3, opacity: 0.6 },
  { id: 29, x: 58, y: 48, size: 3.4, duration: 11, delay: -7, opacity: 0.75 },
  { id: 30, x: 72, y: 24, size: 2.6, duration: 9, delay: -2, opacity: 0.65 },
  { id: 31, x: 84, y: 52, size: 3.8, duration: 12, delay: -5, opacity: 0.8 },
  { id: 32, x: 90, y: 75, size: 2.2, duration: 10, delay: -1, opacity: 0.6 },
  { id: 33, x: 4, y: 32, size: 3.0, duration: 13, delay: -6, opacity: 0.7 },
  { id: 34, x: 24, y: 62, size: 2.4, duration: 8, delay: -4, opacity: 0.65 },
  { id: 35, x: 60, y: 72, size: 3.6, duration: 11, delay: -2, opacity: 0.8 },
  { id: 36, x: 80, y: 36, size: 2.0, duration: 12, delay: -7, opacity: 0.55 },
  { id: 37, x: 96, y: 45, size: 3.5, duration: 9, delay: -3, opacity: 0.75 },
  { id: 38, x: 10, y: 92, size: 2.8, duration: 14, delay: -5, opacity: 0.7 },
  { id: 39, x: 30, y: 8, size: 4.2, duration: 10, delay: -1, opacity: 0.85 },
  { id: 40, x: 52, y: 8, size: 2.5, duration: 12, delay: -6, opacity: 0.65 },
  { id: 41, x: 66, y: 6, size: 3.6, duration: 8, delay: -3, opacity: 0.8 },
  { id: 42, x: 86, y: 10, size: 2.2, duration: 11, delay: -7, opacity: 0.6 },
  { id: 43, x: 2, y: 72, size: 3.4, duration: 13, delay: -4, opacity: 0.75 },
  { id: 44, x: 46, y: 65, size: 2.6, duration: 9, delay: -2, opacity: 0.65 },
  { id: 45, x: 76, y: 76, size: 3.8, duration: 10, delay: -5, opacity: 0.8 },
  { id: 46, x: 36, y: 92, size: 2.2, duration: 12, delay: -8, opacity: 0.6 },
  { id: 47, x: 54, y: 94, size: 3.2, duration: 9, delay: -1, opacity: 0.75 },
  { id: 48, x: 92, y: 90, size: 2.4, duration: 14, delay: -6, opacity: 0.6 },
  { id: 49, x: 20, y: 42, size: 3.0, duration: 11, delay: -3, opacity: 0.7 },
  { id: 50, x: 40, y: 42, size: 2.0, duration: 8, delay: -5, opacity: 0.55 },
  { id: 51, x: 60, y: 36, size: 3.4, duration: 13, delay: -2, opacity: 0.75 },
  { id: 52, x: 100, y: 25, size: 2.8, duration: 10, delay: -7, opacity: 0.7 },
];

export default function BuyerHeroBackground({ customImageUrl }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.backgroundContainer} aria-hidden="true">
      {/* 1. Static Architectural Hero Imagery Layer — completely static */}
      <div
        className={styles.heroImageLayer}
        style={
          customImageUrl
            ? {
                backgroundImage: `radial-gradient(circle at 50% 28%, transparent 0%, var(--bg-page) 85%), linear-gradient(to bottom, transparent 35%, var(--bg-page) 98%), url(${customImageUrl})`,
              }
            : undefined
        }
      />

      {/* 2. Edge & Center Ambient Vignette */}
      <div className={styles.vignette} />

      {/* 2b. Soft Atmospheric Bottom Glow — GetSiteGo-inspired radial bloom at hero bottom edge */}
      <div className={styles.bottomGlow} />

      {/* 3. Floating Particle Field — clearly visible and moving smoothly */}
      <div className={styles.particlesContainer}>
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              "--opacity": p.opacity,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 4. Refined Wireframe Globe & Lat/Long Mesh with Subtle Drifting/Flowing Lines */}
      <div className={styles.globeWrapper}>
        <svg
          className={styles.globeSvg}
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="buyerGlobeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="var(--text-primary)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0.09" />
            </radialGradient>
          </defs>

          {/* Outer circle & rim glow */}
          <circle cx="400" cy="400" r="380" className={styles.gridLine} />
          <circle cx="400" cy="400" r="380" fill="url(#buyerGlobeGlow)" />

          {/* Latitudes (Static structural lines) */}
          <ellipse cx="400" cy="400" rx="380" ry="70" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="360" ry="150" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="300" ry="250" className={styles.gridLine} />

          {/* Subtle flowing/drifting animated pulse trails along key latitudes */}
          <ellipse
            cx="400"
            cy="400"
            rx="380"
            ry="70"
            className={styles.movingLine}
            style={{ animationDuration: "14s", animationDelay: "0s" }}
          />
          <ellipse
            cx="400"
            cy="400"
            rx="360"
            ry="150"
            className={styles.movingLine}
            style={{ animationDuration: "18s", animationDelay: "-4s" }}
          />

          {/* Longitudes (Static structural lines) */}
          <ellipse cx="400" cy="400" rx="70" ry="380" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="150" ry="380" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="250" ry="380" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="330" ry="380" className={styles.gridLine} />

          {/* Subtle flowing/drifting animated pulse trails along key longitudes */}
          <ellipse
            cx="400"
            cy="400"
            rx="150"
            ry="380"
            className={styles.movingLine}
            style={{ animationDuration: "16s", animationDelay: "-2s" }}
          />
          <ellipse
            cx="400"
            cy="400"
            rx="250"
            ry="380"
            className={styles.movingLine}
            style={{ animationDuration: "20s", animationDelay: "-8s" }}
          />

          {/* Equator & Prime Meridian Axis */}
          <line x1="20" y1="400" x2="780" y2="400" className={styles.gridLine} />
          <line x1="400" y1="20" x2="400" y2="780" className={styles.gridLine} />
        </svg>
      </div>
    </div>
  );
}
