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
        const excelFiles = ['tea.xlsx', 'cardamom.xlsx', 'honey.xlsx','coffee.xlsx','pepper.xlsx','cloves.xlsx','ghee.xlsx','turmeric.xlsx','ginger.xlsx','cashew.xlsx'];
        excelFiles.forEach(file => {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) {
                console.log(`Excel file not found: ${file}`);
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
    // Log incoming request
    console.log(`Incoming request: ${req.method} ${req.url}`);
    // Allow cross-origin requests (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // API route to get products
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