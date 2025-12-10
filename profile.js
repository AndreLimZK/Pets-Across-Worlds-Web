import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const welcomeMessage = document.getElementById("welcomeMessage");
const petList = document.getElementById("petList");

const homeButton = document.getElementById("homeButton");
const signOutButton = document.getElementById("signOutButton");

// Home button click
homeButton.addEventListener("click", () => {
    window.location.href = "index.html"; // navigate to home page
});

// Sign Out button click
signOutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Signed out successfully!");
        window.location.href = "index.html"; // redirect after sign out
    } catch (err) {
        console.error("Sign out error:", err);
    }
});

// Load user profile
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        welcomeMessage.textContent = "Please sign in first!";
        petList.innerHTML = "";
        return;
    }

    // Display email or username
    try {
        const snapshot = await get(ref(db, `players/${user.uid}`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            const username = data.username || "Player";
            welcomeMessage.textContent = `Welcome, ${username}!`;

            petList.innerHTML = "";

            if (data.pets) {
                Object.entries(data.pets).forEach(([species, pet]) => {
                    const li = document.createElement("li");
                    li.textContent = `${species} - ${pet.petName}`;
                    // Optionally add stats vertically
                    const stats = document.createElement("ul");
                    stats.innerHTML = `
                                <li>Energy: ${pet.energyLevel}</li>
                                <li>Food: ${pet.foodLevel}</li>
                                <li>Mood: ${pet.moodLevel}</li>
                                <li>Highscore: ${pet.highscore}</li>
                            `;
                    li.appendChild(stats);
                    petList.appendChild(li);
                });
            } else {
                petList.textContent = "You have no pets yet!";
            }

        } else {
            welcomeMessage.textContent = "Profile not found!";
            petList.innerHTML = "";
        }
    } catch (err) {
        console.error("Error loading profile:", err);
    }
});