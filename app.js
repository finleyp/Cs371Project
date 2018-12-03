var stack = [];

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
 * Build login HTML.
 */
function login() {
    let div = document.getElementById("login");

    if (!div) {
        div = document.createElement("div");
        div.setAttribute("id", "login");
        stack.push(div);
    } else {
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }

    let h3 = document.createElement("h3");
    let text = document.createTextNode("LOGIN HERE (change me later)");
    h3.appendChild(text);
    div.appendChild(h3);

    let user = document.createElement("text");
    user.setAttribute("placeholder", "Email");
    user.setAttribute("id", "data-email");
    div.appendChild(user);

    let password = document.createElement("password");
    password.setAttribute("placeholder", "Password");
    user.setAttribute("id", "data-password");
    div.appendChild(user);

    let login = document.createElement("input");
    login.setAttribute("type", "button");
    login.setAttribute("value", "Log in");
    login.onclick = filebaseLog;

}


/**
 * 
 * @param {*} ev 
 */
function firebaseLog(ev) {

    let email = document.getElementById('data-email').value;
    let password = document.getElementById('data-password');

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (err) {
            // change div and tell them login failed
        });

    //Sign in existing user
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (err) {
            // change div and tell them login failed
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
    console.log(`input str = ${inputStr}`);
    const rootRef = firebase.database().ref();
    var forumRef = rootRef.child("forums");

    forumRef.orderByChild("title").equalTo(inputStr).on("child_added", function (snapshot) {
        console.log(snapshot.val());
    });

}