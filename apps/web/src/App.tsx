import { Routes, Route } from "react-router-dom";
import MatchesPage from "./pages/MatchesPage";
import MatchRoomPage from "./pages/MatchRoomPage";
import StorePage from "./pages/StorePage";
import PaySuccess from "./pages/paySuccess";
import OffSeasonPage from "./pages/OffSeasonPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MatchesPage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/matches/:id" element={<MatchRoomPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/paySuccess" element={<PaySuccess />} />
      <Route path="/offseason" element={<OffSeasonPage />} />
    </Routes>
  );
}

export default App;
