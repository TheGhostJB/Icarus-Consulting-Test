const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 4003;

const pool = new Pool({
  connectionString: process.env.ROOMS_DB_URL,
});

async function getRoomIdByMatch(matchId) {
  const r = await pool.query(
    "SELECT room_id FROM chatrooms WHERE match_id = $1",
    [matchId]
  );
  return r.rows[0]?.room_id ?? null;
}

async function ensureRoom(matchId, userId) {
  const existing = await getRoomIdByMatch(matchId);
  if (existing != null) return existing;

  try {
    const ins = await pool.query(
      `INSERT INTO chatrooms (match_id, created_by, active_users_count)
       VALUES ($1, $2, 0)
       RETURNING room_id`,
      [matchId, userId]
    );
    return ins.rows[0].room_id;
  } catch (e) {
    if (e.code === "23505") {
      const again = await getRoomIdByMatch(matchId);
      if (again != null) return again;
    }
    throw e;
  }
}

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      service: "rooms-service",
      status: "ok",
      db: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      service: "rooms-service",
      status: "error",
      db: "disconnected",
      error: error.message,
    });
  }
});

app.post("/match/:matchId/bootstrap", async (req, res) => {
  const matchId = parseInt(req.params.matchId, 10);
  const userId = parseInt(req.body?.user_id, 10);
  if (!Number.isFinite(matchId) || !Number.isFinite(userId)) {
    return res.status(400).json({ error: "match_id y user_id numéricos requeridos" });
  }
  try {
    const roomId = await ensureRoom(matchId, userId);
    await pool.query(
      `INSERT INTO chatroom_members (room_id, user_id, status)
       VALUES ($1, $2, 'active')
       ON CONFLICT (room_id, user_id)
       DO UPDATE SET status = EXCLUDED.status`,
      [roomId, userId]
    );
    res.json({ room_id: roomId, match_id: matchId });
  } catch (error) {
    console.error("bootstrap", error);
    res.status(500).json({ error: error.message || "Error en bootstrap" });
  }
});

app.get("/match/:matchId/messages", async (req, res) => {
  const matchId = parseInt(req.params.matchId, 10);
  if (!Number.isFinite(matchId)) {
    return res.status(400).json({ error: "match_id inválido" });
  }
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
  try {
    const result = await pool.query(
      `SELECT m.id, m.room_id, m.user_id, m.content, m.sent_at
       FROM chat_messages m
       INNER JOIN chatrooms c ON c.room_id = m.room_id
       WHERE c.match_id = $1
       ORDER BY m.sent_at ASC, m.id ASC
       LIMIT $2`,
      [matchId, limit]
    );
    res.json({ messages: result.rows });
  } catch (error) {
    console.error("messages list", error);
    res.status(500).json({ error: error.message || "Error al listar mensajes" });
  }
});

app.post("/match/:matchId/messages", async (req, res) => {
  const matchId = parseInt(req.params.matchId, 10);
  const userId = parseInt(req.body?.user_id, 10);
  const content = (req.body?.content || "").trim().slice(0, 500);

  if (!Number.isFinite(matchId) || !Number.isFinite(userId)) {
    return res.status(400).json({ error: "match_id y user_id requeridos" });
  }
  if (!content) {
    return res.status(400).json({ error: "content requerido" });
  }

  try {
    const roomId = await getRoomIdByMatch(matchId);
    if (roomId == null) {
      return res.status(404).json({
        error: "Sala no encontrada. Llama primero a POST .../bootstrap",
      });
    }

    const ins = await pool.query(
      `INSERT INTO chat_messages (room_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, room_id, user_id, content, sent_at`,
      [roomId, userId, content]
    );
    res.status(201).json({ message: ins.rows[0] });
  } catch (error) {
    console.error("messages insert", error);
    res.status(500).json({ error: error.message || "Error al enviar mensaje" });
  }
});

app.listen(PORT, () => {
  console.log(`rooms-service listening on port ${PORT}`);
});