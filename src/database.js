const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    // TODO: Add your MYSQL user and password
    user: "",
    password: "",
    database: "VEMDECARONA"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("MYSQL connected!");
});