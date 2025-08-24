import pool from "../db.js";

export const trackClick = async (req, res) => {
  const { affiliate_id, campaign_id, click_id } = req.query;

  if (!affiliate_id || !campaign_id || !click_id) {
    return res.status(400).json({ status: "error", message: "Missing params" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO clicks (affiliate_id, campaign_id, click_id) VALUES ($1, $2, $3) RETURNING *`,
      [affiliate_id, campaign_id, click_id]
    );
    res.json({ status: "success", message: "Click tracked", click: result.rows[0] });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ status: "error", message: "DB error", error: err.message });
  }
};
