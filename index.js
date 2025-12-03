import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');

function showMessage(msg) {
    resultsDiv.innerHTML = `<p>${msg}</p>`;
}

//When user clicks search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        showMessage("<p>Please enter a search term.</p>");
        return;
    }

    const dbRef = ref(db);

    //Search by player name
    get(child(dbRef, 'players')).then((snapshot) => {
        if (snapshot.exists()) {
            const players = snapshot.val();
            console.log(players);

            //Find all players whose name contains the search term
            const matches = Object.entries(players).filter(([id, p]) =>
                p.username && p.username.toLowerCase().includes(query.toLowerCase())
            );

            if (matches.length > 0) {
                resultsDiv.innerHTML = "";

                const template = document.getElementById("recordTemplate");

                matches.forEach(([id, p]) => {
                    const clone = template.content.cloneNode(true);

                    clone.querySelector(".player-name").textContent = p.username;

                    const petList = clone.querySelector(".pet-list");

                    if (p.pets) {
                        Object.entries(p.pets).forEach(([petId, petData]) => {
                            const petLine = document.createElement("p");
                            petLine.textContent = `${petId} - ${petData.petName}`;
                            petList.appendChild(petLine);
                        });
                    } else {
                        petList.textContent = "No pets found.";
                    }

                    resultsDiv.appendChild(clone);
                });

            } else {
                showMessage(`<p>No players found matching "${query}".</p>`);
            }
        } else {
            showMessage("<p>No data available.</p>");
        }
    })
        .catch((error) => {
            console.error(error);
            showMessage("<p>Error retrieving data. Please try again later.</p>");
        });
});