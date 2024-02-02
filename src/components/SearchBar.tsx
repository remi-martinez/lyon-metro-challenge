import { usePlayerProgress } from "../providers/PlayerProgress.tsx";
import React, { useRef, useState } from "react";
import { Station } from "../types/Station.ts";
import levenshtein from 'js-levenshtein';
import party from 'party-js';
import Utils from "../utils/utils.ts";

function SearchBar() {

  const {foundStations, updateProgress, updateClickedStation} = usePlayerProgress();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [lastSavedValue, setLastSavedValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [alreadyFound, setAlreadyFound] = useState(false);

  const {mapLoaded} = usePlayerProgress();
  const stations = Utils.mapJsonIntoStations();

  const stationMatch = (input: string): Station[] => {
    const THRESHOLD = 3;
    const found: Station[] = stations.filter(station => {
      const stationName = station.name.replace(/-/g, "").toLowerCase();
      const stationShortname = station.shortname.replace(/-/g, "").toLowerCase();
      const inputFormatted = input.replace(/-/g, "").toLowerCase();
      return levenshtein(stationName, inputFormatted) < THRESHOLD
        || levenshtein(stationShortname, inputFormatted) < THRESHOLD
    });

    const uniqueIds = new Set<number>();
    return found.filter(station => {
      if (foundStations.some(foundStation => foundStation.id === station.id)) { // Already found
        setAlreadyFound(true);
        setTimeout(() => {
          setAlreadyFound(false);
        }, 1800);
        return false;
      }
      if (!uniqueIds.has(station.id)) { // Station doubles
        uniqueIds.add(station.id);
        return true;
      }
      return false;
    });
  }

  const handleGuess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLastSavedValue(inputValue);
    setInputValue('');

    const matches = stationMatch(inputValue);
    if (matches.length > 0) {
      party.sparkles(inputRef.current!, {
        count: party.variation.range(10, 20),
        size: party.variation.range(0.4, 0.8),
      });

      setGuessed(true);
      setTimeout(() => {
        setGuessed(false);
      }, 850);

      updateClickedStation(undefined);
      matches.forEach(matchedStation => {
        updateProgress({
          id: matchedStation.id,
          name: matchedStation.name,
          shortname: matchedStation.shortname,
          line: matchedStation.line,
          order: matchedStation.order,
          coordinates: matchedStation.coordinates
        });
      })
    } else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
      }, 850);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      setInputValue(lastSavedValue);
    }
  }

  const AlreadyFoundBadge = () => {
    return <span
      className={`${alreadyFound ? 'already-found' : 'opacity-0'}  bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 float-left mb-2`}>
            Déjà trouvé
        </span>
  }

  return (
    <form className="px-5 mb-4" onSubmit={e => handleGuess(e)}>
      {AlreadyFoundBadge()}
      <input type="text" placeholder="Entrer une station"
             ref={inputRef}
             value={inputValue}
             style={{opacity: mapLoaded ? 1 : 0.5}}
             disabled={!mapLoaded}
             autoFocus={true} autoCorrect="off" spellCheck="false" autoComplete="off"
             className={`${wrong ? 'wrong-guess' : ''} ${guessed ? 'good-guess' : ''} searchBar pl-2 bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 `}
             onKeyDown={handleKeyDown}
             onChange={e => setInputValue(e.target.value)}
      />
    </form>
  )
}

export default SearchBar;
