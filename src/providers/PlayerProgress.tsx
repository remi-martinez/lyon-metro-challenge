import React, { useCallback, useEffect, useState } from 'react';
import { Station } from "../types/Station.ts";
import { useCookies } from 'react-cookie';
import Utils from "../utils/utils.ts";
import { PlayerProgressContext } from "./PlayerProgressContext.ts";

const COOKIE_OPTIONS = {path: '/', sameSite: 'strict', secure: window.location.protocol === 'https:'} as const;

type PlayerProgressProviderProps = {
  children: React.ReactNode;
};

export const PlayerProgressProvider: React.FC<PlayerProgressProviderProps> = ({children}) => {
  const [foundStations, setFoundStations] = useState<Station[]>([]);
  const [clickedStation, setClickedStation] = useState<Station | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [percentGlobal, setPercentGlobal] = useState<number>(0);
  const [cookies, setCookie, removeCookie] = useCookies(['foundStationsIds']);
  // Snapshot of the saved progress, so later cookie writes don't re-trigger the initial load
  const [savedStationsIds] = useState<string[]>(() => cookies.foundStationsIds);

  /**
   * Load stations from cookie on map load
   */
  useEffect(() => {
    const fetchedStations = mapLoaded ? Utils.fetchStationsFromIds(savedStationsIds) || [] : [];
    setFoundStations(fetchedStations);
  }, [mapLoaded, savedStationsIds]);

  /**
   * Add foundStation to cookie
   */
  useEffect(() => {
    if (foundStations.length)
      setCookie('foundStationsIds', foundStations.map(s => s.id), COOKIE_OPTIONS);
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

  const updateMapLoaded = useCallback((state: boolean) => {
    setMapLoaded(state);
  }, []);

  const percentForLine = (line: string) => {
    return Math.floor(100 * foundStations.filter(s => s.line === line).length
      / Utils.numberOfStationsForLine(line));
  }

  const resetProgress = () => {
    setFoundStations([]);
    setClickedStation(undefined);
    window.location.reload();
    removeCookie('foundStationsIds', COOKIE_OPTIONS);
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
