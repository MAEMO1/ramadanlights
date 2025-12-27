import { useState, useCallback, useEffect, useRef } from "react";
import {
  IntroPhase,
  INTRO_PHASES,
  PHASE_TIMELINE,
  REDUCED_MOTION_CONFIG,
} from "@/lib/introConfig";

interface UseIntroStateMachineOptions {
  autoStart?: boolean;
  prefersReducedMotion?: boolean;
  onPhaseChange?: (phase: IntroPhase, prevPhase: IntroPhase) => void;
  onComplete?: () => void;
}

interface UseIntroStateMachineReturn {
  phase: IntroPhase;
  isPlaying: boolean;
  progress: number; // 0-1 overall progress
  phaseProgress: number; // 0-1 current phase progress
  start: () => void;
  skip: () => void;
  reset: () => void;
  goToPhase: (phase: IntroPhase) => void;
}

const PHASE_ORDER: IntroPhase[] = [
  "IDLE",
  "PRELOAD",
  "BEAMS_SWIRL",
  "BEAMS_LAND",
  "STREETS_GLOW",
  "MOSQUES_RISE",
  "SPONSORS_WAVE",
  "COMPLETE",
];

export function useIntroStateMachine(
  options: UseIntroStateMachineOptions = {}
): UseIntroStateMachineReturn {
  const {
    autoStart = false,
    prefersReducedMotion = false,
    onPhaseChange,
    onComplete,
  } = options;

  const [phase, setPhase] = useState<IntroPhase>("IDLE");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);

  const startTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const prevPhaseRef = useRef<IntroPhase>("IDLE");

  const totalDuration = PHASE_TIMELINE.COMPLETE_START;

  // Calculate current phase from elapsed time
  const getPhaseFromTime = useCallback((elapsed: number): IntroPhase => {
    if (elapsed >= PHASE_TIMELINE.COMPLETE_START) return "COMPLETE";
    if (elapsed >= PHASE_TIMELINE.SPONSORS_WAVE_START) return "SPONSORS_WAVE";
    if (elapsed >= PHASE_TIMELINE.MOSQUES_RISE_START) return "MOSQUES_RISE";
    if (elapsed >= PHASE_TIMELINE.STREETS_GLOW_START) return "STREETS_GLOW";
    if (elapsed >= PHASE_TIMELINE.BEAMS_LAND_START) return "BEAMS_LAND";
    if (elapsed >= PHASE_TIMELINE.BEAMS_SWIRL_START) return "BEAMS_SWIRL";
    if (elapsed >= PHASE_TIMELINE.PRELOAD_START) return "PRELOAD";
    return "IDLE";
  }, []);

  // Get phase start time
  const getPhaseStartTime = useCallback((phase: IntroPhase): number => {
    switch (phase) {
      case "PRELOAD": return PHASE_TIMELINE.PRELOAD_START;
      case "BEAMS_SWIRL": return PHASE_TIMELINE.BEAMS_SWIRL_START;
      case "BEAMS_LAND": return PHASE_TIMELINE.BEAMS_LAND_START;
      case "STREETS_GLOW": return PHASE_TIMELINE.STREETS_GLOW_START;
      case "MOSQUES_RISE": return PHASE_TIMELINE.MOSQUES_RISE_START;
      case "SPONSORS_WAVE": return PHASE_TIMELINE.SPONSORS_WAVE_START;
      case "COMPLETE": return PHASE_TIMELINE.COMPLETE_START;
      default: return 0;
    }
  }, []);

  // Animation loop
  const tick = useCallback(() => {
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000; // Convert to seconds

    const currentPhase = getPhaseFromTime(elapsed);
    const overallProgress = Math.min(1, elapsed / totalDuration);

    // Calculate phase progress
    const phaseStart = getPhaseStartTime(currentPhase);
    const phaseDuration = INTRO_PHASES[currentPhase].duration;
    const phaseElapsed = elapsed - phaseStart;
    const currentPhaseProgress = phaseDuration > 0
      ? Math.min(1, phaseElapsed / phaseDuration)
      : 1;

    setProgress(overallProgress);
    setPhaseProgress(currentPhaseProgress);

    // Handle phase transitions
    if (currentPhase !== prevPhaseRef.current) {
      const prev = prevPhaseRef.current;
      prevPhaseRef.current = currentPhase;
      setPhase(currentPhase);
      onPhaseChange?.(currentPhase, prev);

      if (currentPhase === "COMPLETE") {
        setIsPlaying(false);
        onComplete?.();
        return; // Stop the animation loop
      }
    }

    if (overallProgress < 1) {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [getPhaseFromTime, getPhaseStartTime, totalDuration, onPhaseChange, onComplete]);

  // Start the intro
  const start = useCallback(() => {
    if (isPlaying) return;

    // Handle reduced motion preference
    if (prefersReducedMotion) {
      setPhase(REDUCED_MOTION_CONFIG.skipToPhase);
      setProgress(getPhaseStartTime(REDUCED_MOTION_CONFIG.skipToPhase) / totalDuration);

      // Quick transition to complete
      setTimeout(() => {
        setPhase("COMPLETE");
        setProgress(1);
        setPhaseProgress(1);
        onComplete?.();
      }, REDUCED_MOTION_CONFIG.markerFadeDuration * 1000);
      return;
    }

    setIsPlaying(true);
    setPhase("PRELOAD");
    prevPhaseRef.current = "PRELOAD";
    startTimeRef.current = performance.now();
    rafIdRef.current = requestAnimationFrame(tick);
  }, [isPlaying, prefersReducedMotion, tick, getPhaseStartTime, totalDuration, onComplete]);

  // Skip to complete
  const skip = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    setIsPlaying(false);
    setPhase("COMPLETE");
    setProgress(1);
    setPhaseProgress(1);
    prevPhaseRef.current = "COMPLETE";
    onComplete?.();
  }, [onComplete]);

  // Reset to idle
  const reset = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    setIsPlaying(false);
    setPhase("IDLE");
    setProgress(0);
    setPhaseProgress(0);
    prevPhaseRef.current = "IDLE";
  }, []);

  // Jump to specific phase
  const goToPhase = useCallback((targetPhase: IntroPhase) => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    const targetTime = getPhaseStartTime(targetPhase);
    setPhase(targetPhase);
    setProgress(targetTime / totalDuration);
    setPhaseProgress(0);
    prevPhaseRef.current = targetPhase;

    if (targetPhase === "COMPLETE") {
      setIsPlaying(false);
      setProgress(1);
      setPhaseProgress(1);
      onComplete?.();
    } else {
      // Resume from this phase
      setIsPlaying(true);
      startTimeRef.current = performance.now() - (targetTime * 1000);
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [getPhaseStartTime, totalDuration, tick, onComplete]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && phase === "IDLE") {
      start();
    }
  }, [autoStart, phase, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    phase,
    isPlaying,
    progress,
    phaseProgress,
    start,
    skip,
    reset,
    goToPhase,
  };
}
