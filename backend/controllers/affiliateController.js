import pool from "../db.js";

export const getAffiliateData = async (req, res) => {
  const { id } = req.params;

  try {
    const clicks = await pool.query(
      "SELECT * FROM clicks WHERE affiliate_id = $1",
      [id]
    );

    const conversions = await pool.query(
      `SELECT c.* FROM conversions c 
       JOIN clicks cl ON c.click_id = cl.click_id 
       WHERE cl.affiliate_id = $1`,
      [id]
    );

    res.json({ clicks: clicks.rows, conversions: conversions.rows });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ status: "error", message: "DB error", error: err.message });
  }
};
