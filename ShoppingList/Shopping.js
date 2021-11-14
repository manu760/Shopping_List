//Import the express and body-parser modules, mysql module
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());
app.use('/css', express.static('node_modules/bootstrap/dist/css'));
app.use('/js', express.static('node_modules/bootstrap/dist/js'));
app.use('/js', express.static('node_modules/jquery/dist'));


//Set up express to serve static files from the directory called 'public'
app.use(express.static('public'));

//Data structure that will be accessed using the web service
let userArray = [];

//Set up application to handle GET requests sent to the user path
app.get('/users/*', handleGetRequest);//Returns user with specified ID
app.get('/users', handleGetRequest);//Returns all users

//Set up application to handle POST requests sent to the user path
app.post('/users', handlePostRequest);//Adds a new user



//Start the app listening on port 8080
app.listen(8080);

//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    port: 3306,
    user: "root",
    database: "Coursework3",
    debug: false
});

//Handles GET requests to our web service
function handleGetRequest(request, response) {
    userArray = [];
    let userArrayFromMySQL = "";

    /* Outputs all of the shopping */
    //Build query
    let sql = "SELECT * FROM shopping";

    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err) {//Check for errors
            console.error("Error executing query: " + JSON.stringify(err));
        }
        else {//Output results in JSON format - a web service would return this string.

            for (let i = 0; i < result.length; i++) {
                //set up usr objects
                let usrObject =
                {
                    id: result[i].id,
                    item: result[i].item,
                    time: result[i].time,
                    date: result[i].date,
                    checked: result[i].checked
                }
                userArray.push(usrObject);
               }
        }

        //Split the path of the request into its components
        var pathArray = request.url.split("/");

        //Get the last part of the path
        var pathEnd = pathArray[pathArray.length - 1];

        //If path ends with 'todo' we return all users
        if (pathEnd === 'users') {
            response.send(userArray);
        }

        //If the last part of the path is a valid user id, return data about that user
        else if (pathEnd in userArray) {
            response.send(userArray[pathEnd]);
        }

        //The path is not recognized. Return an error message
        else
            response.send("{error: 'Path not recognized'}");
    });

}

//Handles POST requests to our web service
function handlePostRequest(request, response) {

    //Output the data sent to the server
    let newUser = request.body
    console.log("Data received: " + JSON.stringify(newUser));


    //Add user to our data structure
    userArray.push(newUser);

    //Finish off the interaction.
    response.send("Items  added successfully.");

    //Build query
    let sql = "INSERT INTO shopping ( item, time,date)"
        + " VALUES ( \"" + request.body.item
        + "\", \"" + new Date().toLocaleString('en-US', { timeZone: 'GB-Eire' }).substr(10) + "\",\""
        + request.body.date + "\" )";

    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err) {
            //Check for errors
            console.error("Error executing query: " + JSON.stringify(err));
        }
        else {
            console.log(JSON.stringify(result));
        }
    });
}




