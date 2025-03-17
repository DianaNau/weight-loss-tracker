// Basis-URL für das Backend
const apiUrl = "http://127.0.0.1:8000/api"; 

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", login);
    } else {
        console.error("❌ Fehler: Login-Formular nicht gefunden!");
    }
});

// Login-Funktion
function login(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const errorElement = document.getElementById("login-error");

    // 🔹 Fehlermeldung zurücksetzen
    errorElement.textContent = "";
    errorElement.style.display = "none";

    if (!username || !password) {
        errorElement.textContent = "❌ Benutzername und Passwort erforderlich!";
        errorElement.style.display = "block";
        return;
    }

    fetch(`${apiUrl}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })  // ✅ Benutzername verwenden
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        console.log("🔍 Antwort vom Server:", body);

        if (status === 200 && body.token) {
            // ✅ Erfolgreiches Login
            localStorage.setItem("authToken", body.token);
            localStorage.setItem("user", JSON.stringify(body.user));

            console.log("✅ Login erfolgreich! Versuche, zum Dashboard weiterzuleiten...");

            // 🔹 Weiterleitung zum Dashboard
            setTimeout(() => {
                window.location.href = "../templates/dashboard.html"; 
            }, 1);
        } else {
            errorElement.textContent = body.error || "❌ Anmeldung fehlgeschlagen!";
            errorElement.style.display = "block";
        }
    })
    .catch(error => {
        errorElement.textContent = "❌ Netzwerkfehler. Bitte später erneut versuchen.";
        errorElement.style.display = "block";
        console.error("❌ Fehler beim Login:", error);
    });
}
