const express = require("express");
const {
  DEFAULT_TEAM_SLUG,
  getClassicMatchesByPageId,
  getHeroByPageId,
  getHistoryPageContext,
  getHistoryPageData,
  getHistoryStatsByPageId,
  getLegendaryPlayersByPageId,
  getTimelineEventsByPageId,
} = require("./historyRepository");
const { pool } = require("./db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4008;

function resolveTeamSlug(req) {
  return req.params.teamSlug || req.query.teamSlug || DEFAULT_TEAM_SLUG;
}

function buildDatabaseError(error) {
  if (error.code === "42501") {
    return "Database permission denied for history-service user";
  }

  return error.message;
}

function asyncHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error("history-service error:", error);
      res.status(500).json({
        status: "error",
        error: buildDatabaseError(error),
      });
    }
  };
}

app.get("/", (req, res) => {
  res.json({
    service: "history-service",
    status: "ok",
    endpoints: [
      "/health",
      "/hero",
      "/history/hero",
      "/stats",
      "/history/stats",
      "/timeline",
      "/history/timeline",
      "/players",
      "/history/players",
      "/matches",
      "/history/matches",
      "/history-page/:teamSlug",
      "/overview",
    ],
  });
});

app.get("/health", asyncHandler(async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      service: "history-service",
      status: "ok",
      db: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      service: "history-service",
      status: "error",
      db: "disconnected",
      error: error.message,
    });
  }
}));

app.get(["/hero", "/history/hero"], asyncHandler(async (req, res) => {
  const page = await getHistoryPageContext(resolveTeamSlug(req));

  if (!page) {
    return res.status(404).json({
      status: "error",
      error: "History page not found",
    });
  }

  const hero = await getHeroByPageId(page.page_id);
  res.json(hero);
}));

app.get(["/stats", "/history/stats"], asyncHandler(async (req, res) => {
  const page = await getHistoryPageContext(resolveTeamSlug(req));

  if (!page) {
    return res.status(404).json({
      status: "error",
      error: "History page not found",
    });
  }

  const historyStats = await getHistoryStatsByPageId(page.page_id);
  res.json(historyStats);
}));

app.get(["/timeline", "/history/timeline"], asyncHandler(async (req, res) => {
  const page = await getHistoryPageContext(resolveTeamSlug(req));

  if (!page) {
    return res.status(404).json({
      status: "error",
      error: "History page not found",
    });
  }

  const timelineEvents = await getTimelineEventsByPageId(page.page_id);
  res.json(timelineEvents);
}));

app.get(["/players", "/history/players"], asyncHandler(async (req, res) => {
  const page = await getHistoryPageContext(resolveTeamSlug(req));

  if (!page) {
    return res.status(404).json({
      status: "error",
      error: "History page not found",
    });
  }

  const legendaryPlayers = await getLegendaryPlayersByPageId(page.page_id);
  res.json(legendaryPlayers);
}));

app.get(["/matches", "/history/matches"], asyncHandler(async (req, res) => {
  const page = await getHistoryPageContext(resolveTeamSlug(req));

  if (!page) {
    return res.status(404).json({
      status: "error",
      error: "History page not found",
    });
  }

  const classicMatches = await getClassicMatchesByPageId(page.page_id);
  res.json(classicMatches);
}));

app.get(
  ["/history-page/:teamSlug?", "/overview", "/history/overview"],
  asyncHandler(async (req, res) => {
    const historyPage = await getHistoryPageData(resolveTeamSlug(req));

    if (!historyPage) {
      return res.status(404).json({
        status: "error",
        error: "History page not found",
      });
    }

    res.json(historyPage);
  }),
);

app.listen(PORT, () => {
  console.log(`history-service listening on port ${PORT}`);
});
