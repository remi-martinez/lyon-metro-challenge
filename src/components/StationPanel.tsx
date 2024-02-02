import SearchBar from "./SearchBar.tsx";
import Settings from "./Settings.tsx";
import StationList from "./StationList.tsx";
import RadialProgress from "./RadialProgress.tsx";
import { usePlayerProgress } from "../providers/PlayerProgress.tsx";

function StationPanel() {


  const LINES = ['A', 'B', 'C', 'D', 'F1', 'F2'];
  const {percentGlobal} = usePlayerProgress();

  return (
    <div className="station-list-container text-left">
      <span className="h-1 w-full bg-red-600 block"></span>
      <header>
        <div className="inline-flex items-center">
          <img src="./metro.png" className="logo" alt="Metro logo"/>
          <h1 className="text-4xl font-bold">Lyon Metro Challenge</h1>
        </div>
        <RadialProgress percent={percentGlobal}/>
        <Settings/>
        <br/>
      </header>
      <SearchBar/>
      <div className="px-5 overflow-auto">
        <StationList className="overflow-auto" lines={LINES}/>
      </div>
    </div>
  )
}

export default StationPanel;
