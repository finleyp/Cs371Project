

/**                                                                                                                                          
 * Setup the firebase database and its reference objects.                                                                                    
 */
document.addEventListener("DOMContentLoaded", function () {

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

    //used for current snapshot object
    var snap = null;

    // Create reference to root of database                                                                                                  
    const forumRef = firebase.database().ref().child('forums');
    var homeTable = document.getElementById("home-table");
    var oldBody = document.getElementById("home-body");
    var newBody = document.createElement("TBODY");
    newBody.setAttribute("id", "home-body");
    // Update table when child is added.                                                                                                     
    forumRef.on('child_added', snapshot => {
        console.log("Forum child added.");
        snap = snapshot.key;
        appendRowToBody(snap, snapshot.val(), newBody, false);
    });

    // Update table when child is removed.                                                                                                   
    forumRef.on('child_removed', snapshot => {
        console.log("Forum child removed.");
        console.log(snapshot.key);
        delDiv(snapshot.key);
    });
    //user login
    var user = null;

    
    homeTable.replaceChild(newBody, oldBody);
});

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
        "body": body,
        "op_id": user.id,
        "op_name": user.name
    };
    forumRef.push().set(postObj);
}

/**
 * Lets a user sign in with a google pop up
 */
function googleAuth() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        this.user = result.additionalUserInfo.profile;
    }).catch(function (error) {
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
function loggedIn() {
    if (this.user == null) {
        return false;
    }
    return true;
}


/**
 * signs a user out
 */
function firebaseLogOut() {
    firebase.auth().signOut().then(function () {
        console.log("Sign out successful");
        this.user = null;
    }).catch(function (error) {
        console.log(error);
    });
    v.name = '';
    v.email = '';
    v.pic = null;
    v.id = null;
    let body = document.getElementById("user-body");
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
}

/**
 * Pushes a new user to database
 */
function newUser(user) {
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
function checkUser(user) {
    const rootRef = firebase.database().ref();
    let userRef = rootRef.child("users");
    userRef.orderByChild("email").equalTo(user.email).once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            console.log("Found");
        } else {
            console.log("not found");
            newUser(user);
        }
    });
    v.name = user.name;
    v.email = user.email;
    v.pic = user.picture;
    v.id = user.id;
    userForum();
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
    var resultDiv = document.getElementById("results-div");
    var resultTable = document.getElementById("results-table");
    var oldBody = document.getElementById("result-body");
    var newBody = document.createElement("TBODY");
    newBody.setAttribute("id", "result-body");

    // TODO: Get all posts and search for similar strings in body and titles.
    forumRef.orderByChild("title").startAt(inputStr).endAt(inputStr + "\uf8ff").on("child_added", function (snapshot) {
        snap = snapshot.key;
        appendRowToBody(snap, snapshot.val(), newBody, false);
    });

    resultTable.replaceChild(newBody, oldBody);
    resultDiv.classList.remove('hidden');
}


/**
 * Create a new table row and append to new body.
 * 
 * @param {Object} data 
 */
function appendRowToBody(id, data, newBody, boolean) {

    // Row for search results.
    var row = document.createElement("TR");
    row.setAttribute("id", id);
    newBody.appendChild(row);

    // Data for title of forum.
    var col = document.createElement("TD");
    row.appendChild(col);

    var colText = document.createTextNode(data.op_name);
    col.appendChild(colText);

    // Data for title of forum.
    col = document.createElement("TD");
    row.appendChild(col);

    // Title text in column.
    colText = document.createTextNode(data.title);
    col.appendChild(colText);

    // Data for body of forum.
    col = document.createElement("TD");
    row.appendChild(col);

    // Body text in column.
    colText = document.createTextNode(data.body);
    col.appendChild(colText);

    if (boolean) {
        let del = document.createElement("INPUT");
        let p = document.createElement("p");
        p.setAttribute("class","delete");
        del.setAttribute("class","delete");
        del.setAttribute("type", "button");
        del.setAttribute("value", "DELETE");
        del.addEventListener('click', function(){
            delDB(id);
        });
        p.appendChild(del);
        row.appendChild(p);
    }
}

function delDB(id){
    const rootRef = firebase.database().ref();
    rootRef.child("forums").child(id).remove();  
}

function delDiv(id){
    let row = document.getElementById(id);
    while(row){
    row.parentNode.removeChild(row);
    row = document.getElementById(id);
    }
    
}

function userForum() {
    const rootRef = firebase.database().ref();
    var forumRef = rootRef.child("forums");
    var userTable = document.getElementById("user-table");
    var oldBody = document.getElementById("user-body");
    var newBody = document.createElement("TBODY");
    newBody.setAttribute("id", "user-body");

    // TODO: Get all posts and search for similar strings in body and titles.
    forumRef.orderByChild("op_id").equalTo(v.id).on("child_added", function (snapshot) {
        snap = snapshot.key;
        appendRowToBody(snap, snapshot.val(), newBody, true);
    });

    userTable.replaceChild(newBody, oldBody);
}