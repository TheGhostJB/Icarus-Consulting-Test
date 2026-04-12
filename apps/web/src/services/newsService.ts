export type NewsArticle = {
  url: string;
  title: string;
  urlToImage: string;
  description: string;
  publishedAt: string; 
};

type NewsApiResponse = {
  articles: NewsArticle[];
};

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_QUERY = "tennessee-titans"; // or import.meta.env.VITE_NEWS_QUERY ||
const NEWS_PAGE_SIZE = 20;
const NEWS_SORT = "publishedAt"

export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    throw new Error("Missing VITE_NEWS_API_KEY environment variable.");
  }

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", NEWS_QUERY);
  url.searchParams.set("apiKey", NEWS_API_KEY);
  url.searchParams.set("pageSize", String(NEWS_PAGE_SIZE));
  url.searchParams.set("sortBy", String(NEWS_SORT));

  const response = await fetch(url.toString());
  const data = (await response.json()) as NewsApiResponse & { message?: string };

  if (!response.ok) {
    throw new Error(data.message || `HTTP error ${response.status}`);
  }

  return data.articles;
}