const mysql = require('mysql2');

const db = mysql.createPool({

host:'localhost',
user:'root',
password:'surendra@123',
database:'stock'

});

module.exports = db.promise();