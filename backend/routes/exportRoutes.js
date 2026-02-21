const express = require('express');
const router = express.Router();
const db = require('../db');
const XLSX = require('xlsx');

router.get('/export', (req,res)=>{
  db.query("SELECT * FROM transactions", (err,result)=>{
    if(err) return res.status(500).send(err);

    const ws = XLSX.utils.json_to_sheet(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    const filePath = "./transactions.xlsx";
    XLSX.writeFile(wb, filePath);

    res.download(filePath);
  });
});

module.exports = router;