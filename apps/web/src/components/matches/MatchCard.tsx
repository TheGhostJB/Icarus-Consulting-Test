import { useNavigate } from "react-router-dom";
import type { MatchCardModel } from "../../types";

interface MatchCardProps {
  match: MatchCardModel;
}

function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();
  const isLive = match.status === "LIVE";
  const isFinished = match.status === "FINISHED";

  function openMatch(): void {
    navigate(`/matches/${match.id}`);
  }

  let badgeColor = "#0B2A55";
  let topBorder = "#60A5FA";
  let resultColor = "#2563EB";

  if (isLive) {
    badgeColor = "#E56B86";
    topBorder = "#E11D48";
    resultColor = "#E11D48";
  }

  if (isFinished) {
    badgeColor = "#9CA3AF";
    topBorder = "#D1D5DB";
    resultColor = "#0B2A55";
  }

  return (
    <div className="match-card" onClick={openMatch}>
      <div style={{ ...styles.card, borderTop: `4px solid ${topBorder}` }}>
        <div style={styles.cardHeader}>
          <span style={{ ...styles.badge, backgroundColor: badgeColor }}>
            {match.status}
          </span>
          <span style={styles.date}>{match.date}</span>
        </div>

        <div style={styles.section}>
          <p style={styles.label}>OPPONENT</p>
          <div style={styles.opponentRow}>
            <h3 style={styles.opponent}>{match.opponent}</h3>
            <div style={styles.vsCircle}>VS</div>
          </div>
        </div>

        <div style={styles.section}>
          <p style={styles.label}>{match.resultLabel}</p>
          <p style={{ ...styles.result, color: resultColor }}>{match.resultValue}</p>
        </div>

        <div style={styles.footer}>
          <span>{match.venue}</span>
          <span>{">"}</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  badge: {
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    padding: "8px 14px",
    borderRadius: "6px",
  },
  date: {
    color: "#9CA3AF",
    fontSize: "14px",
  },
  section: {
    marginBottom: "24px",
  },
  label: {
    fontSize: "13px",
    color: "#9CA3AF",
    marginBottom: "10px",
  },
  opponentRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },
  opponent: {
    fontSize: "24px",
    color: "#0B2A55",
  },
  vsCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#60A5FA",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  result: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "18px",
    color: "#9CA3AF",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px",
  },
};

export default MatchCard;
