import { NavLink, useNavigate } from "react-router-dom";
import { SignOutButton } from "../auth/Signout";
import { Auth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { session } = Auth();

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <div style={styles.logoCircle}>TC</div>
        <h2 style={styles.brand}>TITANS CREW</h2>

        <div style={styles.links}>
          <NavLink to="/" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Home</NavLink>
          <NavLink to="/matches" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Matches</NavLink>
          <NavLink to="/team" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Team</NavLink>
          <NavLink to="/community" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Community</NavLink>
          <NavLink to="/history" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>History</NavLink>
          <NavLink to="/store" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Store</NavLink>
          <NavLink to="/news" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>News</NavLink>
          <NavLink to="/offseason" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Off-Season</NavLink>
          <NavLink to="/voice-agent" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>Voice Agent</NavLink>
        </div>
      </div>
      <div className="gap-12">
        <button style={styles.loginButton} onClick={() => navigate("/signup")}>Login / Sign Up</button>
        {session ? <SignOutButton /> : <></>}
      </div>
    </nav>
  );
}

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
  link: {},
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
