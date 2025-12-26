"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { OPEN_GAME_MAP_EVENT } from "@/components/Navbar";

interface GameMapContextType {
  isOpen: boolean;
  openMap: () => void;
  closeMap: () => void;
}

const GameMapContext = createContext<GameMapContextType | undefined>(undefined);

export function GameMapProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event from navbar
  useEffect(() => {
    const handleOpenMap = () => setIsOpen(true);
    window.addEventListener(OPEN_GAME_MAP_EVENT, handleOpenMap);
    return () => window.removeEventListener(OPEN_GAME_MAP_EVENT, handleOpenMap);
  }, []);

  const openMap = () => setIsOpen(true);
  const closeMap = () => setIsOpen(false);

  return (
    <GameMapContext.Provider value={{ isOpen, openMap, closeMap }}>
      {children}
    </GameMapContext.Provider>
  );
}

export function useGameMap() {
  const context = useContext(GameMapContext);
  if (context === undefined) {
    throw new Error("useGameMap must be used within a GameMapProvider");
  }
  return context;
}
