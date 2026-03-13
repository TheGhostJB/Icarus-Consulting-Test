import Navbar from "../components/layout/Navbar";
import TeamCardsDemo from "../components/team/TeamCardsDemo";
import "../styles/team.css";

function TeamPage() {
  return (
    <div className="team-page">
      <main className="team-container">
        <Navbar />

        <section className="team-hero">
          <h1 className="team-hero-title">TEAM</h1>
        </section>

        <TeamCardsDemo />
      </main>
    </div>
  );
}

export default TeamPage;
