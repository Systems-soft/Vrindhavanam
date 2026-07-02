console.log("RUNNING FILE:", __filename);
const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const xlsx = require('xlsx');
console.log("RUNNING FILE:", __filename);
const host = '0.0.0.0';
const port = Number(process.env.PORT || 8085);
const root = path.join(__dirname, 'Vrindhavanam Glassmorphism', 'Vrindhavanam');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MySql@12345',
    database: 'vrindhavanam_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

db.on('error', (err) => {
    console.error('MySQL Pool Error:', err.message);
    // Pool will automatically recreate connections, no need to crash
});

db.on('connection', (connection) => {
    connection.on('error', (err) => {
        console.error('MySQL Connection Error:', err.message);
    });
});

// Prevent unhandled rejection crashes
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

console.log("MySQL Pool Created ✅");

// Ensure products table exists
const createTableSQL = `
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial_no VARCHAR(255),
    product_id VARCHAR(255) UNIQUE,
    product_name VARCHAR(255),
    variety_name VARCHAR(255),
    colour VARCHAR(255),
    grade VARCHAR(255),
    weight VARCHAR(255),
    image_url VARCHAR(255),
    date DATE,
    daily_price DECIMAL(10,2),
    factor DECIMAL(10,2),
    size VARCHAR(255),
    stock_status VARCHAR(255),
    notes TEXT,
    price DECIMAL(10,2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

db.query(createTableSQL, (err) => {
    if (err) console.error('Error creating products table:', err);
    else console.log('Products table ensured ✅');
});

// Ensure subscriptions table exists
const createSubsTableSQL = `
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED,
    channel VARCHAR(50) NOT NULL,
    status ENUM('active','paused','cancelled','expired') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_id INT,
    variant_id INT,
    frequency ENUM('Monthly','Every 2 Months') DEFAULT 'Monthly',
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),
    next_delivery DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

db.query(createSubsTableSQL, (err) => {
    if (err) console.error('Error creating subscriptions table:', err);
    else console.log('Subscriptions table ensured ✅');
});

function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split('T')[0];
}

const watchTimeouts = {};

function writeDbToProductsJson() {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error("Error querying products for products.json:", err);
            return;
        }
        const jsonPath = path.join(root, 'data', 'products.json');
        try {
            fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf8');
            console.log(`Updated static products.json file with ${results.length} products ✅`);
        } catch (writeErr) {
            console.error("Error writing products.json:", writeErr);
        }
    });
}

function syncExcelFileToDatabase(file) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) {
        return;
    }
    try {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const products = xlsx.utils.sheet_to_json(sheet);
        if (products.length === 0) {
            console.log(`No records found in ${file}.`);
            return;
        }

        console.log(`Syncing ${products.length} products from ${file}...`);

        // Collect all columns/keys in Excel row objects
        const excelColumns = new Set();
        products.forEach(row => {
            Object.keys(row).forEach(key => {
                const cleaned = key.trim();
                if (cleaned) excelColumns.add(cleaned);
            });
        });

        // Query existing columns in products table
        db.query('SHOW COLUMNS FROM products', (err, cols) => {
            if (err) {
                console.error("Error querying columns from DB:", err);
                return;
            }
            const dbColumns = new Set(cols.map(c => c.Field.toLowerCase()));

            // Find missing columns and alter table
            const alterPromises = [];
            excelColumns.forEach(col => {
                const normalized = col.toLowerCase();
                if (!dbColumns.has(normalized)) {
                    alterPromises.push(new Promise((resolve) => {
                        db.query(`ALTER TABLE products ADD COLUMN \`${col}\` TEXT DEFAULT NULL`, (alterErr) => {
                            if (alterErr) {
                                console.error(`Error adding column \`${col}\`:`, alterErr);
                            } else {
                                console.log(`Dynamically added column \`${col}\` to database table \`products\` ✅`);
                            }
                            resolve(); // resolve anyway to continue sync
                        });
                    }));
                }
            });

            Promise.all(alterPromises).then(() => {
                const columnsArray = Array.from(excelColumns);
                const insertFields = columnsArray.map(c => `\`${c}\``).join(', ');
                const valuePlaceholders = columnsArray.map(() => '?').join(', ');
                const updateClauses = columnsArray.map(c => `\`${c}\` = VALUES(\`${c}\`)`).join(', ');

                const sql = `
                    INSERT INTO products (${insertFields})
                    VALUES (${valuePlaceholders})
                    ON DUPLICATE KEY UPDATE ${updateClauses}
                `;

                let completed = 0;
                products.forEach(product => {
                    const values = columnsArray.map(colName => {
                        let val = product[colName];
                        if (val === undefined) {
                            const matchedKey = Object.keys(product).find(k => k.trim().toLowerCase() === colName.toLowerCase());
                            val = matchedKey ? product[matchedKey] : null;
                        }
                        if (colName.toLowerCase() === 'date' && val) {
                            return excelDateToJSDate(val);
                        }
                        return val !== undefined ? val : null;
                    });

                    db.query(sql, values, (queryErr) => {
                        if (queryErr) {
                            console.error(`DB Query Error for product ID ${product.product_id || product.serial_no} in ${file}:`, queryErr.message);
                        } else {
                            console.log(`Synced product ${product.product_id || product.serial_no} (${product.product_name} - ${product.variety_name})`);
                        }
                        completed++;
                        if (completed === products.length) {
                            console.log(`${file} database sync complete ✅`);
                            writeDbToProductsJson();
                        }
                    });
                });
            });
        });
    } catch(err) {
        console.error(`Error processing ${file}:`, err);
    }
}

function importExcelToDatabase(){
    try {
        const excelFiles = ['tea.xlsx', 'cardamom.xlsx', 'honey.xlsx','coffee.xlsx','pepper.xlsx','cloves.xlsx','ghee.xlsx','turmeric.xlsx','ginger.xlsx','cashew.xlsx','ashwagandha.xlsx', 'garcinia.xlsx', 'pickle.xlsx'];
        excelFiles.forEach(file => {
            syncExcelFileToDatabase(file);
        });

        // Set up fs.watch file watcher on storefront directory to automatically sync on edits
        console.log(`Setting up live Excel file watcher in directory: ${root} 👁️`);
        fs.watch(root, (eventType, filename) => {
            if (filename && excelFiles.includes(filename)) {
                clearTimeout(watchTimeouts[filename]);
                watchTimeouts[filename] = setTimeout(() => {
                    console.log(`Live sync triggered: detected change in ${filename} 🔄`);
                    syncExcelFileToDatabase(filename);
                }, 1500);
            }
        });

    } catch(error) {
        console.log("IMPORT ERROR:", error);
    }
}

const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
};

const server = http.createServer((req, res) => {
    console.log("🔥 NEW SERVER VERSION LOADED");
    res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
);
res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
);
    if (req.method === "OPTIONS") {
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    });

    return res.end();
}
    console.log("URL RAW =", JSON.stringify(req.url));
    if (req.url === "/api/health") {
    console.log("HEALTH ROUTE HIT");

    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        status: "ok"
    }));

    return;
}

if (req.url === "/whoami") {
    console.log("WHOAMI ROUTE HIT");

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    return res.end("THIS IS MY SERVER");
}
    if (req.method === "POST" && req.url === "/api/admin/login") {

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", async () => {

        try {

            const { email, password } = JSON.parse(body);

            const Admin = require("./Vrindhavanam Glassmorphism/Vrindhavanam/backend/models/Admin");
            const AuthService = require("./Vrindhavanam Glassmorphism/Vrindhavanam/backend/services/authService");

            const admin = await Admin.findAdminByEmail(email);

            if (!admin) {
                res.writeHead(401, {
                    "Content-Type": "application/json"
                });

                return res.end(JSON.stringify({
                    success: false,
                    message: "Invalid credentials"
                }));
            }

            const valid = await AuthService.comparePassword(
                password,
                admin.password_hash
            );

            if (!valid) {

                res.writeHead(401, {
                    "Content-Type": "application/json"
                });

                return res.end(JSON.stringify({
                    success: false,
                    message: "Invalid credentials"
                }));
            }

            const token = AuthService.generateToken(admin);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

           return res.end(JSON.stringify({
    success: true,
    token,
    admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
    }
}));
        } catch(error) {

            console.error(error);

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify({
                success: false
            }));
        }

    });

    return;
}
   
    if (req.url === '/api/products') {
        console.log("API /api/products called");
        db.query(`
        SELECT
        id,
        serial_no,
        product_id,
        product_name,
        variety_name,
        colour,
        grade,
        weight,
        image_url,
        DATE_FORMAT(date,'%Y-%m-%d') AS date,
        daily_price,
        factor,
        size,
        stock_status,
        notes,
        price
        FROM products
        `, (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
        return;
    }

    // GET /api/subscriptions
    if (req.url === '/api/subscriptions' && req.method === 'GET') {
        console.log("API /api/subscriptions called");
        db.query("SELECT * FROM subscriptions", (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: err.message }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
        return;
    }

    // GET /api/subscription-details
    if (req.url === "/api/subscription-details" && req.method === "GET") {
        db.query(`
            SELECT
                s.id,
                s.customer_id,
                s.status,
                s.frequency,
                s.quantity,
                s.price,
                s.next_delivery,
                p.product_name,
                p.variety_name,
                p.image_url,
                p.stock_quantity
            FROM subscriptions s
            JOIN products p ON s.product_id = p.id
        `, (err, results) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: err.message }));
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        });
        return;
    }

    // POST /api/subscriptions (Create subscription)
    if (req.url === "/api/subscriptions" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
            }

            // Server-side validation
            if (!data.product_id || !data.frequency || !data.quantity || data.quantity < 1) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: "Missing or invalid subscription fields" }));
            }

            db.query(
                `INSERT INTO subscriptions (
                    customer_id,
                    product_id,
                    variant_id,
                    channel,
                    frequency,
                    quantity,
                    price,
                    next_delivery
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.customer_id || 1,
                    data.product_id,
                    data.variant_id || 1,
                    data.channel || "Website",
                    data.frequency,
                    data.quantity,
                    data.price,
                    data.next_delivery
                ],
                (err, result) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, error: err.message }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        success: true,
                        subscriptionId: result.insertId
                    }));
                }
            );
        });
        return;
    }

    // POST /api/subscriptions/pause
    if (req.url === "/api/subscriptions/pause" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
            }
            db.query(
                `UPDATE subscriptions SET status='paused' WHERE id=?`,
                [data.id],
                (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, error: err.message }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                }
            );
        });
        return;
    }

    // POST /api/subscriptions/resume
    if (req.url === "/api/subscriptions/resume" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
            }
            db.query(
                `UPDATE subscriptions SET status='active' WHERE id=?`,
                [data.id],
                (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, error: err.message }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                }
            );
        });
        return;
    }

    // POST /api/subscriptions/skip
    if (req.url === "/api/subscriptions/skip" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
            }
            db.query(
                `UPDATE subscriptions
                 SET next_delivery = CASE
                     WHEN frequency='Monthly' THEN DATE_ADD(next_delivery, INTERVAL 1 MONTH)
                     WHEN frequency='Every 2 Months' THEN DATE_ADD(next_delivery, INTERVAL 2 MONTH)
                     ELSE next_delivery
                 END
                 WHERE id=?`,
                [data.id],
                (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, error: err.message }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                }
            );
        });
        return;
    }

    // POST /api/subscriptions/cancel
    if (req.url === "/api/subscriptions/cancel" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
            }
            db.query(
                `UPDATE subscriptions SET status='cancelled' WHERE id=?`,
                [data.id],
                (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, error: err.message }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                }
            );
        });
        return;
    }

    // POST /api/subscriptions/update-frequency
    if (req.url === "/api/subscriptions/update-frequency" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
            }
            db.query(
                `UPDATE subscriptions
                 SET frequency=?,
                     next_delivery = CASE
                         WHEN ?='Monthly' THEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
                         WHEN ?='Every 2 Months' THEN DATE_ADD(CURDATE(), INTERVAL 2 MONTH)
                         ELSE next_delivery
                     END
                 WHERE id=?`,
                [data.frequency, data.frequency, data.frequency, data.id],
                (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, error: err.message }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                }
            );
        });
        return;
    }

    // POST /api/subscriptions/update-quantity
    if (req.url === "/api/subscriptions/update-quantity" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
            }
            db.query(
                `UPDATE subscriptions SET quantity=?, price=? WHERE id=?`,
                [data.quantity, data.price, data.id],
                (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ success: false, error: err.message }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                }
            );
        });
        return;
    }


    if (req.url.split('?')[0].startsWith("/api/variants/")) {

    console.log("✅ API HIT:", req.url);

    const product = req.url.split("/").pop().toLowerCase();

    try {

        const filePath = path.join(root, `${product}.xlsx`);
        console.log("Reading:", filePath);

        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const data = xlsx.utils.sheet_to_json(sheet);

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(data));

    } catch (error) {

        console.log("❌ ERROR:", error.message);

        res.writeHead(500, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            error: "Excel not found or invalid"
        }));
    }

    return;
}
    const requestPath = decodeURIComponent(req.url.split('?')[0]);
    const route = requestPath === '/' ? 'index.html' : requestPath.replace(/^\//, '');
    const filePath = path.join(root, route);
    if (!filePath.startsWith(root)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
    }
    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(port, host, () => {
    console.log(`Serving http://${host}:${port}/`);
    importExcelToDatabase();
});
