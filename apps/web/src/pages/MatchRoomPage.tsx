import { useNavigate, useParams } from "react-router-dom";
import Scoreboard from "../components/matchroom/Scoreboard";
import FanChat from "../components/matchroom/FanChat";
import { TwitterFeed } from "../components/matchroom/TwitterFeed";
import "../styles/matchroom.css";

function MatchRoomPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const matchId = Number(id);

  return (
    <div className="match-room">
      <button
        type="button"
        onClick={() => navigate("/matches")}
        className="close-button"
        aria-label="Cerrar"
      >
        x
      </button>

      <Scoreboard />

      <div className="match-room-content">
        {Number.isFinite(matchId) ? (
          <FanChat matchId={matchId} />
        ) : (
          <div className="fan-chat">Partido no válido.</div>
        )}
        <TwitterFeed />
      </div>
    </div>
  );
}

export default MatchRoomPage;