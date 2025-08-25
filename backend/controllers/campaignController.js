import pool from "../db.js";

// Get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM campaigns ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new campaign (prevents duplicates)
export const createCampaign = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO campaigns (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
