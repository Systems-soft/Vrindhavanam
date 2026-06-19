const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        b.id,
        b.batch_number,
        b.processing_status,
        b.packaging_date,
        b.quantity_kg,
        b.created_at,
        h.crop_type,
        h.yield_kg
      FROM batches b
      JOIN harvests h
      ON b.harvest_id = h.id
      ORDER BY b.id DESC
    `);

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch batches"
    });

  }
});

module.exports = router;