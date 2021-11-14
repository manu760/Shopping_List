//Database code that we are testing
let db = require('../database');

//Server code that we are testing
let server = require ('../Shopping')

//Set up Chai library 
let chai = require('chai');
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;

//Set up Chai for testing web service
let chaiHttp = require ('chai-http');
chai.use(chaiHttp);

//Import the mysql module and create a connection pool with the user details
const mysql = require('mysql');
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "root",
    database: "Coursework3",
    debug: false
});

//Wrapper for all database tests
describe('Database', () => {

    //Mocha test for getAllCustomers method in database module.
    describe('#getItems', () => {
        it('should return all of the items in the database', (done) => {
            //Mock response object for test
            let response= {};

            /* When there is an error response.staus(ERROR_CODE).json(ERROR_MESSAGE) is called
               Mock object should fail test in this situation. */
            response.status = (errorCode) => {
                return {
                    json: (errorMessage) => {
                        console.log("Error code: " + errorCode + "; Error message: " + errorMessage);
                        assert.fail("Error code: " + errorCode + "; Error message: " + errorMessage);
                        done();
                    }
                }
            };

            //Add send function to mock object
            response.send = (result) => {
                //Convert result to JavaScript object
                let resObj = JSON.parse(result);

                //Check that an array of customers is returned
                resObj.should.be.a('array');

                //Check that appropriate properties are returned
                if(resObj.length > 1){
                    resObj[0].should.have.property('item');
                    resObj[0].should.have.property('time');
                    resObj[0].should.have.property('date');
                }

                //End of test
                done();
            }

            //Call function that we are testing
            db.getAllCustomers(response);
        });
    });

});