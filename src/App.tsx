import './App.css'
import MapBase from "./components/MapBase.tsx";
import StationPanel from "./components/StationPanel.tsx";
import { PlayerProgressProvider } from "./providers/PlayerProgress.tsx";
import VictoryModal from "./components/VictoryModal.tsx";

function App() {
  return (
    <PlayerProgressProvider>
      <main className="main-container flex justify-between h-screen">
        <VictoryModal/>
        <MapBase/>
        <StationPanel/>
      </main>
    </PlayerProgressProvider>
  )
}

export default App
