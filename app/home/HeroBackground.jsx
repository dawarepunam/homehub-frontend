"use client";

import React, { useEffect, useState } from "react";
import styles from "./HeroBackground.module.css";

export default function HeroBackground() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.backgroundContainer}>
      {/* Edge Vignette */}
      <div className={styles.vignette} />

      {/* Particle field */}
      <div className={styles.particlesContainer}>
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              "--x": `${Math.random() * 100}%`,
              "--y": `${Math.random() * 100}%`,
              "--duration": `${Math.random() * 15 + 15}s`,
              "--delay": `-${Math.random() * 30}s`,
              "--size": `${Math.random() * 2.5 + 0.5}px`,
              "--opacity": Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* 3D Wireframe Globe using SVG */}
      <div className={styles.globeWrapper}>
        <svg
          className={styles.globeSvg}
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="var(--text-primary)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Outer circle */}
          <circle cx="400" cy="400" r="380" className={styles.gridLine} />
          <circle cx="400" cy="400" r="380" fill="url(#globeGlow)" />

          {/* Latitudes */}
          <ellipse cx="400" cy="400" rx="380" ry="60" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="360" ry="140" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="300" ry="240" className={styles.gridLine} />

          <ellipse cx="400" cy="400" rx="380" ry="60" className={styles.pulse} style={{ animationDelay: '0s' }} />
          <ellipse cx="400" cy="400" rx="360" ry="140" className={styles.pulse} style={{ animationDelay: '4s' }} />

          {/* Longitudes */}
          <ellipse cx="400" cy="400" rx="60" ry="380" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="140" ry="380" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="240" ry="380" className={styles.gridLine} />
          <ellipse cx="400" cy="400" rx="320" ry="380" className={styles.gridLine} />

          <ellipse cx="400" cy="400" rx="140" ry="380" className={styles.pulse} style={{ animationDelay: '2s' }} />
          <ellipse cx="400" cy="400" rx="240" ry="380" className={styles.pulse} style={{ animationDelay: '6s' }} />
          
          <line x1="20" y1="400" x2="780" y2="400" className={styles.gridLine} />
          <line x1="400" y1="20" x2="400" y2="780" className={styles.gridLine} />
        </svg>
      </div>
    </div>
  );
}
