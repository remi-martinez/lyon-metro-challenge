import { Station } from "../types/Station.ts";
import { usePlayerProgress } from "../providers/PlayerProgress.tsx";
import { useEffect, useRef } from "react";

function StationItem(props: { station: Station }) {

  const {station} = props;
  const {updateClickedStation} = usePlayerProgress();
  const liRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (liRef.current) {
      liRef.current.scrollIntoView({behavior: 'smooth', block: "end", inline: "nearest"});
    }
  }, []);

  return (
    <li ref={liRef} className="p-1 li-station" onClick={() => updateClickedStation(station)}>
      {station.name}
    </li>
  );
}

export default StationItem;
