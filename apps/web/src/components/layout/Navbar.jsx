import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <div style={styles.logoCircle}>TC</div>
        <h2 style={styles.brand}>TITANS CREW</h2>

        <div style={styles.links}>
          <NavLink to="/" style={styles.link} activeStyle={styles.activeLink}>Home</NavLink>
          <NavLink to="/matches" style={styles.link} activeStyle={styles.activeLink}>Matches</NavLink>
          <NavLink to="/team" style={styles.link} activeStyle={styles.activeLink}>Team</NavLink>
          <NavLink to="/community" style={styles.link} activeStyle={styles.activeLink}>Community</NavLink>
          <NavLink to="/history" style={styles.link} activeStyle={styles.activeLink}>History</NavLink>
          <NavLink to="/store" style={styles.link} activeStyle={styles.activeLink}>Store</NavLink>
          <NavLink to="/news" style={styles.link} activeStyle={styles.activeLink}>News</NavLink>
          <NavLink to="/offseason" style={styles.link} activeStyle={styles.activeLink}>Off-Season</NavLink>
        </div>
      </div>

      <button style={styles.loginButton}>Login / Sign Up</button>
    </nav>
  );
}

const styles = {
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

export default Navbar;