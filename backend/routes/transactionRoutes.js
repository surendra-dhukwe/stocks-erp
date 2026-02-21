const express = require('express');
const router = express.Router();
const db = require('../db');

// Save transactions
router.post('/', (req,res)=>{
    const {party_name, invoice_number, note, stock_id, type, items} = req.body;

    items.forEach(item=>{
        db.query(`INSERT INTO transactions 
            (stock_id,type,party_name,invoice_number,note,code,name,bags,quantity,total_quantity) 
            VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [stock_id,type,party_name,invoice_number,note,item.code,item.name,item.bags,item.quantity,item.totalQty],
            (err,result)=>{ if(err) console.log(err); }
        );
    });
    res.json({message:"Transactions saved"});
});

// Get transactions
router.get('/', (req,res)=>{
    db.query("SELECT * FROM transactions ORDER BY date DESC", (err,result)=>{
        if(err) return res.status(500).send(err);
        res.json(result);
    });
});

module.exports = router;