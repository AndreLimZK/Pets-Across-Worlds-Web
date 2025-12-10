import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
import {onAuthStateChanged, getAuth} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Footer auth links container
const authLinksDiv = document.getElementById("auth-links");

// Dynamically update footer links based on auth state
onAuthStateChanged(auth, async (user) => {
    authLinksDiv.innerHTML = ""; // Clear previous links

    if (user) {
        // Logged in → show My Profile with username
        try {
            const snapshot = await get(ref(db, `players/${user.uid}`));
            let username = "Player";

            if (snapshot.exists()) {
                const data = snapshot.val();
                username = data.username || "Player";
            }

            const profileLink = document.createElement("a");
            profileLink.href = "profile.html";
            profileLink.textContent = `My Profile (${username})`;
            authLinksDiv.appendChild(profileLink);

        } catch (err) {
            console.error("Error loading username:", err);
            const profileLink = document.createElement("a");
            profileLink.href = "profile.html";
            profileLink.textContent = "My Profile";
            authLinksDiv.appendChild(profileLink);
        }

    } else {
        // Not logged in → show Login / Register
        const loginLink = document.createElement("a");
        loginLink.href = "login.html";
        loginLink.textContent = "Login";

        const registerLink = document.createElement("a");
        registerLink.href = "register.html";
        registerLink.textContent = "Register";

        authLinksDiv.appendChild(loginLink);
        authLinksDiv.appendChild(document.createTextNode(" / "));
        authLinksDiv.appendChild(registerLink);
    }
});
