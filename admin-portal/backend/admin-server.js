const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const adminRoutes = require('./src/routes/adminRoutes');
const variantRoutes = require('./src/routes/variantRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const harvestRoutes = require('./src/routes/harvestRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const marketingRoutes = require('./src/routes/marketingRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const homepageRoutes = require('./src/routes/homepageRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const mediaRoutes = require('./src/routes/mediaRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const logRoutes = require('./src/routes/logRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const authRoutes = require('./src/routes/authRoutes');
const pool = require('./src/config/db');

const app = express();
const PORT = 5005;
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');

app.use(cors({ origin: '*', credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/admin', adminRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
const swaggerPath = path.join(__dirname, 'swagger.json');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

const storefrontImagesPath = path.join(__dirname, '..', '..', 'Vrindhavanam Glassmorphism', 'Vrindhavanam', 'images');
if (fs.existsSync(storefrontImagesPath)) {
  app.use('/images', express.static(storefrontImagesPath));
}

app.get('/', (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    return;
  }

  res.status(200).json({
    status: 'ok',
    service: 'vrindhavanam-admin-backend',
    note: 'Frontend build not found. Run the admin frontend build to serve the dashboard here.',
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/api-docs/')) {
    next();
    return;
  }

  const indexPath = path.join(frontendDistPath, 'index.html');

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    return;
  }

  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

async function ensureCoreTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(30),
      status ENUM('active','inactive','blocked') DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      customer_id BIGINT UNSIGNED NOT NULL,
      total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
      status ENUM('Pending','Confirmed','Packed','Shipped','Delivered','Cancelled','Refunded') DEFAULT 'Pending',
      placed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_orders_customer_id (customer_id),
      INDEX idx_orders_status (status),
      CONSTRAINT fk_orders_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      customer_id BIGINT UNSIGNED NULL,
      channel VARCHAR(50) NOT NULL,
      status ENUM('active','paused','cancelled','expired') DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_subscriptions_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

(async () => {
  try {
    await ensureCoreTables();
    app.listen(PORT, () => {
      console.log(`Admin backend listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize admin backend:', error);
    process.exit(1);
  }
})();
