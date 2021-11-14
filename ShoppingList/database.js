//Import the mysql module and create a connection pool with user details
const mysql = require('mysql');
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "root",
   
    database: "Coursework3",
    debug: false
});

//Gets all customers
exports.getAllCustomers = (response) => {
    //Build query
    let sql = "SELECT * FROM shopping";

    //Execute query 
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Return results in JSON format 
            //console.log(JSON.stringify(result));
            response.send(JSON.stringify(result))
        }
    });
};



