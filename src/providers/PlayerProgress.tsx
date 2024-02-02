import React, { createContext, useContext, useEffect, useState } from 'react';
import { Station } from "../types/Station.ts";
import { useCookies } from 'react-cookie';
import Utils from "../utils/utils.ts";

type PlayerProgress = {
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

const PlayerProgressContext = createContext<PlayerProgress>({
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

type PlayerProgressProviderProps = {
  children: React.ReactNode;
};

export const PlayerProgressProvider: React.FC<PlayerProgressProviderProps> = ({children}) => {
  const [foundStations, setFoundStations] = useState<Station[]>([]);
  const [clickedStation, setClickedStation] = useState<Station | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [percentGlobal, setPercentGlobal] = useState<number>(0);
  const [cookies, setCookie, removeCookie] = useCookies(['foundStationsIds']);

  /**
   * Load stations from cookie on map load
   */
  useEffect(() => {
    const fetchedStations = mapLoaded ? Utils.fetchStationsFromIds(cookies.foundStationsIds) || [] : [];
    setFoundStations(fetchedStations);
  }, [mapLoaded]);

  /**
   * Add foundStation to cookie
   */
  useEffect(() => {
    if (foundStations.length)
      setCookie('foundStationsIds', foundStations.map(s => s.id), {path: '/'});
  }, [foundStations, setCookie]);

  /**
   * Update percentage on foundStations change
   */
  useEffect(() => {
    setPercentGlobal(Math.floor(100 * foundStations.length / Utils.totalNumberOfStations()));
  }, [foundStations]);

  const updateProgress = (station: Station) => {
    setFoundStations((prevStations) => [...prevStations, station]);
  };

  const updateClickedStation = (station?: Station) => {
    setClickedStation(station);
  }

  const updateMapLoaded = (state: boolean) => {
    setMapLoaded(state);
  }

  const percentForLine = (line: string) => {
    return Math.floor(100 * foundStations.filter(s => s.line === line).length
      / Utils.numberOfStationsForLine(line));
  }

  const resetProgress = () => {
    setFoundStations([]);
    setClickedStation(undefined);
    window.location.reload();
    removeCookie('foundStationsIds', {path: '/'});
  };

  return (
    <PlayerProgressContext.Provider
      value={{
        foundStations,
        clickedStation,
        mapLoaded,
        percentGlobal,
        percentForLine,
        updateProgress,
        updateClickedStation,
        updateMapLoaded,
        resetProgress
      }}>
      {children}
    </PlayerProgressContext.Provider>
  );
};

/**
 * Custom hook to access the player's progress
 */
export const usePlayerProgress = () => useContext(PlayerProgressContext);
