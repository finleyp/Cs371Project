

/**                                                                                                                                          
 * Setup the firebase database and its reference objects.                                                                                    
 */
(function () {

    // Initialize Database                                                                                                                   
    var config = {
        apiKey: "AIzaSyBFkmGeQ0atLiNQFPtVpQpUBeQGnCPI1Fo",
        authDomain: "cis-371-forum.firebaseapp.com",
        databaseURL: "https://cis-371-forum.firebaseio.com",
        projectId: "cis-371-forum",
        storageBucket: "cis-371-forum.appspot.com",
        messagingSenderId: "846182067183"
    };
    firebase.initializeApp(config);

    // Create reference to root of database                                                                                                  
    const forumRef = firebase.database().ref().child('forums');

    // Update table when child is added.                                                                                                     
    forumRef.on('child_added', snapshot => {
        console.log("Forum child added.");
    });

    // Update table when child is removed.                                                                                                   
    forumRef.on('child_removed', snapshot => {
        console.log("Forum child removed.");
    });

    var user = null;
    
}());


/**
 * Build the forum creation page.
 */
function forumPage() {
    console.log("forums");
    var forumDiv = document.getElementById("new-forum");
    // TODO: Hide all other divs with elements that need to be hidden.
    forumDiv.classList.remove('hidden');
}


function submitPost(title, body) {
    // console.log(`title: ${title} \t body: ${body}`);
    const rootRef = firebase.database().ref();
    var forumRef = rootRef.child("forums");
    var postObj = {
        "title": title,
        "body": body
    };
    forumRef.push().set(postObj);
}

/**
 * Lets a user sign in with a google pop up
 */
function googleAuth(){
    var provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
        this.user = result.additionalUserInfo.profile;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
      }).then((e) => (checkUser(this.user)));
}

/**
 * returns if the user is signed in or not
 */
function loggedIn(){
    if(this.user == null){
        return false;
    }
    return true;
}


/**
 * signs a user out
 */
function firebaseLogOut(){
    firebase.auth().signOut().then(function() {
        console.log("Sign out successful");
        this.user = null;
      }).catch(function(error) {
        console.log(error);
      });
}

/**
 * Pushes a new user to database
 */
function newUser(user){
    const rootRef = firebase.database().ref();
    let userRef = rootRef.child("users");
    let userInfo = {
        "user": user.name,
        "email": user.email,
        "id": user.id,
        "pic": user.picture
    };
    userRef.push(userInfo);
}

/**
 * checks to see if a user exist yet
 */
function checkUser(user){
    const rootRef = firebase.database().ref();
    let userRef = rootRef.child("users");
    console.log("here");
    userRef.orderByChild("email").equalTo(user.email).once("value").then(function (snapshot){
        if(snapshot.exists()){
            console.log("Found");
        }else{
            console.log("not found");
            newUser(user);
        }
    });
    
}

/**
 * Build the home HTML.
 */
function home() {
    let div = document.getElementById("home");

    if (!div) {
        div = document.createElement("div");
        div.setAttribute("id", "home");
        body.appendChild(div);
        stack.push(div);

    } else {
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }

}


/**
 * Search for a forum in Firebase by string.
 * 
 * @param {string} inputStr
 */
function searchForForum(inputStr) {
    const rootRef = firebase.database().ref();
    var forumRef = rootRef.child("forums");

    forumRef.orderByChild("title").equalTo(inputStr).on("child_added", function (snapshot) {
        populateResultsTable(snapshot.val());
    });

}


/**
 * Put result data into table.
 * 
 * @param {Object} data 
 */
function populateResultsTable(data) {
    console.log(data);
    var resultDiv = document.getElementById("results-div");
    resultDiv.classList.remove('hidden');

    var resultTable = document.getElementById("results-table");
    var tmpRow = document.createElement("TR");
    resultTable.appendChild(tmpRow);

    var tmpCol = document.createElement("TD");
    tmpRow.appendChild(tmpCol);
    var colText = document.createTextNode(data.title);
    tmpCol.appendChild(colText);

    tmpCol = document.createElement("TD");
    tmpRow.appendChild(tmpCol);
    colText = document.createTextNode(data.body);
    tmpCol.appendChild(colText);
}