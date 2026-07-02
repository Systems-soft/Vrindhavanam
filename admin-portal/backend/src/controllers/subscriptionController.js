const db = require("../config/db");

// Create Subscription
exports.create = async (req, res) => {
  try {

    const {
      customer_id,
      product_id,
      variant_id,
      frequency,
      quantity,
      price,
      next_delivery
    } = req.body;

    const sql = `
      INSERT INTO subscriptions
      (
        customer_id,
        product_id,
        variant_id,
        frequency,
        quantity,
        price,
        next_delivery
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      customer_id,
      product_id,
      variant_id,
      frequency,
      quantity,
      price,
      next_delivery
    ]);

    res.json({
      success: true,
      subscriptionId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// Get all subscriptions
exports.getAll = async (req, res) => {

  try {

    const [rows] = await db.query("SELECT * FROM subscriptions");

    res.json(rows);

  } catch (err) {

    res.status(500).json(err);

  }

};