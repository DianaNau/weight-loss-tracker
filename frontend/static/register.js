// Basis-URL für das Backend
const apiUrl = "http://127.0.0.1:8000/api"; 

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", register);
    } else {
        console.error("❌ Fehler: Registrierungsformular nicht gefunden!");
    }
});

// Registrierungs-Funktion
function register(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageElement = document.getElementById("register-message");
    const errorElement = document.getElementById("register-error");

    if (!username || !email || !password) {
        errorElement.textContent = "❌ Alle Felder müssen ausgefüllt sein!";
        errorElement.style.display = "block";
        return;
    }

    fetch(`${apiUrl}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 201) {
            messageElement.textContent = "✅ Registrierung erfolgreich! Weiterleitung...";
            messageElement.style.display = "block";
            errorElement.style.display = "none";
            setTimeout(() => { window.location.href = "index.html"; }, 3000);
        } else {
            errorElement.textContent = body.error || "❌ Registrierung fehlgeschlagen!";
            errorElement.style.display = "block";
        }
    })
    .catch(error => {
        errorElement.textContent = "❌ Netzwerkfehler. Bitte später erneut versuchen.";
        errorElement.style.display = "block";
        console.error("Fehler bei der Registrierung:", error);
    });
}

