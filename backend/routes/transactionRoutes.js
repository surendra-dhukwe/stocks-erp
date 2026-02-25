const express = require('express');
const router = express.Router();

const db = require('../db');

router.post("/", async (req,res)=>{

try{

const { type, items } = req.body;

for(const item of items){

await db.query(

`INSERT INTO transactions
(code,name,total_quantity,type,entry_date)
VALUES (?,?,?,?,NOW())`,

[
item.code,
item.name,
item.totalQty,
type
]

);

}

res.json({

message:"Transaction Saved Successfully"

});

}

catch(err){

console.log(err);

res.status(500).json({

message:"Database Error"

});

}

});

module.exports = router;