import { Routes, Route } from "react-router-dom";
import MatchesPage from "./pages/MatchesPage";
import MatchRoomPage from "./pages/MatchRoomPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MatchesPage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/matches/:id" element={<MatchRoomPage />} />
    </Routes>
  );
}

export default App;