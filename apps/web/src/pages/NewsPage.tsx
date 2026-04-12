import  NewsCard from "../components/news/NewsCard";
import Navbar from "../components/layout/Navbar";
import "../styles/news.css";
import NewsCardHorizontal from "../components/news/NewsCardHorizontal";

function NewsPage() {
  return (
    <div className="team-page">
        <main className="team-container">
        <Navbar />

        <section className="team-hero">
          <h1 className="team-hero-title">Noticias</h1>
        </section>

        {/* <NewsCardHorizontal/> */}

        <NewsCard/>
      </main>
    </div>
  );
}

export default NewsPage;