const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql connection

router.get('/final-stock/download', (req,res)=>{
    const sql = "SELECT * FROM final_stock";
    db.query(sql, (err, results)=>{
        if(err) return res.status(500).send(err);

        let csvContent = "Code,Name,Total Quantity\n";

        results.forEach(row=>{
            csvContent += `${row.code},${row.name},${row.total_quantity}\n`;
        });

        res.setHeader('Content-disposition', 'attachment; filename=final_stock.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvContent);
    });
});

module.exports = router;