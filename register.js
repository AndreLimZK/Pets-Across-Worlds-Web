import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

//sign up button
const signUpBtn = document.getElementById('signUpButton');
if (signUpBtn) {
    signUpBtn.addEventListener('click', (e) => {
        e.preventDefault();

        //inputs
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
    });
}


//Login button
const signInBtn = document.getElementById('signInButton');
if (signInBtn) {
    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();

        //inputs
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, emailInput, passwordInput)
            .then((userCredential) => {
                const user = userCredential.user;

                alert("Login successful");

                window.location.href = "index.html";
            })
            .catch((error) => {
                alert(error.message);
            })
    });
}