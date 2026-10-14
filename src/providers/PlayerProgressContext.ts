import { createContext, useContext } from 'react';
import { Station } from "../types/Station.ts";

export type PlayerProgress = {
  foundStations: Station[];
  clickedStation?: Station;
  mapLoaded: boolean;
  percentGlobal: number;
  percentForLine: (line: string) => number;
  updateProgress: (station: Station) => void;
  updateClickedStation: (station?: Station) => void;
  updateMapLoaded: (state: boolean) => void;
  resetProgress: () => void;
};

export const PlayerProgressContext = createContext<PlayerProgress>({
  foundStations: [],
  clickedStation: undefined,
  mapLoaded: false,
  percentGlobal: 0,
  percentForLine: (): number => 0,
  updateProgress: (): void => { },
  updateClickedStation: (): void => { },
  updateMapLoaded: (): void => { },
  resetProgress: (): void => { },
});

/**
 * Custom hook to access the player's progress
 */
export const usePlayerProgress = () => useContext(PlayerProgressContext);
