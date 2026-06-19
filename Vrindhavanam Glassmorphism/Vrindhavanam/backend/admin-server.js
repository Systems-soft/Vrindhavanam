const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");
const pool = require("./config/db");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/products/:product", (req, res) => {
  try {
    const product = req.params.product;

const filePath = path.join(
  __dirname,
  "..",
  `${product}.xlsx`
);

   console.log("Excel path:", filePath);

const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});

app.get("/api/variants/:product", (req, res) => {
  try {
    const product = req.params.product;

    const filePath = path.join(
      __dirname,
      "..",
      `${product}.xlsx`
    );

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    const variants = [
      ...new Map(
        rows.map(item => [
          item.variety_name,
          {
            variety_name: item.variety_name,
            stock_status: item.stock_status
          }
        ])
      ).values()
    ];

    res.json(variants);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});
app.post("/api/customers", async (req, res) => {
  try {

    const {
      first_name,
      last_name,
      email,
      phone,
      address
    } = req.body;

    // Check existing customer

    const [existing] = await pool.query(
      `
      SELECT id
      FROM customers
      WHERE email = ?
      `,
      [email]
    );

    if (existing.length > 0) {

      return res.json({
        success: true,
        customer_id: existing[0].id
      });

    }

    // Create new customer

    const [result] = await pool.query(
      `
      INSERT INTO customers
      (
        first_name,
        last_name,
        email,
        phone,
        address
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        first_name,
        last_name,
        email,
        phone,
        address
      ]
    );

    res.json({
      success: true,
      customer_id: result.insertId
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});
app.post("/api/orders", async (req, res) => {

  try {

    const {
      customer_id,
      total_amount,
      items
    } = req.body;

    // Save order

    const [orderResult] = await pool.query(
      `
      INSERT INTO orders
      (
        customer_id,
        total_amount,
        status
      )
      VALUES (?, ?, ?)
      `,
      [
        customer_id,
        total_amount,
        "Pending"
      ]
    );

    const orderId = orderResult.insertId;

    // Save products

    if (Array.isArray(items)) {

      for (const item of items) {

        await pool.query(
          `
          INSERT INTO order_items
          (
            order_id,
            product_name,
            quantity,
            unit_price
          )
          VALUES (?, ?, ?, ?)
          `,
          [
            orderId,
            item.product_name,
            item.quantity,
            item.unit_price
          ]
        );

      }

    }

    res.json({
      success: true,
      order_id: orderId
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});
app.get("/api/admin/orders", async (req, res) => {
  try {

    const [orders] = await pool.query(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.placed_at,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.address
      FROM orders o
      JOIN customers c
      ON o.customer_id = c.id
      ORDER BY o.id DESC
    `);

    res.json(orders);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});
app.get("/api/admin/orders/:id/items", async (req, res) => {

  try {

    const orderId = req.params.id;

    const [items] = await pool.query(
      `
      SELECT *
      FROM order_items
      WHERE order_id = ?
      `,
      [orderId]
    );

    res.json(items);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});
app.put("/api/admin/orders/:id/status", async (req, res) => {

  try {

    const orderId = req.params.id;
    const { status } = req.body;

    await pool.query(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, orderId]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});
app.get("/api/admin/dashboard/stats", async (req, res) => {
  try {

    const [[orders]] = await pool.query(`
      SELECT COUNT(*) AS totalOrders
      FROM orders
    `);

    const [[customers]] = await pool.query(`
      SELECT COUNT(*) AS totalCustomers
      FROM customers
    `);

    const [[revenue]] = await pool.query(`
      SELECT IFNULL(SUM(total_amount),0) AS totalRevenue
      FROM orders
    `);

    res.json({
      data: {
        totalOrders: orders.totalOrders,
        totalCustomers: customers.totalCustomers,
        totalRevenue: revenue.totalRevenue
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});
app.get("/api/admin/dashboard/charts", async (req, res) => {
  try {

    const [ordersByStatus] = await pool.query(`
      SELECT
        status,
        COUNT(*) AS count
      FROM orders
      GROUP BY status
    `);

    res.json({
      data: {
        ordersByStatus
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});
app.get("/api/admin/customers", async (req, res) => {

  try {

    const [customers] = await pool.query(`
  SELECT
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    c.phone,
    c.created_at,
    COUNT(o.id) AS orders_count
  FROM customers c
  LEFT JOIN orders o
    ON o.customer_id = c.id
  GROUP BY c.id
  ORDER BY c.id DESC;
`);

    res.json(customers);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});
app.get("/api/admin/customers/:id", async (req, res) => {

  try {

    const customerId = req.params.id;

    const [[customer]] = await pool.query(`
      SELECT *
      FROM customers
      WHERE id = ?
    `,[customerId]);

    const [orders] = await pool.query(`
      SELECT
        id,
        total_amount,
        status,
        placed_at
      FROM orders
      WHERE customer_id = ?
      ORDER BY id DESC
    `,[customerId]);

    res.json({
      customer,
      orders
    });

  } catch(err){

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});
app.get("/api/admin/products", async (req, res) => {

  try {

    const [products] = await pool.query(`
      SELECT *
      FROM products
      ORDER BY id DESC
    `);

    res.json(products);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.get("/api/admin/inventory", async (req, res) => {

  try {

    const [inventory] = await pool.query(`
      SELECT
        id,
        product_name,
        variety_name,
        grade,
        stock_quantity,
        stock_status,
        price
      FROM products
      ORDER BY id DESC
    `);

    res.json(inventory);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});
app.put("/api/admin/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const {
      product_name,
      price,
      stock_quantity,
      stock_status
    } = req.body;

    await pool.query(
      `
      UPDATE products
      SET
        product_name = ?,
        price = ?,
        stock_quantity = ?,
        stock_status = ?
      WHERE id = ?
      `,
      [
        product_name,
        price,
        stock_quantity,
        stock_status,
        productId
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});
app.post("/api/admin/products", async (req, res) => {

  try {

    const {
  product_name,
  variety_name,
  weight,
  price,
  stock_quantity,
  stock_status
} = req.body;
    const [result] = await pool.query(
      `
      INSERT INTO products
(
 product_name,
 variety_name,
 weight,
 price,
 stock_quantity,
 stock_status
)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
  product_name,
  variety_name,
  weight,
  price,
  stock_quantity,
  stock_status
]
    );

    res.json({
      success: true,
      id: result.insertId
    });

  } catch(err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.get("/api/admin/harvests", async (req, res) => {

  try {

    const [harvests] = await pool.query(`
      SELECT *
      FROM harvests
      ORDER BY harvest_date DESC
    `);

    res.json(harvests);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.post("/api/admin/harvests", async (req, res) => {

  try {

    const {
      crop_type,
      harvest_date,
      yield_kg,
      quality_grade,
      status
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO harvests
      (
        crop_type,
        harvest_date,
        yield_kg,
        quality_grade,
        status
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        crop_type,
        harvest_date,
        yield_kg,
        quality_grade,
        status
      ]
    );

    res.json({
      success: true,
      id: result.insertId
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.put("/api/admin/harvests/:id", async (req, res) => {

  try {

    const harvestId = req.params.id;

    const {
      crop_type,
      harvest_date,
      yield_kg,
      quality_grade,
      status
    } = req.body;

    await pool.query(
      `
      UPDATE harvests
      SET
        crop_type=?,
        harvest_date=?,
        yield_kg=?,
        quality_grade=?,
        status=?
      WHERE id=?
      `,
      [
        crop_type,
        harvest_date,
        yield_kg,
        quality_grade,
        status,
        harvestId
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.delete("/api/admin/harvests/:id", async (req, res) => {

  try {

    const harvestId = req.params.id;

    await pool.query(
      `
      DELETE FROM harvests
      WHERE id=?
      `,
      [harvestId]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.get("/api/admin/batches", async (req, res) => {
  try {

    const [batches] = await pool.query(`
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

    res.json(batches);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});

app.post("/api/admin/batches", async (req, res) => {

  try {

    const {
      harvest_id,
      batch_number,
      processing_status,
      packaging_date,
      quantity_kg
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO batches
      (
        harvest_id,
        batch_number,
        processing_status,
        packaging_date,
        quantity_kg
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        harvest_id,
        batch_number,
        processing_status,
        packaging_date,
        quantity_kg
      ]
    );

    res.json({
      success: true,
      id: result.insertId
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.put("/api/admin/batches/:id", async (req, res) => {
  const { id } = req.params;

  const {
    batch_number,
    harvest_id,
    quantity_kg,
    packaging_date,
    processing_status
  } = req.body;

  try {
    await pool.query(
      `
      UPDATE batches
      SET
        batch_number = ?,
        harvest_id = ?,
        quantity_kg = ?,
        packaging_date = ?,
        processing_status = ?
      WHERE id = ?
      `,
      [
        batch_number,
        harvest_id,
        quantity_kg,
        packaging_date,
        processing_status,
        id
      ]
    );

    res.json({
      message: "Batch updated successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to update batch"
    });
  }
});

app.delete("/api/admin/batches/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM batches WHERE id = ?",
      [req.params.id]
    );

    res.json({
      message: "Batch deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete batch"
    });
  }
});
app.listen(5005, () => {
console.log("Products API running on port 5005");
});

