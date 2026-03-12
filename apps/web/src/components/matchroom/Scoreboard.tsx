function Scoreboard() {
  return (
    <div className="scoreboard">
      <div className="team">
        <h2>Tennessee Titans</h2>
        <span>Home</span>
      </div>

      <div className="score">
        <div style={{ color: "red", fontWeight: "bold" }}>LIVE • Q3</div>
        <h1>17 - 14</h1>
        <p>13:55 Remaining</p>
      </div>

      <div className="team">
        <h2>Kansas City Chiefs</h2>
        <span>Away</span>
      </div>
    </div>
  );
}

export default Scoreboard;
