import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

//submit button
document.getElementById('signUpButton').addEventListener('click', (e) => {
    e.preventDefault();
    signUp();

    //inputs
    function signUp() {
        const usernameInput = document.getElementById('username').value;
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        createUserWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(db, 'players/' + user.uid), {
                username: usernameInput,
            });

            alert("Creating Account...");
        })
        .catch((error) => {
            alert(error.message);
        })
    }
});