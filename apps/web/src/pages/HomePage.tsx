import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import CarouselHome from "../components/home/CarouselHome";
import MatchesCard from "../components/home/MatchesCard";
import NewsHome from "../components/home/NewsHome";
import CommunityHome from "../components/home/CommunityHome";
import ClassicMatchCard from "../components/history/ClassicMatchCard";
import { FaFire, FaNewspaper, FaTrophy, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getClassicMatches } from "../services/historyService";
import type { ClassicMatch } from "../types/history";
import "../styles/home.css";
import bestSellers from "../assets/home/bestSellers.png";

function HomePage() {
  const [classicMatches, setClassicMatches] = useState<ClassicMatch[]>([]);
  const [classicMatchesLoading, setClassicMatchesLoading] = useState(true);
  const [classicMatchesError, setClassicMatchesError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadClassicMatches() {
      try {
        setClassicMatchesLoading(true);
        setClassicMatchesError("");

        const matches = await getClassicMatches();

        if (isMounted) {
          setClassicMatches(matches.slice(0, 4));
        }
      } catch (error) {
        console.error("Error loading classic matches:", error);

        if (isMounted) {
          setClassicMatchesError("No classic matches available.");
        }
      } finally {
        if (isMounted) {
          setClassicMatchesLoading(false);
        }
      }
    }

    void loadClassicMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      <main className="home-container">
        <Navbar />

        <CarouselHome />

        <MatchesCard/>

        <section className="home-section">
          <div className="home-section-header">
            <div className="home-section-heading">
              <FaNewspaper className="home-section-icon" aria-hidden="true" />
              <h1 className="home-title">Trending News</h1>
            </div>
            <Link to="/news" className="home-section-link">
              View more →<span aria-hidden="true"></span>
            </Link>
          </div>
        </section>
        <NewsHome/>

        <section className="home-section">
          <div className="home-section-header">
            <div className="home-section-heading">
              <FaUsers className="home-section-icon" aria-hidden="true" />
              <h1 className="home-title">Community</h1>
            </div>
            <Link to="/community" className="home-section-link">
              View more → <span aria-hidden="true"></span>
            </Link>
          </div>
        </section>
        <section className="home-section">
            <CommunityHome
                name="TitanFan2024"
                comment="Can't wait for the next game! Who else is predicting a win?"
                likes={234}
                comments={45}
                avatarLetter="T"
            />
            <CommunityHome
                name="TitanFan2024"
                comment="Can't wait for the next game! Who else is predicting a win?"
                likes={234}
                comments={45}
                avatarLetter="T"
            />
            <CommunityHome
                name="TitanFan2024"
                comment="Can't wait for the next game! Who else is predicting a win?"
                likes={234}
                comments={45}
                avatarLetter="T"
            />
        </section>
        
        <section className="home-section">
          <div className="home-section-header">
            <div className="home-section-heading">
              <FaTrophy className="home-section-icon" aria-hidden="true" />
              <h1 className="home-title">Top Highlights</h1>
            </div>
            <Link to="/history" className="home-section-link">
              View more →<span aria-hidden="true"></span>
            </Link>
          </div>
        </section>
        <section className="home-section">
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {!classicMatchesLoading && classicMatches.length === 0 && !classicMatchesError ? (
              <article className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-2">
                No classic matches available.
              </article>
            ) : null}

            {classicMatchesError ? (
              <article className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-2">
                {classicMatchesError}
              </article>
            ) : null}

            {classicMatches.map((match) => (
              <ClassicMatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-header">
            <div className="home-section-heading">
              <FaFire className="home-section-icon" aria-hidden="true" />
              <h1 className="home-title">Best Sellers</h1>
            </div>
            <Link to="/store" className="home-section-link">
              View more →<span aria-hidden="true"></span>
            </Link>
          </div>
          <img
            src={bestSellers}
            alt="Best sellers"
            className="home-section-image"
          />
        </section>
      </main>
    </div>
  );
}

export default HomePage;
