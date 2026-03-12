import { Routes, Route } from "react-router-dom";
import MatchesPage from "./pages/MatchesPage";
import MatchRoomPage from "./pages/MatchRoomPage";
import StorePage from "./pages/StorePage";
import PaySuccess from "./pages/paySuccess";
import OffSeasonPage from "./pages/OffSeasonPage";
import TeamPage from "./pages/TeamPage";
import VoiceAgent from "./components/VoiceAgent/VoiceAgent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MatchesPage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/matches/:id" element={<MatchRoomPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/paySuccess" element={<PaySuccess />} />
      <Route path="/offseason" element={<OffSeasonPage />} />
      <Route path="/voice-agent" element={<VoiceAgent />} />
    </Routes>
  );
}

export default App;
