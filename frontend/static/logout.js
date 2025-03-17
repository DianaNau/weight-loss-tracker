document.getElementById("logout-btn").addEventListener("click", function() {
    fetch(`${apiUrl}/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        window.location.href = "index.html";
    })
    .catch(error => console.error("Fehler beim Logout:", error));
});

