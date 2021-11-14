//Points to a div element where user combo will be inserted.
let userDiv;
let addUserResultDiv;

//Set up page when window has loaded
window.onload = init;

//Get pointers to parts of the DOM after the page has loaded.
function init(){
    userDiv = document.getElementById("UserDiv");
    addUserResultDiv = document.getElementById("AddUserResult");
    loadUsers();
}

/* Loads current users and adds them to the page. */
function loadUsers() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            let usrArr = JSON.parse(xhttp.responseText);

            //Return if no users
            if(usrArr.length === 0)
                return;

            //Build string with user data
            let htmlStr = "<table class='table'><tr class='bg-warning'><th class='font-weight-bold'>ID</th><th class='font-weight-bold'>ITEM</th><th class='font-weight-bold'>TIME</th><th class='font-weight-bold'>DATE</th></tr>";
            for(let key in usrArr){
                htmlStr += ("<tr><td>" + key + "</td><td>" + usrArr[key].item + "</td>");
                htmlStr += ("<td>" + usrArr[key].time + "</td><td>" + usrArr[key].date + "</td></tr>");
            }
            //Add users to page.
            htmlStr += "</table>";
            userDiv.innerHTML = htmlStr;
        }
    };

    //Request data from all users
    xhttp.open("GET", "/users", true);
    
    xhttp.send();
}


/* Posts a new user to the server. */
function addUser() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let usrItem = document.getElementById("ItemInput").value;
    let usrTime = document.getElementById("TimeInput").value;
    let usrDate = document.getElementById("DateInput").value;

    //Create object with user data
    let usrObj = {
        item: usrItem,
        time: usrTime,
        date: usrDate
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           addUserResultDiv.innerHTML = "Item added in the shopping list";
        }
        else{
            addUserResultDiv.innerHTML = "<span style='color: red'>Error adding Item</span>.";
        }
        //Refresh list of users
        loadUsers();
        $(document).ready(function(){
            $("#<BUTTONIDNAMEHERE>").click(function(){
                addUser();
              });
          });
    };

    //Send new user data to server
    xhttp.open("POST", "/users", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(usrObj) );
}

 