import pool from "../db.js";

export const handlePostback = async (req, res) => {
  const { affiliate_id, click_id, amount, currency } = req.query;
  if (!affiliate_id || !click_id || !amount || !currency) {
    return res.status(400).json({ status: "error", message: "Missing params" });
  }

  try {
    const click = await pool.query(
      "SELECT * FROM clicks WHERE click_id=$1 AND affiliate_id=$2",
      [click_id, affiliate_id]
    );

    if (click.rows.length === 0) {
      return res.status(404).json({ status: "error", message: "Invalid click_id" });
    }

    await pool.query(
      "INSERT INTO conversions (click_id, amount, currency) VALUES ($1, $2, $3)",
      [click_id, amount, currency]
    );

    res.json({ status: "success", message: "Conversion tracked" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "DB error", error: err.message });
  }
};
