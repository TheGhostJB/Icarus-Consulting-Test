import { Link, useLocation } from "react-router-dom";

const styles: Record<string, React.CSSProperties> = {
  navbar: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px 16px 0 0",
    padding: "20px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },
  logoCircle: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    backgroundColor: "#0B2A55",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    border: "2px solid #d62839",
  },
  brand: {
    color: "#0B2A55",
    fontSize: "28px",
    marginRight: "20px",
  },
  links: {
    display: "flex",
    gap: "18px",
    color: "#374151",
    fontSize: "16px",
    flexWrap: "wrap",
  },
  activeLink: {
    fontWeight: "bold",
    color: "#0B2A55",
  },
  normalLink: {
    color: "#374151",
    textDecoration: "none",
  },
  loginButton: {
    backgroundColor: "#0B2A55",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "15px",
  },
};

function Navbar() {
  const location = useLocation();

  const isMatches = location.pathname === "/" || location.pathname.startsWith("/matches");
  const isOffSeason = location.pathname.startsWith("/offseason");

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <div style={styles.logoCircle}>TC</div>
        <h2 style={styles.brand}>TITANS CREW</h2>

        <div style={styles.links}>
          <span>Home</span>
          <Link to="/matches" style={isMatches ? styles.activeLink : styles.normalLink}>
            Matches
          </Link>
          <span>Team</span>
          <span>Community</span>
          <span>History</span>
          <span>Store</span>
          <span>News</span>
          <Link to="/offseason" style={isOffSeason ? styles.activeLink : styles.normalLink}>
            Off-Season
          </Link>
        </div>
      </div>

      <button style={styles.loginButton}>Login / Sign Up</button>
    </nav>
  );
}

export default Navbar;
