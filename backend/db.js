const mysql = require('mysql2');

const db = mysql.createPool({

host:'localhost',
user:'root',
password:'surendra@123',
database:'stock',

waitForConnections:true,
connectionLimit:10

});

module.exports = db.promise();