const express = require('express');
const router = express.Router();

const db = require('../db');


/* GET ALL PRODUCTS */

router.get('/', async (req,res)=>{

try{

const [rows] = await db.query(

"SELECT code,name FROM products_master ORDER BY code"

);

res.json(rows);

}

catch(err){

console.log(err);

res.status(500).send("Database Error");

}

});



/* ADD PRODUCT */

router.post('/', async (req,res)=>{

try{

const {code,name} = req.body;

await db.query(

"INSERT INTO products_master(code,name) VALUES(?,?)",

[code,name]

);

res.json({

message:"Product Added"

});

}

catch(err){

console.log(err);

res.status(500).send("Insert Error");

}

});


module.exports = router;