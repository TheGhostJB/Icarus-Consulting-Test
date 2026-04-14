import { Routes, Route } from "react-router-dom";
import MatchesPage from "./pages/MatchesPage";
import MatchRoomPage from "./pages/MatchRoomPage";
import StorePage from "./pages/StorePage";
import PaySuccess from "./pages/paySuccess";
import OffSeasonPage from "./pages/OffSeasonPage";
import TeamPage from "./pages/TeamPage";
import HistoryPage from "./pages/HistoryPage";
import VoiceAgent from "./components/VoiceAgent/VoiceAgent";
import PrivateRoute from "./components/auth/privateRoute";
import NewsPage from "./pages/NewsPage";
import HomePage from "./pages/HomePage";
import CommunityPage from "./pages/CommunityPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/matches/:id" element={<MatchRoomPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/paySuccess" element={<PaySuccess />} />
      <Route path="/offseason" element={<OffSeasonPage />} />
      <Route path="/voice-agent" element={<VoiceAgent />} />
      <Route path="/news" element={<NewsPage />} />
    </Routes>
  );
}

export default App;
