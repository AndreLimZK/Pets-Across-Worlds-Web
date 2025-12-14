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

        if (!usernameInput) {
            alert("Username cannot be empty.");
            return;
        }

        if (usernameInput.length < 3) {
            alert("Username must be at least 3 characters long.");
            return;
        }

        if (!/^[a-zA-Z0-9_ ]+$/.test(usernameInput)) {
            alert("Username can only contain letters, numbers, and underscores.");
            return;
        }

        createUserWithEmailAndPassword(auth, emailInput, passwordInput)
            .then((userCredential) => {
                const user = userCredential.user;

                return set(ref(db, `players/${user.uid}`), {
                    username: usernameInput,
                    pets: {}
                });
            })
            .then(() => {
                alert("Signup successful");
                window.location.href = "index.html";
            })
            .catch((error) => {

                if (error.code === "auth/invalid-email") {
                    alert("Please enter a valid email address.");
                    return;
                }

                if (error.code === "auth/email-already-in-use") {
                    alert("This email is already registered.");
                    return;
                }

                if (error.code === "auth/weak-password") {
                    alert("Password must be at least 6 characters long.");
                    return;
                }

                console.error(error);
                alert("Signup failed. Please try again.");
            });
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
                alert("Email or Password is incorrect. Try again.");
            })
    });
}

// Home button
const homeButton = document.getElementById("homeButton");

homeButton.addEventListener("click", () => {
    window.location.href = "index.html"; // navigate to home page
});