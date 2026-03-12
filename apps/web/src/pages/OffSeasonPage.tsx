import { useState } from 'react'
import Navbar from "../components/layout/Navbar"
import { UnityGameCard } from '../components/unity/UnityGameCard'
import type { CSSProperties } from 'react'

type OffSeasonTab = 'unity' | 'word'

const unityBuildConfig = {
  useRealBuild: true,
  loaderUrl: '/Build/BuildPrototipo2.loader.js',
  dataUrl: '/Build/BuildPrototipo2.data',
  frameworkUrl: '/Build/BuildPrototipo2.framework.js',
  codeUrl: '/Build/BuildPrototipo2.wasm',
}

function OffSeasonPage() {
  const [activeTab, setActiveTab] = useState<OffSeasonTab>('unity')

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <Navbar />

        <section style={styles.hero}>
          <div>
            <h1 style={styles.heroTitle}>OFFSEASON HUB</h1>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>OFFSEASON GAMES</h2>

          <div style={styles.tabsRow}>
            <button
              type="button"
              onClick={() => setActiveTab('unity')}
              style={activeTab === 'unity' ? styles.activeTabButton : styles.tabButton}
            >
              UNITY
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('word')}
              style={activeTab === 'word' ? styles.activeTabButton : styles.tabButton}
            >
              WORDLE
            </button>
          </div>

          <div style={styles.contentWrap}>
            {activeTab === 'unity' ? <UnityGameCard unityConfig={unityBuildConfig} /> : <div style={styles.pendingBox}>Wordle se implementara despues.</div>}
          </div>
        </section>
      </main>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f5f7",
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
    marginBottom: "26px",
  },
  heroTitle: {
    fontSize: "58px",
    fontWeight: 900,
    marginBottom: "10px",
    marginTop: 0,
    letterSpacing: "0.02em",
  },
  card: {
    borderRadius: "24px",
    border: "1px solid #d8dee5",
    backgroundColor: "#fff",
    padding: "28px",
    boxShadow: "0 8px 16px rgba(15, 23, 42, 0.08)",
  },
  sectionTitle: {
    margin: "0 0 8px 0",
    textAlign: "center",
    fontSize: "34px",
    fontWeight: 900,
    letterSpacing: "0.04em",
    color: "#002244",
  },
  tabsRow: {
    marginTop: "14px",
    paddingBottom: "14px",
    borderBottom: "1px solid #d8dee5",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  tabButton: {
    border: "none",
    borderRadius: "999px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    backgroundColor: "#e8edf3",
    color: "#002244",
  },
  activeTabButton: {
    border: "none",
    borderRadius: "999px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    backgroundColor: "#002244",
    color: "#fff",
  },
  contentWrap: {
    marginTop: "16px",
  },
  pendingBox: {
    border: "1px dashed #c8d1db",
    borderRadius: "12px",
    padding: "28px",
    textAlign: "center",
    color: "#4f6173",
    backgroundColor: "#f8fafc",
    fontWeight: 600,
  },
}

export default OffSeasonPage
