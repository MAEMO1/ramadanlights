"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { IntroPhase } from "@/lib/introConfig";

interface MapIntroSequenceProps {
  phase: IntroPhase;
  phaseProgress: number;
  isPlaying: boolean;
  isMobile?: boolean;
}

interface Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  size: number;
  alpha: number;
  speed: number;
}

export function MapIntroSequence({
  phase,
  phaseProgress,
  isPlaying,
  isMobile = false,
}: MapIntroSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const centralGlowRef = useRef({ alpha: 0, scale: 0, pulse: 0 });
  const timeRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [dimensions]);

  // Initialize particles when entering BEAMS_SWIRL
  useEffect(() => {
    if (phase === "PRELOAD" || phase === "BEAMS_SWIRL") {
      const count = isMobile ? 6 : 10;
      const particles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        particles.push({
          x: dimensions.width / 2,
          y: dimensions.height / 2,
          angle,
          radius: 80 + Math.random() * 60,
          size: 15 + Math.random() * 15,
          alpha: 0,
          speed: 0.5 + Math.random() * 0.5,
        });
      }

      particlesRef.current = particles;

      // Animate central glow in
      gsap.to(centralGlowRef.current, {
        alpha: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      });

      // Animate particles in
      particles.forEach((p, i) => {
        gsap.to(p, {
          alpha: 1,
          delay: i * 0.1,
          duration: 0.5,
        });
      });
    }
  }, [phase, dimensions, isMobile]);

  // Handle BEAMS_LAND phase - particles travel to targets
  useEffect(() => {
    if (phase !== "BEAMS_LAND") return;

    // Target positions matching the actual illuminated streets
    // Map center is [51.055, 3.715] at zoom 14
    // Wondelgemstraat midpoint: ~[51.0625, 3.710] - north and west of center
    // Bevrijdingslaan midpoint: ~[51.0606, 3.7015] - north and more west of center
    const targets = [
      { x: dimensions.width * 0.47, y: dimensions.height * 0.37 }, // Wondelgemstraat (upper-left area)
      { x: dimensions.width * 0.42, y: dimensions.height * 0.40 }, // Bevrijdingslaan (more to the left)
    ];

    // Fade out central glow
    gsap.to(centralGlowRef.current, {
      alpha: 0,
      scale: 1.5,
      duration: 1,
      ease: "power2.out",
    });

    // Send particles to targets
    particlesRef.current.forEach((p, i) => {
      const target = targets[i % 2];
      gsap.to(p, {
        x: target.x + (Math.random() - 0.5) * 100,
        y: target.y + (Math.random() - 0.5) * 100,
        duration: 1.2,
        delay: (i % 2) * 0.15,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(p, { alpha: 0, duration: 0.3 });
        },
      });
    });
  }, [phase, dimensions]);

  // Main animation loop
  useEffect(() => {
    if (!isPlaying || phase === "IDLE" || phase === "COMPLETE") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw central glow
      if (centralGlowRef.current.alpha > 0.01) {
        const glow = centralGlowRef.current;
        const pulseScale = 1 + Math.sin(timeRef.current * 3) * 0.1;
        const size = 80 * glow.scale * pulseScale;

        // Outer glow layers
        for (let i = 3; i >= 0; i--) {
          const layerSize = size * (1 + i * 0.8);
          const layerAlpha = glow.alpha * (0.15 / (i + 1));

          const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, layerSize);
          gradient.addColorStop(0, `rgba(255, 215, 0, ${layerAlpha})`);
          gradient.addColorStop(0.5, `rgba(255, 200, 0, ${layerAlpha * 0.5})`);
          gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, layerSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bright core
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.4);
        coreGradient.addColorStop(0, `rgba(255, 255, 240, ${glow.alpha})`);
        coreGradient.addColorStop(0.5, `rgba(255, 230, 150, ${glow.alpha * 0.8})`);
        coreGradient.addColorStop(1, `rgba(255, 215, 0, ${glow.alpha * 0.3})`);

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and update particles
      particlesRef.current.forEach((p) => {
        if (p.alpha < 0.01) return;

        // In BEAMS_SWIRL, orbit around center
        if (phase === "PRELOAD" || phase === "BEAMS_SWIRL") {
          p.angle += p.speed * 0.02;
          p.x = centerX + Math.cos(p.angle) * p.radius;
          p.y = centerY + Math.sin(p.angle) * p.radius;
        }

        // Draw particle glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 240, ${p.alpha})`);
        gradient.addColorStop(0.3, `rgba(255, 215, 0, ${p.alpha * 0.8})`);
        gradient.addColorStop(0.6, `rgba(255, 180, 0, ${p.alpha * 0.3})`);
        gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Trail effect for BEAMS_LAND
        if (phase === "BEAMS_LAND") {
          const trailLength = 30;
          const trailAngle = Math.atan2(p.y - centerY, p.x - centerX);
          const trailX = p.x - Math.cos(trailAngle) * trailLength;
          const trailY = p.y - Math.sin(trailAngle) * trailLength;

          const trailGradient = ctx.createLinearGradient(trailX, trailY, p.x, p.y);
          trailGradient.addColorStop(0, "rgba(255, 215, 0, 0)");
          trailGradient.addColorStop(1, `rgba(255, 215, 0, ${p.alpha * 0.6})`);

          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = p.size * 0.8;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });

      // Flash effect for STREETS_GLOW
      if (phase === "STREETS_GLOW") {
        const flashProgress = phaseProgress;
        const flashAlpha = flashProgress < 0.2
          ? flashProgress * 5
          : Math.max(0, 1 - (flashProgress - 0.2) * 1.5);

        if (flashAlpha > 0.01) {
          // Flash at target locations (matching particle landing spots on actual streets)
          const flashPoints = [
            { x: dimensions.width * 0.47, y: dimensions.height * 0.37 }, // Wondelgemstraat
            { x: dimensions.width * 0.42, y: dimensions.height * 0.40 }, // Bevrijdingslaan
          ];

          flashPoints.forEach((point) => {
            const gradient = ctx.createRadialGradient(
              point.x, point.y, 0,
              point.x, point.y, 250
            );
            gradient.addColorStop(0, `rgba(255, 230, 150, ${flashAlpha * 0.8})`);
            gradient.addColorStop(0.3, `rgba(255, 215, 0, ${flashAlpha * 0.4})`);
            gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 250, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, phase, phaseProgress, dimensions]);

  // Cleanup GSAP on unmount
  useEffect(() => {
    const particles = particlesRef.current;
    const glow = centralGlowRef.current;

    return () => {
      gsap.killTweensOf(glow);
      particles.forEach((p) => gsap.killTweensOf(p));
    };
  }, []);

  // Determine if we should show effects
  const showEffects = phase !== "IDLE" && phase !== "COMPLETE" && phase !== "MOSQUES_RISE" && phase !== "SPONSORS_WAVE";

  // Always render canvas but control visibility via opacity
  // This ensures dimensions are set up before animation starts
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 10001, // Above curtains (9998) and map (9997)
        opacity: showEffects ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    />
  );
}
