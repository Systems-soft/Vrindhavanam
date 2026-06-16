console.log("RUNNING FILE:", __filename);
const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
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
    queueLimit: 0
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

function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split('T')[0];
}

function importExcelToDatabase(){
    try {
        const excelFiles = ['tea.xlsx', 'cardamom.xlsx', 'honey.xlsx','coffee.xlsx','pepper.xlsx','cloves.xlsx','ghee.xlsx','turmeric.xlsx','ginger.xlsx','cashew.xlsx'];
        excelFiles.forEach(file => {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) {
                return;
            }
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const products = xlsx.utils.sheet_to_json(sheet);
            console.log(`Syncing ${products.length} products from ${file}...`);
            products.forEach(product => {
                const sql = `
                INSERT INTO products
                (
                    serial_no,
                    product_name,
                    product_id,
                    variety_name,
                    colour,
                    grade,
                    weight,
                    image_url,
                    date,
                    daily_price,
                    factor,
                    size,
                    stock_status,
                    notes,
                    price
                )
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                ON DUPLICATE KEY UPDATE
                    product_name = VALUES(product_name),
                    variety_name = VALUES(variety_name),
                    colour = VALUES(colour),
                    grade = VALUES(grade),
                    weight = VALUES(weight),
                    image_url = VALUES(image_url),
                    date = VALUES(date),
                    daily_price = VALUES(daily_price),
                    factor = VALUES(factor),
                    size = VALUES(size),
                    stock_status = VALUES(stock_status),
                    notes = VALUES(notes),
                    price = VALUES(price)
                `;
                db.query(sql, [
                    product.serial_no,
                    product.product_name,
                    product.product_id,
                    product.variety_name,
                    product.colour,
                    product.grade,
                    product.weight,
                    product.image_url,
                    product.date ? excelDateToJSDate(product.date) : null,
                    product.daily_price,
                    product.factor,
                    product.size,
                    product.stock_status,
                    product.notes,
                    product.price
                ], (err) => {
                    if (err) {
                        console.log(`Insert/Update error for ${product.product_id} in ${file}:`, err.message);
                    } else {
                        console.log(`Updated product: ${product.product_id} (${product.product_name} - ${product.variety_name})`);
                    }
                });
            });
            console.log(`${file} synced successfully ✅`);
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

            const Admin = require("./backend/models/Admin");
            const AuthService = require("./backend/services/authService");

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
