import { useState, type CSSProperties } from "react";
import Navbar from "../components/layout/Navbar";
import UnityGameCard from "../components/unity/UnityGameCard";
import WordleGame from "../components/wordle/WordleGame";
import "../styles/unity.css";

function OffSeasonPage() {
  const [activeTab, setActiveTab] = useState<"unity" | "wordle">("unity");

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <Navbar />

        <section style={styles.hero}>
          <h1 style={styles.title}>OFFSEASON</h1>
        </section>

        <section className="offseason-tabs-shell">
          <div className="offseason-tabs-nav" role="tablist" aria-label="Offseason games">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "unity"}
              className={`offseason-tab-button ${
                activeTab === "unity" ? "offseason-tab-button-active" : ""
              }`}
              onClick={() => setActiveTab("unity")}
            >
              Unity
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "wordle"}
              className={`offseason-tab-button ${
                activeTab === "wordle" ? "offseason-tab-button-active" : ""
              }`}
              onClick={() => setActiveTab("wordle")}
            >
              Wordle
            </button>
          </div>

          <div className="offseason-tab-panel" role="tabpanel">
            {activeTab === "unity" ? (
              <UnityGameCard
                unityConfig={{
                  loaderUrl: "/Build/BuildPrototipo.loader.js",
                  dataUrl: "/Build/BuildPrototipo.data.br",
                  frameworkUrl: "/Build/BuildPrototipo.framework.js.br",
                  codeUrl: "/Build/BuildPrototipo.wasm.br",
                }}
              />
            ) : null}

            {activeTab === "wordle" ? <WordleGame /> : null}
          </div>
        </section>
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
