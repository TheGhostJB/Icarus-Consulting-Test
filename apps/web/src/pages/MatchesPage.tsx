import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import MatchCard from "../components/matches/MatchCard";
import { getMatches } from "../services/matchesService";
import { getProfile } from "../services/profileService";
import type { Match, ApiMatch, Profile } from "../types";

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${first}${last}`;
}

function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    async function loadPageData() {
      try {
        setLoading(true);
        setError("");
        setProfileError("");

        const [matchesResult, profileResult] = await Promise.allSettled([
          getMatches(),
          getProfile(1),
        ]);

        if (matchesResult.status === "fulfilled") {
          const mappedMatches = matchesResult.value.map(mapMatchToCardModel);
          setMatches(mappedMatches);
        } else {
          console.error("Error loading matches:", matchesResult.reason);
          setError("Could not load matches.");
        }

        if (profileResult.status === "fulfilled") {
          setProfile(profileResult.value);
        } else {
          console.error("Error loading profile:", profileResult.reason);
          setProfileError("Could not load profile.");
        }
      } catch (err) {
        console.error("Error loading page data:", err);
        setError("Could not load matches.");
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, []);

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <Navbar />

        <section style={styles.hero}>
          <div>
            <h1 style={styles.title}>MATCH CALENDAR</h1>
            <p style={styles.subtitle}>
              Full season schedule and real-time match room access.
            </p>

            <div style={styles.statsRow}>
              <div>
                <span style={styles.statNumber}>{matches.length}</span>
                <span style={styles.statText}>Games This Season</span>
              </div>

              <div>
                <span style={styles.statNumber}>
                  {matches.filter((match) => match.status === "UPCOMING").length}
                </span>
                <span style={styles.statText}>Upcoming Matches</span>
              </div>
            </div>
          </div>

          <div style={styles.filters}>
            <button style={styles.filterButton}>2026 Season</button>
            <button style={styles.filterButton}>All Venues</button>
          </div>
        </section>

        {loading && <p style={styles.message}>Loading matches...</p>}

        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && matches.length === 0 && (
          <p style={styles.message}>No matches available.</p>
        )}

        {!loading && !error && matches.length > 0 && (
          <section style={styles.grid}>
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </section>
        )}

        <div style={styles.bottomButtonContainer}>
          <button style={styles.bottomButton}>View Past Seasons</button>
        </div>
      </main>
    </div>
  );
}

function mapMatchToCardModel(match: ApiMatch): Match {
  const opponent = getOpponentName(match);

  return {
    id: match.match_id,
    status: getMatchStatus(match),
    opponent,
    date: formatMatchDate(match.start_time),
    venue: buildVenueText(match),
    resultLabel: getResultLabel(match),
    resultValue: getResultValue(match),
  };
}

function getOpponentName(match: ApiMatch): string {
  const isTitansHome = match.home_team === "Tennessee Titans";
  const isTitansAway = match.away_team === "Tennessee Titans";

  if (isTitansHome) {
    return simplifyTeamName(match.away_team);
  }

  if (isTitansAway) {
    return simplifyTeamName(match.home_team);
  }

  return simplifyTeamName(match.away_team || match.home_team || "TBD");
}

function simplifyTeamName(teamName?: string): string {
  if (!teamName) {
    return "TBD";
  }

  return teamName
    .replace("Tennessee Titans", "Titans")
    .replace("Houston Texans", "Texans")
    .replace("Indianapolis Colts", "Colts")
    .replace("Jacksonville Jaguars", "Jaguars")
    .replace("Kansas City Chiefs", "Chiefs")
    .replace("Buffalo Bills", "Bills")
    .replace("Miami Dolphins", "Dolphins");
}

function buildVenueText(match: ApiMatch): string {
  if (match.venue_name && match.venue_city) {
    return `${match.venue_name}, ${match.venue_city}`;
  }

  if (match.venue_name) {
    return match.venue_name;
  }

  return "Venue TBD";
}

function getMatchStatus(match: ApiMatch): "LIVE" | "FINISHED" | "UPCOMING" {
  const status = String(match.status || "").toLowerCase();

  if (
    status.includes("live") ||
    status.includes("in_progress") ||
    status.includes("in progress")
  ) {
    return "LIVE";
  }

  if (
    status.includes("final") ||
    status.includes("finished") ||
    status.includes("completed")
  ) {
    return "FINISHED";
  }

  if (status.includes("scheduled")) {
    return "UPCOMING";
  }

  if (!match.start_time) {
    return "UPCOMING";
  }

  const now = new Date();
  const start = new Date(match.start_time);

  if (start > now) {
    return "UPCOMING";
  }

  return "FINISHED";
}

function getResultLabel(match: ApiMatch): string {
  const status = getMatchStatus(match);

  if (status === "LIVE") {
    return "CURRENT SCORE";
  }

  if (status === "FINISHED") {
    return "RESULT";
  }

  return "COUNTDOWN";
}

function getResultValue(match: ApiMatch): string {
  const status = getMatchStatus(match);

  if (status === "LIVE" || status === "FINISHED") {
    const homeScore = match.home_score ?? 0;
    const awayScore = match.away_score ?? 0;
    return `${homeScore}-${awayScore}`;
  }

  if (!match.start_time) {
    return "Date TBD";
  }

  return getCountdownText(match.start_time);
}

function getCountdownText(startTime: string): string {
  const now = new Date();
  const start = new Date(startTime);
  const diffMs = start.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Starting soon";
  }

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days === 1) {
    return "Starts in 1 day";
  }

  return `Starts in ${days} days`;
}

function formatMatchDate(dateString?: string): string {
  if (!dateString) {
    return "Date TBD";
  }

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F4F5F7",
  },
  topHeader: {
    backgroundColor: "#1E1E1E",
    color: "#94A3B8",
    fontSize: "22px",
    padding: "18px 24px",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px",
  },
  hero: {
    background: "linear-gradient(90deg, #0B2A55 0%, #1D4E89 50%, #60A5FA 100%)",
    borderRadius: "28px",
    padding: "42px 40px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    flexWrap: "wrap",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
    marginBottom: "28px",
  },
  title: {
    fontSize: "58px",
    fontWeight: "900",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "24px",
    marginBottom: "22px",
    color: "#E5EEF9",
  },
  statsRow: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "900",
    marginRight: "10px",
  },
  statText: {
    fontSize: "18px",
    color: "#E5EEF9",
  },
  filters: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  filterButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "18px",
    padding: "18px 24px",
    fontSize: "20px",
    cursor: "pointer",
    minWidth: "180px",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "28px",
    marginBottom: "32px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
    border: "1px solid #E2E8F0",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "24px",
  },
  avatarCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0B2A55 0%, #2563EB 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "800",
  },
  profileTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0F172A",
    margin: 0,
  },
  profileUsername: {
    fontSize: "18px",
    color: "#64748B",
    margin: "6px 0 0 0",
  },
  profileDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  profileItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: "18px",
    padding: "16px",
    border: "1px solid #E2E8F0",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  profileLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  profileValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0F172A",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },
  bottomButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "34px",
  },
  bottomButton: {
    backgroundColor: "white",
    color: "#0B2A55",
    border: "2px solid #0B2A55",
    borderRadius: "999px",
    padding: "16px 28px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
  },
  message: {
    fontSize: "18px",
    color: "#475569",
    marginBottom: "20px",
  },
  error: {
    fontSize: "18px",
    color: "#DC2626",
    marginBottom: "20px",
  },
};

export default MatchesPage;
