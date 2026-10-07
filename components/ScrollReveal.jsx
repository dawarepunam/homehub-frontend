"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  animation = "fade-up", // "fade-up", "fade-in", "fade-left", "fade-right"
  delay = 0,
  duration = 0.5,
  className = "",
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getAnimationStyles = () => {
    switch (animation) {
      case "fade-up":
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(25px)",
        };
      case "fade-in":
        return {
          opacity: isVisible ? 1 : 0,
        };
      case "fade-left":
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(25px)",
        };
      case "fade-right":
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(-25px)",
        };
      default:
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(25px)",
        };
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...getAnimationStyles(),
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
