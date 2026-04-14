import Navbar from "../components/layout/Navbar";
import CarouselHome from "../components/home/CarouselHome";
import NewsHome from "../components/home/NewsHome";
import CommunityHome from "../components/home/CommunityHome";
import { FaFire, FaNewspaper, FaTrophy, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/home.css";

function HomePage() {
  return (
    <div className="home-page">
      <main className="home-container">
        <Navbar />

        <CarouselHome />

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
          <div className="home-section-header">
            <div className="home-section-heading">
              <FaFire className="home-section-icon" aria-hidden="true" />
              <h1 className="home-title">Best Sellers</h1>
            </div>
            <Link to="/store" className="home-section-link">
              View more →<span aria-hidden="true"></span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
