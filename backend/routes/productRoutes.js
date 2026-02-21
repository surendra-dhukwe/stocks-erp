const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', (req,res)=>{
    db.query("SELECT * FROM products", (err,result)=>{
        if(err) return res.status(500).send(err);
        res.json(result);
    });
});

// Add product
router.post('/', (req,res)=>{
    const {code,name} = req.body;
    db.query("INSERT INTO products(code,name) VALUES(?,?)",[code,name], (err,result)=>{
        if(err) return res.status(500).send(err);
        res.json({message:"Product added"});
    });
});

module.exports = router;