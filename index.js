import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCrJL5Wf2aYbJxraIil_Yz9TfTsimASnjs",
    authDomain: "petsacrossworlds.firebaseapp.com",
    databaseURL: "https://petsacrossworlds-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "petsacrossworlds",
    storageBucket: "petsacrossworlds.firebasestorage.app",
    messagingSenderId: "247220418271",
    appId: "1:247220418271:web:723622892e38f0e4ac9b6a",
    measurementId: "G-YJXMNE9CY6"
};

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');

//When user clicks search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
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
                resultsDiv.innerHTML = matches.map(([id, p]) => `
                    <div class="record">
                        <strong>ID:</strong> ${id}<br>
                        <strong>Name:</strong> ${p.username}<br>
                        ${p.pets ? `<strong>Pets:</strong> ${Object.keys(p.pets).join(",")}` : ""}
                    </div>
                    `
                )
                    .join("");
            } else {
                resultsDiv.innerHTML = `<p>No players found matching "${query}".</p>`;
            }
        } else {
            resultsDiv.innerHTML = "<p>No data available.</p>";
        }
    })
        .catch((error) => {
            console.error(error);
            resultsDiv.innerHTML = "<p>Error retrieving data. Please try again later.</p>";
        });
});