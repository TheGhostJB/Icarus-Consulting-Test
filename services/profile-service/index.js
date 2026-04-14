const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4003;

const pool = new Pool({
  connectionString: process.env.PROFILE_DB_URL
});

// Helper temporal para obtener el user_id.
// Más adelante esto saldrá del token JWT.
function getUserIdFromRequest(req) {
  return req.query.user_id || req.headers["x-user-id"];
}

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      service: "profile-service",
      status: "ok",
      db: "connected",
      time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      service: "profile-service",
      status: "error",
      db: "disconnected",
      error: error.message
    });
  }
});

// Debug temporal: lista perfiles
app.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        account_id,
        user_id,
        first_name,
        last_name,
        username,
        country,
        avatar_url,
        created_at,
        updated_at
      FROM accounts
      ORDER BY account_id
      LIMIT 10
    `);

    res.json({
      status: "success",
      profiles: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Endpoint principal del perfil actual
app.get("/me", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "user_id is required for now (query param or x-user-id header)"
      });
    }

    const result = await pool.query(`
      SELECT
        account_id,
        user_id,
        first_name,
        last_name,
        username,
        country,
        avatar_url,
        created_at,
        updated_at
      FROM accounts
      WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    res.json({
      status: "success",
      profile: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Actualizar perfil actual
app.put("/me", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "user_id is required for now (query param or x-user-id header)"
      });
    }

    const {
      first_name,
      last_name,
      username,
      country,
      avatar_url
    } = req.body;

    const result = await pool.query(`
      UPDATE accounts
      SET
        first_name = $1,
        last_name = $2,
        username = $3,
        country = $4,
        avatar_url = $5,
        updated_at = NOW()
      WHERE user_id = $6
      RETURNING
        account_id,
        user_id,
        first_name,
        last_name,
        username,
        country,
        avatar_url,
        created_at,
        updated_at
    `, [
      first_name ?? null,
      last_name ?? null,
      username ?? null,
      country ?? null,
      avatar_url ?? null,
      userId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    res.json({
      status: "success",
      profile: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        status: "error",
        message: "Username already exists"
      });
    }

    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Obtener direcciones del usuario actual
app.get("/me/addresses", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "user_id is required for now (query param or x-user-id header)"
      });
    }

    const result = await pool.query(`
      SELECT
        address_id,
        user_id,
        label,
        street_line_1,
        street_line_2,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at,
        updated_at
      FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, address_id ASC
    `, [userId]);

    res.json({
      status: "success",
      addresses: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Crear dirección para el usuario actual
app.post("/me/addresses", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "user_id is required for now (query param or x-user-id header)"
      });
    }

    const {
      label,
      street_line_1,
      street_line_2,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    if (!street_line_1 || !city || !state || !postal_code || !country) {
      return res.status(400).json({
        status: "error",
        message: "street_line_1, city, state, postal_code and country are required"
      });
    }

    if (is_default === true) {
      await pool.query(`
        UPDATE addresses
        SET is_default = false, updated_at = NOW()
        WHERE user_id = $1
      `, [userId]);
    }

    const result = await pool.query(`
      INSERT INTO addresses (
        user_id,
        label,
        street_line_1,
        street_line_2,
        city,
        state,
        postal_code,
        country,
        is_default
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        address_id,
        user_id,
        label,
        street_line_1,
        street_line_2,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at,
        updated_at
    `, [
      userId,
      label ?? null,
      street_line_1,
      street_line_2 ?? null,
      city,
      state,
      postal_code,
      country,
      is_default ?? false
    ]);

    res.status(201).json({
      status: "success",
      address: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Actualizar una dirección del usuario actual
app.put("/me/addresses/:addressId", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "user_id is required for now (query param or x-user-id header)"
      });
    }

    const { addressId } = req.params;
    const {
      label,
      street_line_1,
      street_line_2,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    const existingAddress = await pool.query(`
      SELECT address_id
      FROM addresses
      WHERE address_id = $1 AND user_id = $2
    `, [addressId, userId]);

    if (existingAddress.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Address not found"
      });
    }

    if (is_default === true) {
      await pool.query(`
        UPDATE addresses
        SET is_default = false, updated_at = NOW()
        WHERE user_id = $1 AND address_id <> $2
      `, [userId, addressId]);
    }

    const result = await pool.query(`
      UPDATE addresses
      SET
        label = $1,
        street_line_1 = $2,
        street_line_2 = $3,
        city = $4,
        state = $5,
        postal_code = $6,
        country = $7,
        is_default = $8,
        updated_at = NOW()
      WHERE address_id = $9 AND user_id = $10
      RETURNING
        address_id,
        user_id,
        label,
        street_line_1,
        street_line_2,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at,
        updated_at
    `, [
      label ?? null,
      street_line_1 ?? null,
      street_line_2 ?? null,
      city ?? null,
      state ?? null,
      postal_code ?? null,
      country ?? null,
      is_default ?? false,
      addressId,
      userId
    ]);

    res.json({
      status: "success",
      address: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Eliminar una dirección del usuario actual
app.delete("/me/addresses/:addressId", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "user_id is required for now (query param or x-user-id header)"
      });
    }

    const { addressId } = req.params;

    const result = await pool.query(`
      DELETE FROM addresses
      WHERE address_id = $1 AND user_id = $2
      RETURNING address_id, user_id
    `, [addressId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Address not found"
      });
    }

    res.json({
      status: "success",
      message: "Address deleted successfully",
      address: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Obtener badges del usuario actual
app.get("/me/badges", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "user_id is required for now (query param or x-user-id header)"
      });
    }

    const result = await pool.query(`
      SELECT
        b.badge_id,
        b.name,
        b.description,
        b.icon_url,
        b.type,
        b.created_at,
        ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.badge_id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC
    `, [userId]);

    res.json({
      status: "success",
      badges: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Temporal para pruebas directas por id
app.get("/account/:accountId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        account_id,
        user_id,
        first_name,
        last_name,
        username,
        country,
        avatar_url,
        created_at,
        updated_at
      FROM accounts
      WHERE account_id = $1
    `, [req.params.accountId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    res.json({
      status: "success",
      profile: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Temporal para pruebas directas por id
app.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        account_id,
        user_id,
        first_name,
        last_name,
        username,
        country,
        avatar_url,
        created_at,
        updated_at
      FROM accounts
      WHERE user_id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    res.json({
      status: "success",
      profile: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

//
app.post("/new/user", async (req, res) => {
  try {
    const {
      user_id, 
      country,
      first_name, 
      last_name, 
      username,
      avatar_url 
    } = req.body;

    if (!user_id || !first_name) {
      return res.status(400).json({
        status: "error",
        message: "user_id, first_name are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO accounts (
        user_id,
        country, 
        first_name, 
        last_name, 
        username, 
        avatar_url
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        account_id,
        user_id,
        country, 
        first_name, 
        last_name, 
        username, 
        avatar_url
    `, [
      user_id,
      country, 
      first_name, 
      last_name, 
      username, 
      avatar_url
    ]);

    res.status(201).json({
      status: "success",
      new_user: result.rows[0]}); 
    } catch(error) {
      res.status(500).json({
        status: "error",
        error: error.message 
      });
    }
});

app.listen(PORT, () => {
  console.log(`profile-service running on port ${PORT}`);
});
