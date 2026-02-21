const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req,res)=>{
    res.send("Stock ERP Server Running ✅");
});

const PORT = 3000;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));