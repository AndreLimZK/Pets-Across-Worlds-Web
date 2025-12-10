import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestoreDb = getFirestore(app);


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
    get(child(dbRef, 'players'))
        .then(snapshot => {
            if (!snapshot.exists()) {
                showMessage("No data available.");
                return;
            }

            const players = snapshot.val();

            //Find all players whose name contains the search term
            const matches = Object.entries(players).filter(([id, p]) =>
                p.username && p.username.toLowerCase().includes(query.toLowerCase())
            );

            if (matches.length === 0) {
                showMessage(`<p>No players found matching "${query}".</p>`);
                return;
            }

            resultsDiv.innerHTML = "";

            const template = document.getElementById("recordTemplate");

            matches.forEach(([id, p]) => {
                const clone = template.content.cloneNode(true);

                clone.querySelector(".player-name").textContent = p.username;

                const petList = clone.querySelector(".pet-list");

                if (p.pets) {
                    Object.entries(p.pets).forEach(([species, petData]) => {
                        // Parent div for the pet
                        const petDiv = document.createElement("div");
                        petDiv.classList.add("pet-entry");

                        // Pet name line
                        const petNameLine = document.createElement("p");
                        petNameLine.textContent = `${species} - ${petData.petName}`;
                        petDiv.appendChild(petNameLine);

                        // Individual stats lines (vertical)
                        const stats = ["Energy", "Food", "Mood", "Highscore"];
                        stats.forEach(stat => {
                            const statLine = document.createElement("p");
                            statLine.textContent = `${stat}: ${petData[stat.toLowerCase()]}`;
                            statLine.style.marginLeft = "20px"; // optional indentation
                            petDiv.appendChild(statLine);
                        });

                        petList.appendChild(petDiv);
                    });
                } else {
                    petList.textContent = "No pets found.";
                }


                resultsDiv.appendChild(clone);
            });
        })
        .catch((error) => {
            console.error(error);
            showMessage("<p>Error retrieving data. Please try again later.</p>");
        });
});

// Chart.js - Example: Display number of pets per player
async function loadChart() {
    const snapshot = await get(ref(db, "players"));

    if (!snapshot.exists()) {
        console.warn("No players found.");
        return;
    }

    const players = snapshot.val();
    const counts = {};

    // Count pets
    Object.values(players).forEach(player => {
        if (!player.pets) return;

        Object.entries(player.pets).forEach(([petId]) => {
            const species = petId; // or use petData.petName if you want nicknames
            counts[species] = (counts[species] || 0) + 1;
        });
    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    if (labels.length === 0) {
        console.warn("No pet data found to chart.");
        return;
    }

    const chartCanvas = document.getElementById("petsChart");

    // Safe destroy: only call destroy if it's a Chart instance
    if (window.petsChart instanceof Chart) {
        window.petsChart.destroy();
    }

    // Force canvas to fill parent container
    chartCanvas.style.display = "block";
    chartCanvas.style.width = "100%";
    chartCanvas.style.height = "100%";

    // Create new chart
    new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Number of Pets",
                data: values,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // fill the parent div
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Run the function
loadChart();