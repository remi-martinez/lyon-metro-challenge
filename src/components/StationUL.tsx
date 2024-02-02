import { Station } from "../types/Station.ts";
import StationItem from "./StationItem.tsx";

function StationUL(props: { stations: Station[]; }) {
  const {stations} = props;

  return (
    <ul>
      {stations.map((station) => <StationItem key={station.id} station={station}/>)}
    </ul>
  );
}

export default StationUL;
