const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const xlsx = require('xlsx');

const host = '0.0.0.0';
const port = Number(process.env.PORT || 8082);
const root = __dirname;

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

function excelDateToJSDate(serial) {

    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    return date_info.toISOString().split('T')[0];

}


function importExcelToDatabase(){
    try {
        const excelFiles = ['tea.xlsx', 'cardamom.xlsx', 'honey.xlsx','coffee.xlsx','pepper.xlsx','cloves.xlsx','ghee.xlsx','turmeric.xlsx','ginger.xlsx','cashew.xlsx','ashwagandha.xlsx', 'garcinia.xlsx', 'pickle.xlsx'];
        excelFiles.forEach(file => {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) {
                console.log(`Excel file not found: ${file}`);
                return;
            }

            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const products = xlsx.utils.sheet_to_json(sheet).map(row => ({
  ...row,

  stock_quantity: Number(row.stock_quantity) || 0,

  stock_status: Number(row.stock_quantity) > 0 ? "In Stock" : "Out Of Stock"
}));
            console.log(products);
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
    stock_quantity,   
    notes,
    price
)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
stock_quantity = VALUES(stock_quantity),  
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
product.stock_quantity,  
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
    // Log incoming request
    console.log(`Incoming request: ${req.method} ${req.url}`);
    // Allow cross-origin requests (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // API route to get products
// Products API
if (req.url === '/api/products') {

    console.log("API /api/products called");

    db.query(`
        SELECT * FROM products
    `, (err, results) => {

        if (err) {
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });
            return res.end(JSON.stringify(err));
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(results));
    });

    return;
}

// Subscriptions API
if (req.url === '/api/subscriptions' && req.method === 'GET') {

    console.log("API /api/subscriptions called");

    db.query(
        "SELECT * FROM subscriptions",
        (err, results) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type':'application/json'
                });
                return res.end(JSON.stringify(err));
            }

            res.writeHead(200, {
                'Content-Type':'application/json'
            });

            res.end(JSON.stringify(results));
        }
    );

    return;
}

// Subscription Details API
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

JOIN products p
ON s.product_id = p.id
`,
(err, results) => {

    if(err){
        res.writeHead(500,{
            "Content-Type":"application/json"
        });
        return res.end(JSON.stringify(err));
    }

    res.writeHead(200,{
        "Content-Type":"application/json"
    });

    res.end(JSON.stringify(results));

});

    return;
}

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
    res.writeHead(400, {
        "Content-Type": "application/json"
    });
    return res.end(JSON.stringify({
        error: "Invalid JSON"
    }));
}

        db.query(
            `INSERT INTO subscriptions
            (
    customer_id,
    product_id,
    variant_id,
    channel,
    frequency,
    quantity,
    price,
    next_delivery
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
    data.customer_id,
    data.product_id,
    data.variant_id,
    data.channel,
    data.frequency,
    data.quantity,
    data.price,
    data.next_delivery
            ],
            (err, result) => {

                if (err) {
                    res.writeHead(500, {
                        "Content-Type":"application/json"
                    });
                    return res.end(JSON.stringify(err));
                }

                res.writeHead(200, {
                    "Content-Type":"application/json"
                });

                res.end(JSON.stringify({
                    success:true,
                    subscriptionId:result.insertId
                }));

            }
        );

    });

    return;
}

if (req.url === "/api/subscriptions/pause" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        db.query(
            `
            UPDATE subscriptions
            SET status='paused'
            WHERE id=?
            `,
            [data.id],
            (err) => {

                if(err){
                    res.writeHead(500,{
                        "Content-Type":"application/json"
                    });
                    return res.end(JSON.stringify(err));
                }

                res.writeHead(200,{
                    "Content-Type":"application/json"
                });

                res.end(JSON.stringify({
                    success:true
                }));

            }
        );

    });

    return;
}

if (req.url === "/api/subscriptions/resume" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        db.query(
            `
            UPDATE subscriptions
            SET status='active'
            WHERE id=?
            `,
            [data.id],
            (err) => {

                if(err){
                    res.writeHead(500,{
                        "Content-Type":"application/json"
                    });
                    return res.end(JSON.stringify(err));
                }

                res.writeHead(200,{
                    "Content-Type":"application/json"
                });

                res.end(JSON.stringify({
                    success:true
                }));

            }
        );

    });

    return;
}

if (req.url === "/api/subscriptions/resume" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        db.query(
            `
            UPDATE subscriptions
            SET status='active'
            WHERE id=?
            `,
            [data.id],
            (err) => {

                if(err){
                    res.writeHead(500,{
                        "Content-Type":"application/json"
                    });
                    return res.end(JSON.stringify(err));
                }

                res.writeHead(200,{
                    "Content-Type":"application/json"
                });

                res.end(JSON.stringify({
                    success:true
                }));

            }
        );

    });

    return;
}

if (req.url === "/api/subscriptions/skip" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        db.query(
            `
            UPDATE subscriptions
            SET next_delivery =
                CASE
                    WHEN frequency='Monthly'
                        THEN DATE_ADD(next_delivery, INTERVAL 1 MONTH)

                    WHEN frequency='Every 2 Months'
                        THEN DATE_ADD(next_delivery, INTERVAL 2 MONTH)

                    ELSE next_delivery
                END
            WHERE id=?
            `,
            [data.id],
            (err) => {

                if(err){
                    res.writeHead(500,{
                        "Content-Type":"application/json"
                    });
                    return res.end(JSON.stringify(err));
                }

                res.writeHead(200,{
                    "Content-Type":"application/json"
                });

                res.end(JSON.stringify({
                    success:true
                }));

            }
        );

    });

    return;
}

if (req.url === "/api/subscriptions/cancel" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        db.query(
            `
            UPDATE subscriptions
            SET status='cancelled'
            WHERE id=?
            `,
            [data.id],
            (err) => {

                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "application/json"
                    });
                    return res.end(JSON.stringify(err));
                }

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: true
                }));

            }
        );

    });

    return;
}
   
if (req.url === "/api/subscriptions/update-frequency" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        db.query(
            `
            UPDATE subscriptions
SET
    frequency=?,
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
    data.frequency,
    data.frequency,
    data.frequency,
    data.id
],
            (err) => {

                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "application/json"
                    });
                    return res.end(JSON.stringify(err));
                }

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: true
                }));

            }
        );

    });

    return;
}

if (req.url === "/api/subscriptions/update-quantity" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        db.query(
            `
            UPDATE subscriptions
            SET
                quantity=?,
                price=?
            WHERE id=?
            `,
            [
                data.quantity,
                data.price,
                data.id
            ],
            (err) => {

                if(err){
                    res.writeHead(500,{
                        "Content-Type":"application/json"
                    });
                    return res.end(JSON.stringify(err));
                }

                res.writeHead(200,{
                    "Content-Type":"application/json"
                });

                res.end(JSON.stringify({
                    success:true
                }));

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
    const route = requestPath === '/' ? '/index.html' : requestPath;
    const filePath = path.normalize(path.join(root, route));

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