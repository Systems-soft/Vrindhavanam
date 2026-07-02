const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");
const pool = require("./config/db");
const app = express();
const multer = require("multer");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

const adminAuthRoutes = require("./routes/adminAuthRoutes");
app.use("/api/auth", adminAuthRoutes);
app.use(
 "/uploads",
 express.static(
  path.join(__dirname,"uploads")
 )
);

async function logActivity(
 userId,
 action,
 details
){

 await pool.query(
  `
  INSERT INTO activity_logs
  (
   user_id,
   action,
   details
  )
  VALUES
  (?,?,?)
  `,
  [
   userId,
   action,
   JSON.stringify(details)
  ]
 );

}

app.get("/api/products/:product", (req, res) => {
  try {
    const product = req.params.product;

const filePath = path.join(
  __dirname,
  "..",
  `${product}.xlsx`
);

console.log("PRODUCT REQUESTED:", product);
 console.log("FINAL PATH:", filePath);

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
const storage = multer.diskStorage({

 destination:(req,file,cb)=>{
  cb(null,"uploads/");
 },

 filename:(req,file,cb)=>{
  cb(
   null,
   Date.now() + "-" + file.originalname
  );
 }

});

const upload = multer({
 storage
});

app.get("/api/variants/:product", (req, res) => {
  try {
    const product = req.params.product;

    const filePath = path.join(
      __dirname,
      "..",
      `${product}.xlsx`
    );

    console.log("PRODUCT REQUESTED:", product);
     console.log("FINAL PATH:", filePath);
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

     console.log("Excel columns:", Object.keys(rows[0]));

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
      VALUES (?, ?, ?, ?, ?, ?)
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

    let formattedDate = harvest_date;
    if (harvest_date && harvest_date.includes('T')) {
      formattedDate = harvest_date.split('T')[0];
    }

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
        formattedDate,
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

    let formattedDate = harvest_date;
    if (harvest_date && harvest_date.includes('T')) {
      formattedDate = harvest_date.split('T')[0];
    }

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
        formattedDate,
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

app.get("/api/admin/quality-grades", async (req, res) => {
  try {

    const [grades] = await pool.query(`
      SELECT
        q.id,
        q.grade,
        q.moisture_level,
        q.remarks,
        q.created_at,
        b.batch_number
      FROM quality_grades q
      JOIN batches b
      ON q.batch_id = b.id
      ORDER BY q.id DESC
    `);

    res.json(grades);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});

app.post("/api/admin/quality-grades", async (req, res) => {

  try {

    const {
      batch_id,
      grade,
      moisture_level,
      remarks
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO quality_grades
      (
        batch_id,
        grade,
        moisture_level,
        remarks
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        batch_id,
        grade,
        moisture_level,
        remarks
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

app.put("/api/admin/quality-grades/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      batch_id,
      grade,
      moisture_level,
      remarks
    } = req.body;

    await pool.query(
      `
      UPDATE quality_grades
      SET
        batch_id=?,
        grade=?,
        moisture_level=?,
        remarks=?
      WHERE id=?
      `,
      [
        batch_id,
        grade,
        moisture_level,
        remarks,
        id
      ]
    );

    res.json({
      success: true
    });

  } catch(err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.delete("/api/admin/quality-grades/:id", async (req, res) => {

  try {

    await pool.query(
      `
      DELETE FROM quality_grades
      WHERE id=?
      `,
      [req.params.id]
    );

    res.json({
      success: true
    });

  } catch(err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.get("/api/admin/batch-dropdown", async (req, res) => {

  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        batch_number
      FROM batches
      ORDER BY batch_number
    `);

    res.json(rows);

  } catch(err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.get("/api/admin/whatsapp-messages", async (req,res)=>{

  const [rows] = await pool.query(`
    SELECT *
    FROM whatsapp_messages
    ORDER BY id DESC
  `);

  res.json(rows);

});

app.post("/api/admin/whatsapp-messages", async (req,res)=>{

  const {
    recipient_name,
    phone_number,
    message
  } = req.body;

  const [result] = await pool.query(
    `
    INSERT INTO whatsapp_messages
    (
      recipient_name,
      phone_number,
      message
    )
    VALUES (?,?,?)
    `,
    [
      recipient_name,
      phone_number,
      message
    ]
  );

  res.json({
    success:true,
    id:result.insertId
  });

});

app.delete(
"/api/admin/whatsapp-messages/:id",
async (req,res)=>{

 await pool.query(
  `
  DELETE FROM whatsapp_messages
  WHERE id=?
  `,
  [req.params.id]
 );

 res.json({
  success:true
 });

});
app.get(
"/api/admin/stock-alerts",
async (req,res)=>{

 const [rows] = await pool.query(`
   SELECT *
   FROM stock_alerts
   ORDER BY id DESC
 `);

 res.json(rows);

});

app.post(
"/api/admin/stock-alerts",
async (req,res)=>{

 const {
  product_name,
  current_stock,
  minimum_stock
 } = req.body;

 let status = "Normal";

 if(current_stock <= 0){

   status = "Out of Stock";

 }
 else if(
   current_stock < minimum_stock
 ){

   status = "Low Stock";

 }

 const [result] = await pool.query(
 `
 INSERT INTO stock_alerts
 (
  product_name,
  current_stock,
  minimum_stock,
  status
 )
 VALUES (?,?,?,?)
 `,
 [
  product_name,
  current_stock,
  minimum_stock,
  status
 ]
 );

 res.json({
  success:true
 });

});

app.delete(
"/api/admin/stock-alerts/:id",
async (req,res)=>{

 await pool.query(
 `
 DELETE FROM stock_alerts
 WHERE id=?
 `,
 [req.params.id]
 );

 res.json({
  success:true
 });

});

app.get(
"/api/admin/reviews",
async(req,res)=>{

 const [rows] = await pool.query(`
   SELECT *
   FROM reviews
   ORDER BY id DESC
 `);

 res.json(rows);

});

app.post(
"/api/admin/reviews",
async(req,res)=>{

 const {

  customer_name,
  product_name,
  rating,
  review_text

 } = req.body;

 await pool.query(
 `
 INSERT INTO reviews
 (
  customer_name,
  product_name,
  rating,
  review_text
 )
 VALUES (?,?,?,?)
 `,
 [
  customer_name,
  product_name,
  rating,
  review_text
 ]
 );

 res.json({
  success:true
 });

});

app.delete(
"/api/admin/reviews/:id",
async(req,res)=>{

 await pool.query(
 `
 DELETE FROM reviews
 WHERE id=?
 `,
 [req.params.id]
 );

 res.json({
  success:true
 });

});

app.put(
"/api/admin/reviews/:id/approve",
async(req,res)=>{

 await pool.query(
 `
 UPDATE reviews
 SET status='Approved'
 WHERE id=?
 `,
 [req.params.id]
 );

 res.json({
  success:true
 });

});

app.put(
"/api/admin/reviews/:id/reject",
async(req,res)=>{

 await pool.query(
 `
 UPDATE reviews
 SET status='Rejected'
 WHERE id=?
 `,
 [req.params.id]
 );

 res.json({
  success:true
 });

});

app.get(
"/api/admin/support-tickets",
async(req,res)=>{

 const [rows] = await pool.query(`
   SELECT *
   FROM support_tickets
   ORDER BY id DESC
 `);

 res.json(rows);

});

app.post(
"/api/admin/support-tickets",
async(req,res)=>{

 const {

  customer_name,
  email,
  phone,
  subject,
  message

 } = req.body;

 await pool.query(
 `
 INSERT INTO support_tickets
 (
  customer_name,
  email,
  phone,
  subject,
  message
 )
 VALUES (?,?,?,?,?)
 `,
 [
  customer_name,
  email,
  phone,
  subject,
  message
 ]
 );

 res.json({
  success:true
 });

});

app.delete(
"/api/admin/support-tickets/:id",
async(req,res)=>{

 await pool.query(
 `
 DELETE FROM support_tickets
 WHERE id=?
 `,
 [req.params.id]
 );

 res.json({
  success:true
 });

});

app.put(
"/api/admin/support-tickets/:id/status",
async(req,res)=>{

 const { status } = req.body;

 await pool.query(
 `
 UPDATE support_tickets
 SET status=?
 WHERE id=?
 `,
 [
  status,
  req.params.id
 ]
 );

 res.json({
  success:true
 });

});

app.get(
 "/api/admin/contact-forms",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT *
   FROM contact_forms
   ORDER BY id DESC
  `);

  res.json(rows);

 }
);

app.post(
 "/api/admin/contact-forms",
 async(req,res)=>{

  const {
   name,
   email,
   phone,
   subject,
   message
  } = req.body;

  const [result] =
  await pool.query(

   `
   INSERT INTO contact_forms
   (
    name,
    email,
    phone,
    subject,
    message
   )
   VALUES (?,?,?,?,?)
   `,

   [
    name,
    email,
    phone,
    subject,
    message
   ]

  );

  res.json({
   success:true,
   id:result.insertId
  });

 }
);

app.delete(
 "/api/admin/contact-forms/:id",
 async(req,res)=>{

  await pool.query(
   `
   DELETE FROM contact_forms
   WHERE id=?
   `,
   [req.params.id]
  );

  res.json({
   success:true
  });

 }
);

app.put(
 "/api/admin/contact-forms/:id/resolve",
 async(req,res)=>{

  await pool.query(
   `
   UPDATE contact_forms
   SET status='Replied'
   WHERE id=?
   `,
   [req.params.id]
  );

  res.json({
   success:true
  });

 }
);

app.get("/api/logs", async (req,res) => {

  const [rows] = await pool.query(`
    SELECT *
    FROM activity_logs
    ORDER BY id DESC
    LIMIT 5
  `);

  res.json({
    data: rows
  });

});

app.get(
 "/api/admin/coupons",
 async(req,res)=>{

  const [rows] =
  await pool.query(`
   SELECT *
   FROM coupons
   ORDER BY id DESC
  `);

  res.json(rows);

 }
);

app.post(
 "/api/admin/coupons",
 async(req,res)=>{

  const {

   code,
   discount_type,
   discount_value,
   minimum_order_amount,
   usage_limit,
   expiry_date

  } = req.body;

  await pool.query(

   `
   INSERT INTO coupons
   (
    code,
    discount_type,
    discount_value,
    minimum_order_amount,
    usage_limit,
    expiry_date
   )
   VALUES (?,?,?,?,?,?)
   `,

   [
    code,
    discount_type,
    discount_value,
    minimum_order_amount,
    usage_limit,
    expiry_date
   ]

  );

  res.json({
   success:true
  });

 }
);

app.delete(
 "/api/admin/coupons/:id",
 async(req,res)=>{

  await pool.query(

   `
   DELETE FROM coupons
   WHERE id=?
   `,

   [req.params.id]

  );

  res.json({
   success:true
  });

 }
);
app.get(
  "/api/admin/shipping",
  async(req,res)=>{

    const [rows] = await pool.query(`
      SELECT *
      FROM shipping_methods
      ORDER BY id DESC
    `);

    res.json(rows);

  }
);

app.post(
  "/api/admin/shipping",
  async(req,res)=>{

    const {
      method_name,
      delivery_zone,
      shipping_charge,
      estimated_days
    } = req.body;

    await pool.query(
      `
      INSERT INTO shipping_methods
      (
        method_name,
        delivery_zone,
        shipping_charge,
        estimated_days
      )
      VALUES (?,?,?,?)
      `,
      [
        method_name,
        delivery_zone,
        shipping_charge,
        estimated_days
      ]
    );

    res.json({
      success:true
    });

  }
);

app.delete(
  "/api/admin/shipping/:id",
  async(req,res)=>{

    await pool.query(
      `
      DELETE FROM shipping_methods
      WHERE id=?
      `,
      [req.params.id]
    );

    res.json({
      success:true
    });

  }
);

app.put(
  "/api/admin/shipping/:id/activate",
  async(req,res)=>{

    await pool.query(
      `
      UPDATE shipping_methods
      SET status='Active'
      WHERE id=?
      `,
      [req.params.id]
    );

    app.put(
  "/api/admin/shipping/:id/deactivate",
  async(req,res)=>{

    await pool.query(
      `
      UPDATE shipping_methods
      SET status='Inactive'
      WHERE id=?
      `,
      [req.params.id]
    );

    res.json({
      success:true
    });

  }
);

    res.json({
      success:true
    });

  }
);


app.get(
 "/api/admin/analytics",
 async(req,res)=>{

  const [[orders]] = await pool.query(`
   SELECT COUNT(*) AS total_orders
   FROM orders
  `);

  const [[customers]] = await pool.query(`
   SELECT COUNT(*) AS total_customers
   FROM customers
  `);

  const [[products]] = await pool.query(`
   SELECT COUNT(*) AS total_products
   FROM products
  `);

  const [[revenue]] = await pool.query(`
   SELECT IFNULL(SUM(total_amount),0)
   AS total_revenue
   FROM orders
  `);

  const [[stats]] = await pool.query(`
SELECT
 COUNT(*) AS total_orders,

 SUM(CASE WHEN status='Pending'
  THEN 1 ELSE 0 END)
 AS pending_orders,

 SUM(CASE WHEN status='Delivered'
  THEN 1 ELSE 0 END)
 AS delivered_orders,

 SUM(CASE WHEN status='Cancelled'
  THEN 1 ELSE 0 END)
 AS cancelled_orders,

 IFNULL(SUM(total_amount),0)
 AS total_revenue
FROM orders
`);
  res.json({
   total_orders: orders.total_orders,
   total_customers: customers.total_customers,
   total_products: products.total_products,
   total_revenue: revenue.total_revenue
  });

 }
);

app.get(
 "/api/admin/analytics/customer-growth",
 async(req,res)=>{
  const [rows] = await pool.query(`
 SELECT
  MONTH(created_at) AS month,
  COUNT(*) AS customers
 FROM customers
 GROUP BY MONTH(created_at)
 ORDER BY MONTH(created_at)
`);

  res.json(rows);
 }
);

app.get(
 "/api/admin/analytics/customer-growth-percent",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT COUNT(*) AS customers
   FROM customers
   GROUP BY MONTH(created_at)
   ORDER BY MONTH(created_at) DESC
   LIMIT 2
  `);

  if(rows.length < 2){
   return res.json({growth:0});
  }

  const current = rows[0].customers;
  const previous = rows[1].customers;

  const growth =
   previous === 0
   ? 100
   : (((current-previous)/previous)*100)
      .toFixed(2);

  res.json({growth});
 }
);

app.get(
 "/api/admin/order/:id",
 async(req,res)=>{

  const [rows] = await pool.query(
   "SELECT * FROM orders WHERE id=?",
   [req.params.id]
  );

  if(rows.length===0){
   return res.status(404).json({
    message:"Order not found"
   });
  }

  res.json(rows[0]);
 }
);
app.get(
 "/api/admin/analytics/revenue-growth",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT
    SUM(total_amount) AS revenue
   FROM orders
   GROUP BY MONTH(placed_at)
   ORDER BY MONTH(placed_at) DESC
   LIMIT 2
  `);

  if(rows.length < 2){
   return res.json({growth:0});
  }

  const current = rows[0].revenue;
  const previous = rows[1].revenue;

  const growth =
   previous === 0
   ? 100
   : (((current-previous)/previous)*100)
      .toFixed(2);

  res.json({growth});
 }
);

app.get(
 "/api/admin/analytics/top-customers",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT
    CONCAT(
      c.first_name,
      ' ',
      c.last_name
    ) AS customer_name,

    COUNT(o.id) AS orders,

    SUM(o.total_amount) AS revenue

   FROM orders o

   JOIN customers c
   ON o.customer_id = c.id

   GROUP BY c.id

   ORDER BY revenue DESC

   LIMIT 10
  `);

  res.json(rows);

 }
);

app.get(
 "/api/admin/analytics/low-stock",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT
    id,
    product_name,
    stock_quantity
   FROM products
   WHERE stock_quantity < 10
   ORDER BY stock_quantity ASC
  `);

  res.json(rows);
 }
);
app.get(
 "/api/admin/analytics/monthly",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT
   MONTH(placed_at) AS month,
   COUNT(*) AS orders
   FROM orders
   GROUP BY MONTH(placed_at)
  `);

  res.json(rows);

 }
);

app.get(
 "/api/admin/analytics/recent-orders",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT *
   FROM orders
   ORDER BY id DESC
   LIMIT 5
  `);

  res.json(rows);

 }
);

app.get(
 "/api/admin/analytics/monthly-revenue",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT
    MONTH(placed_at) AS month,
    SUM(total_amount) AS revenue
   FROM orders
   GROUP BY MONTH(placed_at)
   ORDER BY MONTH(placed_at)
  `);

  res.json(rows);

 }
);

app.get(
 "/api/admin/analytics/order-status",
 async(req,res)=>{

  const [rows] = await pool.query(`
   SELECT
    status,
    COUNT(*) AS total
   FROM orders
   GROUP BY status
  `);

  res.json(rows);

 }
);

app.get(
 "/api/admin/analytics/top-products",
 async(req,res)=>{

  const [rows] = await pool.query(`
 SELECT
  product_name,
  SUM(quantity) AS total_sold
 FROM order_items
 GROUP BY product_name
 ORDER BY total_sold DESC
 LIMIT 5
`);

  res.json(rows);

 }
);
app.get(
 "/api/admin/order/:id",
 async(req,res)=>{

  const [rows] = await pool.query(
   `
   SELECT *
   FROM orders
   WHERE id=?
   `,
   [req.params.id]
  );

  if(rows.length === 0){
   return res
    .status(404)
    .json({
      message:"Order not found"
    });
  }

  res.json(rows[0]);
 }
);

app.get("/api/admin/order/:id", async (req,res)=>{

 console.log("Received ID:", req.params.id);

 const [rows] = await pool.query(
   "SELECT * FROM orders WHERE id=?",
   [req.params.id]
 );

 console.log(rows);

 if(rows.length === 0){
   return res.status(404).json({
     message:"Order not found"
   });
 }

 res.json(rows[0]);
});

app.get(
 "/api/admin/order/:id",
 async (req,res) => {

  try {

   const [rows] = await pool.query(
    "SELECT * FROM orders WHERE id=?",
    [req.params.id]
   );

   if(rows.length === 0){
    return res.status(404).json({
      message:"Order not found"
    });
   }

   res.json(rows[0]);

  } catch(err){

   console.log(err);

   res.status(500).json({
    message:"Server Error"
   });

  }

 }
);

app.get("/api/admin/reports/sales-summary", async (req,res)=>{
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS total_orders,
      SUM(total_amount) AS total_revenue
    FROM orders
  `);

  res.json(rows[0]);
});

app.get("/api/admin/reports/monthly-sales", async(req,res)=>{

  const [rows] = await pool.query(`
    SELECT
      MONTH(placed_at) AS month,
      SUM(total_amount) AS revenue
    FROM orders
    GROUP BY MONTH(placed_at)
    ORDER BY MONTH(placed_at)
  `);

  res.json(rows);

});

app.get("/api/admin/reports/top-products", async(req,res)=>{

 const [rows] = await pool.query(`
   SELECT
     product_name,
     SUM(quantity) AS total_sold
   FROM order_items
   GROUP BY product_name
   ORDER BY total_sold DESC
   LIMIT 20
 `);

 res.json(rows);

});

app.get("/api/admin/reports/export-orders", async(req,res)=>{

 const [rows] = await pool.query(`
   SELECT *
   FROM orders
 `);

 res.json(rows);

});


app.get(
 "/api/admin/homepage",
 async(req,res)=>{

  const [rows] =
   await pool.query(
    "SELECT * FROM homepage_content LIMIT 1"
   );

  res.json(rows[0]);

 }
);

app.put(
 "/api/admin/homepage",
 async(req,res)=>{

  const {
   hero_title,
   hero_subtitle,
   about_title,
   about_description,
   banner_image
  } = req.body;

  await pool.query(
   `
   UPDATE homepage_content
   SET
    hero_title=?,
    hero_subtitle=?,
    about_title=?,
    about_description=?,
    banner_image=?
   WHERE id=1
   `,
   [
    hero_title,
    hero_subtitle,
    about_title,
    about_description,
    banner_image
   ]
  );

  res.json({
   success:true
  });

 }
);

app.get(
 "/api/admin/contents",
 async(req,res)=>{

  const [rows] =
   await pool.query(
    "SELECT * FROM contents"
   );

  res.json(rows);

 }
);

app.get(
 "/api/admin/contents/:id",
 async(req,res)=>{

  const [rows] =
   await pool.query(
    "SELECT * FROM contents WHERE id=?",
    [req.params.id]
   );

  res.json(rows[0]);

 }
);

app.put(
 "/api/admin/contents/:id",
 async(req,res)=>{

  const {
   page_title,
   content
  } = req.body;

  await pool.query(
   `
   UPDATE contents
   SET
    page_title=?,
    content=?
   WHERE id=?
   `,
   [
    page_title,
    content,
    req.params.id
   ]
  );

  res.json({
   success:true
  });

 }
);

app.get(
 "/api/admin/blogs",
 async(req,res)=>{

  const [rows] =
   await pool.query(`
    SELECT *
    FROM blogs
    ORDER BY created_at DESC
   `);

  res.json(rows);

 }
);


app.get(
 "/api/admin/blogs/:id",
 async(req,res)=>{

  const [rows] =
   await pool.query(
    "SELECT * FROM blogs WHERE id=?",
    [req.params.id]
   );

  res.json(rows[0]);

 }
);

app.post(
 "/api/admin/blogs",
 async(req,res)=>{

  const {
   title,
   slug,
   content,
   image_url,
   status
  } = req.body;

  await pool.query(
   `
   INSERT INTO blogs
   (
    title,
    slug,
    content,
    image_url,
    status
   )
   VALUES
   (?,?,?,?,?)
   `,
   [
    title,
    slug,
    content,
    image_url,
    status
   ]
  );

  res.json({
   success:true
  });

 }
);

app.put(
 "/api/admin/blogs/:id",
 async(req,res)=>{

  const {
   title,
   slug,
   content,
   image_url,
   status
  } = req.body;

  await pool.query(
   `
   UPDATE blogs
   SET
    title=?,
    slug=?,
    content=?,
    image_url=?,
    status=?
   WHERE id=?
   `,
   [
    title,
    slug,
    content,
    image_url,
    status,
    req.params.id
   ]
  );

  res.json({
   success:true
  });

 }
);

app.delete(
 "/api/admin/blogs/:id",
 async(req,res)=>{

  await pool.query(
   "DELETE FROM blogs WHERE id=?",
   [req.params.id]
  );

  res.json({
   success:true
  });

 }
);
app.get(
 "/api/admin/seo",
 async(req,res)=>{

  const [rows] =
   await pool.query(
    "SELECT * FROM seo_settings LIMIT 1"
   );

  res.json(rows[0]);

 }
);

app.put(
 "/api/admin/seo",
 async(req,res)=>{

  const {
   site_title,
   meta_description,
   meta_keywords,
   og_title,
   og_description,
   og_image,
   canonical_url
  } = req.body;

  await pool.query(
   `
   UPDATE seo_settings
   SET
    site_title=?,
    meta_description=?,
    meta_keywords=?,
    og_title=?,
    og_description=?,
    og_image=?,
    canonical_url=?
   WHERE id=1
   `,
   [
    site_title,
    meta_description,
    meta_keywords,
    og_title,
    og_description,
    og_image,
    canonical_url
   ]
  );

  res.json({
   success:true
  });

 }
);

app.post(
 "/api/admin/media/upload",
 upload.single("file"),
 async(req,res)=>{

  const fileUrl =
   `http://localhost:5005/uploads/${req.file.filename}`;

  await pool.query(
   `
   INSERT INTO media_library
   (
    file_name,
    file_url,
    file_type
   )
   VALUES
   (?,?,?)
   `,
   [
    req.file.originalname,
    fileUrl,
    req.file.mimetype
   ]
  );

  res.json({
   success:true,
   file_url:fileUrl
  });

 }
);

app.get(
 "/api/admin/media",
 async(req,res)=>{

  const [rows] =
   await pool.query(
    `
    SELECT *
    FROM media_library
    ORDER BY uploaded_at DESC
    `
   );

  res.json(rows);

 }
);

app.delete(
 "/api/admin/media/:id",
 async(req,res)=>{

  await pool.query(
   `
   DELETE FROM media_library
   WHERE id=?
   `,
   [req.params.id]
  );

  res.json({
   success:true
  });

 }
);

app.get(
 "/api/admin/notifications",
 async(req,res)=>{

  const [rows] =
   await pool.query(`
    SELECT *
    FROM notifications
    ORDER BY created_at DESC
   `);

  res.json(rows);

 }
);

app.get(
 "/api/admin/notifications/:id",
 async(req,res)=>{

  const [rows] =
   await pool.query(
    "SELECT * FROM notifications WHERE id=?",
    [req.params.id]
   );

  res.json(rows[0]);

 }
);

app.post(
 "/api/admin/notifications",
 async(req,res)=>{

  const {
   title,
   message,
   type,
   status
  } = req.body;

  await pool.query(
   `
   INSERT INTO notifications
   (
    title,
    message,
    type,
    status
   )
   VALUES
   (?,?,?,?)
   `,
   [
    title,
    message,
    type,
    status
   ]
  );

  res.json({
   success:true
  });

 }
);

app.put(
 "/api/admin/notifications/:id",
 async(req,res)=>{

  const {
   title,
   message,
   type,
   status
  } = req.body;

  await pool.query(
   `
   UPDATE notifications
   SET
    title=?,
    message=?,
    type=?,
    status=?
   WHERE id=?
   `,
   [
    title,
    message,
    type,
    status,
    req.params.id
   ]
  );

  res.json({
   success:true
  });

 }
);

app.delete(
 "/api/admin/notifications/:id",
 async(req,res)=>{

  await pool.query(
   "DELETE FROM notifications WHERE id=?",
   [req.params.id]
  );

  res.json({
   success:true
  });

 }
);
app.get(
 "/api/admin/admins",
 async(req,res)=>{

  const [rows] =
   await pool.query(`
    SELECT
     id,
     name,
     email,
     role,
     status,
     created_at,
     last_login
    FROM admins
    ORDER BY id DESC
   `);

  res.json(rows);

 }
);
app.post(
 "/api/admin/admins",
 async(req,res)=>{

  const {
   name,
   email,
   password,
   role
  } = req.body;

  const hash =
   await bcrypt.hash(password,10);

  await pool.query(
   `
   INSERT INTO admins
   (
    name,
    email,
    password_hash,
    role
   )
   VALUES
   (?,?,?,?)
   `,
   [
    name,
    email,
    hash,
    role
   ]
  );

  res.json({
   success:true
  });

 }
);

app.put(
 "/api/admin/admins/:id/status",
 async(req,res)=>{

  const { status } = req.body;

  await pool.query(
   `
   UPDATE admins
   SET status=?
   WHERE id=?
   `,
   [
    status,
    req.params.id
   ]
  );

  res.json({
   success:true
  });

 }
);

app.delete(
 "/api/admin/admins/:id",
 async(req,res)=>{

  await pool.query(
   `
   DELETE FROM admins
   WHERE id=?
   `,
   [req.params.id]
  );

  res.json({
   success:true
  });

 }
);

app.get(
 "/api/admin/activity-logs",
 async(req,res)=>{

  try{

   const [rows] =
    await pool.query(
     `
     SELECT
      al.id,
      a.name,
      al.action,
      al.details,
      al.created_at
     FROM activity_logs al
     LEFT JOIN admins a
      ON a.id = al.user_id
     ORDER BY al.created_at DESC
     `
    );

   res.json(rows);

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed to fetch logs"
   });

  }

 }
);

app.post(
 "/api/products",
 async(req,res)=>{

  const {
   name,
   price
  } = req.body;

  await pool.query(
   `
   INSERT INTO products
   (
    name,
    price
   )
   VALUES
   (?,?)
   `,
   [
    name,
    price
   ]
  );

  await pool.query(
   `
   INSERT INTO activity_logs
   (
    user_id,
    action,
    details
   )
   VALUES
   (?,?,?)
   `,
   [
    1, // temporary admin id
    "Created Product",
    JSON.stringify({
     product:name
    })
   ]
  );

  res.json({
   success:true
  });

 }
);

app.get(
 "/api/admin/settings",
 async(req,res)=>{

  try{

   const [rows] =
    await pool.query(
     "SELECT * FROM settings LIMIT 1"
    );

   res.json(rows[0]);

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed to load settings"
   });

  }

 }
);

app.put(
 "/api/admin/settings",
 async(req,res)=>{

  try{

   const {
    siteName,
    supportEmail,
    maintenanceMode,
    logoUrl,
    maintenanceMessage
   } = req.body;

   await pool.query(
    `
    UPDATE settings
    SET
     site_name=?,
     support_email=?,
     maintenance_mode=?,
     logo_url=?,
     maintenance_message=?
    WHERE id=1
    `,
    [
     siteName,
     supportEmail,
     maintenanceMode,
     logoUrl,
     maintenanceMessage
    ]
   );

   await logActivity(
    1,
    "Updated Settings",
    {
     siteName,
     supportEmail,
     maintenanceMode,
     logoUrl,
     maintenanceMessage
    }
   );

   res.json({
    success:true
   });

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed to save settings"
   });

  }

 }
);

app.get(
 "/api/admin/backups",
 async(req,res)=>{

  try{

   const [rows] =
    await pool.query(
     `
     SELECT *
     FROM backups
     ORDER BY created_at DESC
     `
    );

   res.json(rows);

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed to load backups"
   });

  }

 }
);

app.post(
 "/api/admin/backups/create",
 async(req,res)=>{

  try{

   const filename =
    `backup_${
      Date.now()
    }.sql`;

   const filesize =
    `${(
      Math.random()*5+1
     ).toFixed(1)} MB`;

   await pool.query(
    `
    INSERT INTO backups
    (
     filename,
     filesize
    )
    VALUES
    (?,?)
    `,
    [
     filename,
     filesize
    ]
   );

   await logActivity(
    1,
    "Created Backup",
    {
     filename
    }
   );

   res.json({
    success:true
   });

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed to create backup"
   });

  }

 }
);

app.delete(
 "/api/admin/backups/:id",
 async(req,res)=>{

  try{

   const id =
    req.params.id;

   const [rows] =
    await pool.query(
     `
     SELECT filename
     FROM backups
     WHERE id=?
     `,
     [id]
    );

   if(rows.length){

    await logActivity(
     1,
     "Deleted Backup",
     {
      filename:
       rows[0].filename
     }
    );

   }

   await pool.query(
    `
    DELETE FROM backups
    WHERE id=?
    `,
    [id]
   );

   res.json({
    success:true
   });

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed"
   });

  }

 }
);

app.get(
 "/api/admin/backups/download/:filename",
 (req,res)=>{

  const filename =
   req.params.filename;

  res.download(
   `./backups/${filename}`
  );

 }
);

app.get(
 "/api/admin/ai-insights",
 async(req,res)=>{

  try{

   const [rows] =
    await pool.query(
     `
     SELECT *
     FROM ai_insights
     ORDER BY created_at DESC
     `
    );

   res.json(rows);

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed to load AI insights"
   });

  }

 }
);

app.post(
 "/api/admin/ai-insights/generate",
 async(req,res)=>{

  try{

   const title =
    "New AI Insight";

   const description =
    "System generated a new insight.";

   const priorities =
    ["High","Medium","Low"];

   const priority =
    priorities[
     Math.floor(
      Math.random()*3
     )
    ];

   await pool.query(
    `
    INSERT INTO ai_insights
    (
     title,
     description,
     priority
    )
    VALUES
    (?,?,?)
    `,
    [
     title,
     description,
     priority
    ]
   );

   await logActivity(
 1,
 "Generated AI Insight",
 {
  title,
  priority
 }
);

res.json({
 success: true,
 title,
 description,
 priority
});

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed to generate insight"
   });

  }

 }
);

app.delete(
 "/api/admin/ai-insights/:id",
 async(req,res)=>{

  try{

   const [rows] =
 await pool.query(
 `
 SELECT title
 FROM ai_insights
 WHERE id=?
 `,
 [req.params.id]
 );

if(rows.length){

 await logActivity(
 1,
 "Deleted AI Insight",
 {
  title: rows[0].title
 }
 );

}

await pool.query(
 `
 DELETE FROM ai_insights
 WHERE id=?
 `,
 [req.params.id]
);
   res.json({
    success:true
   });

  }catch(error){

   console.error(error);

   res.status(500).json({
    error:"Failed to delete insight"
   });

  }

 }
);

app.get("/api/admin/subscriptions", async (req, res) => {

    try {

        const [subscriptions] = await pool.query(`
            SELECT
                s.id,
                c.first_name,
                c.last_name,
                c.email,
                p.product_name,
                p.variety_name,
                s.frequency,
                s.quantity,
                s.price,
                s.next_delivery,
                s.status,
               p.stock_quantity
            FROM subscriptions s
            JOIN customers c
                ON s.customer_id = c.id
            JOIN products p
                ON s.product_id = p.id
            ORDER BY s.id DESC
        `);

        res.json(subscriptions);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/api/subscriptions/update-frequency", async (req, res) => {

    try {

        const { id, frequency } = req.body;

        await pool.query(
            `
            UPDATE subscriptions
            SET
                frequency = ?,
                next_delivery =
                    CASE
                        WHEN ?='Monthly'
                            THEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH)

                        WHEN ?='Every 2 Months'
                            THEN DATE_ADD(CURDATE(), INTERVAL 2 MONTH)

                        ELSE next_delivery
                    END
            WHERE id=?
            `,
            [
                frequency,
                frequency,
                frequency,
                id
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

app.post("/api/subscriptions/update-quantity", async (req,res)=>{

    try{

        const { id, quantity, price } = req.body;

        await pool.query(
            `
            UPDATE subscriptions
            SET
                quantity=?,
                price=?
            WHERE id=?
            `,
            [
                quantity,
                price,
                id
            ]
        );

        res.json({
            success:true
        });

    }catch(err){

        console.error(err);

        res.status(500).json({
            error:err.message
        });

    }

});

app.post("/api/subscriptions/skip", async (req, res) => {

    try {

        const { id } = req.body;

        const [rows] = await pool.query(
            `
            SELECT frequency
            FROM subscriptions
            WHERE id=?
            `,
            [id]
        );

        if(rows.length === 0){

            return res.status(404).json({
                success:false
            });

        }

        const frequency = rows[0].frequency;

        let interval = 1;

        if(frequency === "Every 2 Months"){

            interval = 2;

        }

        await pool.query(
            `
            UPDATE subscriptions
            SET next_delivery =
                DATE_ADD(
                    next_delivery,
                    INTERVAL ? MONTH
                )
            WHERE id=?
            `,
            [interval, id]
        );

        res.json({
            success:true
        });

    }catch(err){

        console.error(err);

        res.status(500).json({
            error:err.message
        });

    }

});

app.listen(5005, () => {
console.log("Products API running on port 5005");
});

