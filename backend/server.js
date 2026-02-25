const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(bodyParser.json());


/* ================= ROUTES ================= */

app.use('/products', productRoutes);
app.use('/transactions', transactionRoutes);


/* ================= GET ALL TRANSACTIONS ================= */

app.get("/transactions", async (req,res)=>{

try{

const [rows] = await db.query(`

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
END
) as final_stock

FROM transactions

GROUP BY code

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


/* ================= HOME ================= */

app.get('/', (req,res)=>{
res.send("Stock ERP Server Running ✅");
});


/* ================= SERVER ================= */

const PORT = 3000;

app.listen(PORT, ()=>{

console.log(`Server running on http://localhost:${PORT}`);

});