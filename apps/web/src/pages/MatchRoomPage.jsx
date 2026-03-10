import Scoreboard from "../components/matchroom/Scoreboard";
import FanChat from "../components/matchroom/FanChat";
import "../styles/matchroom.css";
import { useParams } from "react-router-dom";

function MatchRoomPage() {
  const { id } = useParams();

  return (
    <div className="match-room">

      <Scoreboard />

      <div className="match-room-content">
        <FanChat />

        <div className="interaction-panel">
          <h3>Live Interactions</h3>
          <p>Polls, predictions, reactions will appear here.</p>
        </div>
      </div>

    </div>
  );
}

export default MatchRoomPage;