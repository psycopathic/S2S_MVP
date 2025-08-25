import pool from "../db.js";

// Get data (clicks + conversions) for a specific affiliate
export const getAffiliateData = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid affiliate ID" });
  }

  try {
    const clicksResult = await pool.query(
      "SELECT * FROM clicks WHERE affiliate_id = $1 ORDER BY timestamp DESC",
      [id]
    );

    const conversionsResult = await pool.query(
      `SELECT c.* 
       FROM conversions c 
       JOIN clicks cl ON c.click_id = cl.click_id 
       WHERE cl.affiliate_id = $1
       ORDER BY c.timestamp DESC`,
      [id]
    );

    return res.status(200).json({
      clicks: clicksResult.rows,
      conversions: conversionsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching affiliate data:", err);
    return res.status(500).json({ error: "Failed to fetch affiliate data" });
  }
};

// Get all affiliates
export const getAllAffiliates = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM affiliates ORDER BY id ASC");
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching affiliates:", err);
    return res.status(500).json({ error: "Failed to fetch affiliates" });
  }
};

// Create a new affiliate (avoids duplicates)
export const createAffiliate = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Affiliate name is required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO affiliates (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [name.trim()]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating affiliate:", err);
    return res.status(500).json({ error: "Failed to create affiliate" });
  }
};
