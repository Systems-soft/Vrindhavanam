const pool = require('./src/config/db');

async function setupDB() {
  console.log('Starting Database Migration...');

  const queries = [
    // 1. Variants
    `CREATE TABLE IF NOT EXISTS variants (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(100) UNIQUE,
      price DECIMAL(12,2) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;`,

    // 2. Inventory
    `CREATE TABLE IF NOT EXISTS inventory (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      variant_id BIGINT UNSIGNED NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      reserved_quantity INT NOT NULL DEFAULT 0,
      reorder_level INT NOT NULL DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;`,

    // 3. Harvests & Batches
    `CREATE TABLE IF NOT EXISTS harvests (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      crop_type VARCHAR(100) NOT NULL,
      harvest_date DATE NOT NULL,
      yield_kg DECIMAL(10,2) NOT NULL,
      quality_grade ENUM('Premium', 'Standard', 'Economy') NOT NULL,
      status ENUM('Harvested', 'Processing', 'Completed') DEFAULT 'Harvested',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    `CREATE TABLE IF NOT EXISTS batches (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      harvest_id BIGINT UNSIGNED NOT NULL,
      batch_number VARCHAR(100) UNIQUE NOT NULL,
      processing_status ENUM('Pending', 'Drying', 'Sorting', 'Packaging', 'Ready') DEFAULT 'Pending',
      packaging_date DATE NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (harvest_id) REFERENCES harvests(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;`,

    // 4. Subscriptions (extending if it exists, or creating new)
    `CREATE TABLE IF NOT EXISTS subscriptions_ext (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      customer_id BIGINT UNSIGNED NOT NULL,
      plan_type ENUM('Monthly', 'Quarterly', 'Yearly') NOT NULL,
      status ENUM('Active', 'Expired', 'Cancelled') DEFAULT 'Active',
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiry_date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;`,

    // 5. Campaigns & Broadcasts
    `CREATE TABLE IF NOT EXISTS newsletter_campaigns (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      subject VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      status ENUM('Draft', 'Sent') DEFAULT 'Draft',
      sent_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    `CREATE TABLE IF NOT EXISTS whatsapp_broadcasts (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      message TEXT NOT NULL,
      status ENUM('Draft', 'Sent') DEFAULT 'Draft',
      sent_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    // 6. Blogs & Homepage
    `CREATE TABLE IF NOT EXISTS blogs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      image_url VARCHAR(255),
      status ENUM('Draft', 'Published') DEFAULT 'Draft',
      published_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    `CREATE TABLE IF NOT EXISTS homepage_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(100) UNIQUE NOT NULL,
      content JSON NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    // 7. Contact Forms & Media
    `CREATE TABLE IF NOT EXISTS contact_forms (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status ENUM('New', 'Read', 'Replied', 'Archived') DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    `CREATE TABLE IF NOT EXISTS media (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      file_name VARCHAR(255) NOT NULL,
      file_url VARCHAR(255) NOT NULL,
      file_type VARCHAR(50) NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    // 8. Notifications & Logs
    `CREATE TABLE IF NOT EXISTS notifications (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type ENUM('Info', 'Warning', 'Alert') DEFAULT 'Info',
      is_read BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    `CREATE TABLE IF NOT EXISTS activity_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NULL,
      action VARCHAR(255) NOT NULL,
      details JSON NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,

    // 9. AI Insights
    `CREATE TABLE IF NOT EXISTS ai_insights (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      insight_type VARCHAR(100) NOT NULL,
      content JSON NOT NULL,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`
  ];

  try {
    for (const sql of queries) {
      await pool.query(sql);
      console.log('Executed table creation query successfully.');
    }
    console.log('Database Migration Completed Successfully.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    process.exit(0);
  }
}

setupDB();
