import { useEffect, useState } from "react";
import { Card, Link } from "@heroui/react";
import { getNewsArticles } from "../../services/newsService";

function formatPublishedDate(value) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function NewsCard() {
  const [newsData, setNewsData] = useState([
    {
      url: "",
      title: "",
      urlToImage: "",
      description: "",
      publishedAt: ""
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const articles = await getNewsArticles();

        if (isMounted) {
          setNewsData(articles);
        }
      } catch (err) {
        console.error("Error loading news:", err);

        if (isMounted) {
          setError("No se pudieron cargar las noticias.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-muted">Loading news...</p>;
  }

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
  }

  if (newsData.length === 0) {
    return <p className="text-sm text-muted">No news available right now.</p>;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {newsData.map((article, index) => (
        <a
          key={`${article.url}-${index}`}
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="block"
        >
          <Card className="h-full overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1">
            <img
              alt={article.title}
              className="block h-56 w-full rounded-t-2xl object-cover"
              loading="lazy"
              src={article.urlToImage || "https://placehold.co/800x450?text=News"}
            />

            <div className="flex h-full flex-col gap-3 px-4 py-4">
              <Card.Header className="gap-2 p-0">
                <Card.Description className="line-clamp-3">
                  {formatPublishedDate(article.publishedAt)}
                </Card.Description>
                <Card.Title className="line-clamp-2">{article.title}</Card.Title>
                <Card.Description className="line-clamp-3">
                  {article.description || "No description available."}
                </Card.Description>
              </Card.Header>

              <Card.Footer className="p-0">
                <Link
                  aria-label="Go to original source (opens in new tab)"
                  href={article.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-blue-500"
                >
                  Read More
                  <Link.Icon aria-hidden="true" />
                </Link>
              </Card.Footer>
            </div>
          </Card>
        </a>
      ))}
    </section>
  );
}

export default NewsCard;