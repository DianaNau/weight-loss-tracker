// 🌍 Basis-URL für das Backend
const apiUrl = "http://127.0.0.1:8000/api";

// 🔹 Event Listener für das Laden der Seite
document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    loadWeightEntries();  // Gewichtseinträge laden
    loadNotes();          // Notizen laden
    fetchWeightData();    // Diagramm aktualisieren

    // 🔹 Event Listener für Interaktionen
    document.getElementById("save-weight-btn").addEventListener("click", saveWeight);
    document.getElementById("save-notes-btn").addEventListener("click", saveNote);
    document.getElementById("logout-btn").addEventListener("click", logout);
});

// 🔹 Benutzerprüfung (Falls nicht eingeloggt, zurück zum Login)
function checkLoginStatus() {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        window.location.href = "index.html";
    } else {
        const user = JSON.parse(localStorage.getItem("user"));
        document.getElementById("user-name").textContent = user.username;
    }
}

// ✅ Gewicht speichern & Diagramm aktualisieren
function saveWeight() {
    const weightInput = document.getElementById("weight-input").value.trim();
    if (!weightInput) return alert("❌ Bitte ein Gewicht eingeben!");

    const authToken = localStorage.getItem("authToken");

    fetch(`${apiUrl}/weight-entries/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${authToken}`
        },
        body: JSON.stringify({ weight: weightInput })
    })
    .then(response => response.json())
    .then(() => {
        alert("✅ Gewicht gespeichert!");
        document.getElementById("weight-input").value = ""; // Eingabefeld leeren
        loadWeightEntries();  // Neu laden
        fetchWeightData();    // Diagramm aktualisieren
    })
    .catch(error => console.error("❌ Fehler beim Speichern des Gewichts:", error));
}

// ✅ Gewichtseinträge aus dem Backend abrufen & in Tabelle einfügen
function loadWeightEntries() {
    const authToken = localStorage.getItem("authToken");

    fetch(`${apiUrl}/weight-entries/`, {
        method: "GET",
        headers: { "Authorization": `Token ${authToken}` }
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById("weight-history");
        tbody.innerHTML = ""; // Vorherige Einträge entfernen

        if (data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='2'>Noch keine Einträge</td></tr>";
            return;
        }

        // Sortiere nach Datum absteigend
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        data.forEach(entry => {
            const row = `<tr><td>${new Date(entry.date).toLocaleDateString()}</td><td>${entry.weight} kg</td></tr>`;
            tbody.innerHTML += row;
        });

        updateWeeklyAverage(data);  // Durchschnitt berechnen
    })
    .catch(error => console.error("❌ Fehler beim Abrufen der Gewichtsdaten:", error));
}

// ✅ Wöchentlichen Durchschnitt berechnen & anzeigen
function calculateWeeklyAverage(entries) {
    if (entries.length === 0) return "Keine Daten";

    let totalWeight = 0;
    let count = 0;

    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= lastWeek && entryDate <= today) {
            totalWeight += entry.weight;
            count++;
        }
    });

    if (count === 0) return "Keine Daten für letzte Woche";

    return `${(totalWeight / count).toFixed(2)} kg`;
}

function updateWeeklyAverage(entries) {
    const average = calculateWeeklyAverage(entries);
    document.getElementById("weekly-average").textContent = `📊 Wöchentlicher Durchschnitt: ${average}`;
}

// ✅ Gewichtsdaten aus dem Backend abrufen & Diagramm aktualisieren
function fetchWeightData() {
    const authToken = localStorage.getItem("authToken");

    fetch(`${apiUrl}/weight-entries/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${authToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        updateChart(data);
    })
    .catch(error => console.error("❌ Fehler beim Laden der Gewichtsdaten:", error));
}

// ✅ Diagramm mit echten Daten aktualisieren
let weightChart;

function updateChart(weightData) {
    const ctx = document.getElementById("weightChart").getContext("2d");

    const labels = weightData.map(entry => new Date(entry.date).toLocaleDateString("de-DE"));
    const weights = weightData.map(entry => entry.weight);

    if (weightChart) weightChart.destroy(); // Vorheriges Diagramm entfernen

    weightChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Gewicht (kg)",
                data: weights,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Datum" } },
                y: { title: { display: true, text: "Gewicht (kg)" }, beginAtZero: false }
            }
        }
    });
}

// ✅ Notizen speichern, laden, bearbeiten & löschen
function saveNote() {
    const noteInput = document.getElementById("notes").value.trim();
    if (!noteInput) return alert("❌ Bitte eine Notiz eingeben!");

    const date = new Date().toLocaleDateString();
    const notes = JSON.parse(localStorage.getItem("notes")) || {};
    notes[date] = noteInput;

    localStorage.setItem("notes", JSON.stringify(notes));
    alert("✅ Notiz gespeichert!");
    document.getElementById("notes").value = "";
    loadNotes();
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || {};
    const noteList = document.getElementById("note-list");
    noteList.innerHTML = "";

    for (const date in notes) {
        const noteDiv = document.createElement("div");
        noteDiv.innerHTML = `<strong>${date}:</strong> ${notes[date]} 
        <button onclick="editNote('${date}')">✏️</button> 
        <button onclick="deleteNote('${date}')">❌</button>`;
        noteList.appendChild(noteDiv);
    }
}

function editNote(date) {
    const newNote = prompt("Neue Notiz eingeben:", JSON.parse(localStorage.getItem("notes"))[date]);
    if (newNote) {
        const notes = JSON.parse(localStorage.getItem("notes"));
        notes[date] = newNote;
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    }
}

function deleteNote(date) {
    if (confirm("❌ Notiz wirklich löschen?")) {
        const notes = JSON.parse(localStorage.getItem("notes"));
        delete notes[date];
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    }
}

// ✅ Logout-Funktion
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}



