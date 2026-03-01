const express = require('express');
const cors = require('cors');

const db = require('./db');

const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();


/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());


/* ================= ROUTES ================= */

app.use('/products', productRoutes);
app.use('/transactions', transactionRoutes);



/* ================= GET ALL TRANSACTIONS ================= */

app.get("/all-transactions", async (req,res)=>{

try{

const [rows]=await db.query(`

SELECT
code,
name,
total_quantity,
type,
entry_date
FROM transactions
ORDER BY id DESC

`);

res.json(rows);

}
catch(err){

console.log(err);
res.send("Database Error");

}

});



/* ================= PRODUCTS STOCK API ================= */

app.get("/products-stock", async (req,res)=>{

try{

const [rows]=await db.query(`

SELECT
p.code,
p.name,

IFNULL(
SUM(
CASE
WHEN t.type='receive' THEN t.total_quantity
WHEN t.type='dispatch' THEN -t.total_quantity
ELSE 0
END
),0) AS stock

FROM products_master p

LEFT JOIN transactions t
ON p.code = t.code

GROUP BY p.code, p.name

ORDER BY p.code ASC;

`);

res.json(rows);

}

catch(err){

console.log(err);
res.status(500).send("Database Error");

}

});



/* ================= FINAL STOCK DOWNLOAD ================= */

app.get("/final-stock/download", async (req,res)=>{

try{

const [rows] = await db.query(`

SELECT
code,
MAX(name) as name,

SUM(
CASE
WHEN type='receive' THEN total_quantity
WHEN type='dispatch' THEN -total_quantity
ELSE 0
END
) as final_stock

FROM transactions

GROUP BY code

ORDER BY code

`);

let csv = "Code,Name,Final Stock\n";

rows.forEach(row=>{

csv += `${row.code},${row.name},${row.final_stock}\n`;

});


res.header("Content-Type","text/csv");

res.attachment("final_stock.csv");

res.send(csv);

}

catch(err){

console.log(err);
res.send("Download Error");

}

});



/* ================= TEST ================= */

app.get('/', (req,res)=>{

res.send("Stock ERP Server Running ✅");

});


/* ================= SERVER ================= */

app.listen(3000, ()=>{

console.log("Server Running http://localhost:3000");

});