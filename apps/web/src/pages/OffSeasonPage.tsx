import type { CSSProperties } from "react";
import Navbar from "../components/layout/Navbar";
import UnityGameCard from "../components/unity/UnityGameCard";
import "../styles/unity.css";

function OffSeasonPage() {
  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <Navbar />

        <section style={styles.hero}>
          <h1 style={styles.title}>OFFSEASON</h1>
        </section>

        <UnityGameCard
          unityConfig={{
            loaderUrl: "/Build/BuildPrototipo.loader.js",
            dataUrl: "/Build/BuildPrototipo.data.br",
            frameworkUrl: "/Build/BuildPrototipo.framework.js.br",
            codeUrl: "/Build/BuildPrototipo.wasm.br",
          }}
        />
      </main>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F4F5F7",
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
    marginBottom: "36px",
  },
  title: {
    margin: 0,
    fontSize: "58px",
    fontWeight: 900,
    lineHeight: 1.05,
  },
};

export default OffSeasonPage;
