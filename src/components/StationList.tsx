import Skeleton from "./Skeleton.tsx";
import NoStationFound from "./NoStationFound.tsx";
import { usePlayerProgress } from "../providers/PlayerProgress.tsx";
import StationUL from "./StationUL.tsx";
import PercentageBar from "./PercentageBar.tsx";

function StationList(props: { lines: string[], className?: string }) {
  const {lines, className} = props;
  const {foundStations, mapLoaded, percentForLine} = usePlayerProgress();

  return lines.map((line, index) => {
    const filteredStations = foundStations.filter(s => s.line === line);
    const sortedFilteredStations = filteredStations.sort((s1, s2) => s1.order - s2.order);

    return (
      <div key={index} className={`station-list-lines my-5 line-${line.toLowerCase()} ${className}`}>
        <img alt={`Metro Line ${line}`} src={`./lines/${line}.svg`}/>
        <PercentageBar percent={percentForLine(line)}/>
        <div className="my-3">
          {!mapLoaded ? <Skeleton/>
            : !sortedFilteredStations.length ? <NoStationFound/>
              : <StationUL stations={sortedFilteredStations}/>
          }
        </div>
      </div>);
  })
}

export default StationList;
