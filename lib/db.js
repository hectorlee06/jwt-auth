// lib/db.js

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hector',
  database: 'jwt-auth',
  password: 'hector123'
});

connection.connect();
module.exports = connection;
