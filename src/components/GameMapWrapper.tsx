"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GameMapProvider, useGameMap } from "@/contexts/GameMapContext";
import type { FoodPartner } from "@/lib/food-partner-types";
import type { ShopPartner } from "@/lib/shop-partner-types";

// Dynamically import to avoid SSR issues with Leaflet
const GameMapOverlay = dynamic(
  () => import("@/components/GameMapOverlay").then((mod) => mod.GameMapOverlay),
  { ssr: false }
);

interface Mosque {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
}

function GameMapContent() {
  const { isOpen, closeMap } = useGameMap();
  const [foodPartners, setFoodPartners] = useState<FoodPartner[]>([]);
  const [shopPartners, setShopPartners] = useState<ShopPartner[]>([]);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data when map opens for the first time
  useEffect(() => {
    if (isOpen && !dataLoaded) {
      Promise.all([
        fetch("/api/food-partners/list").then((r) => r.json()),
        fetch("/api/shop-partners/list").then((r) => r.json()),
        fetch("/api/mosques").then((r) => r.json()),
      ])
        .then(([foodData, shopData, mosqueData]) => {
          setFoodPartners(foodData.partners || []);
          setShopPartners(shopData.partners || []);
          setMosques(mosqueData.mosques || []);
          setDataLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching map data:", error);
        });
    }
  }, [isOpen, dataLoaded]);

  return (
    <GameMapOverlay
      isOpen={isOpen}
      onClose={closeMap}
      foodPartners={foodPartners}
      shopPartners={shopPartners}
      mosques={mosques}
    />
  );
}

export function GameMapWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GameMapProvider>
      {children}
      <GameMapContent />
    </GameMapProvider>
  );
}
