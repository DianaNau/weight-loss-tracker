# Weight Loss Tracker
🏋️‍♂️ Weight Loss Tracker
📌 Web-App zum Tracken von Gewichtsdaten mit Statistiken & Diagrammen



🚀 Funktionen
✅ Gewichtseinträge speichern & automatisch im Diagramm anzeigen
✅ Wöchentlicher Durchschnitt zur besseren Nachverfolgung
✅ Dynamische Diagramme mit Chart.js zur Visualisierung des Fortschritts
✅ Notizenfunktion, um Gedanken & Änderungen festzuhalten
✅ Dark Mode, um das Design individuell anzupassen
✅ Benutzeranmeldung & Authentifizierung mit Django

🛠️ Technologien
Backend: Django & Django Rest Framework (DRF)
Frontend: HTML, CSS, JavaScript
Datenbank: SQLite
Diagramme: Chart.js


sh
Kopieren
git clone https://github.com/dein-github-username/weight_loss_tracker.git
cd weight_loss_tracker
2️⃣ Virtuelle Umgebung erstellen & aktivieren
sh
Kopieren
python -m venv venv
venv\Scripts\activate  # Windows
3️⃣ Abhängigkeiten installieren
sh
Kopieren
pip install -r requirements.txt
4️⃣ Datenbank migrieren
sh
Kopieren
python manage.py migrate
5️⃣ Superuser erstellen (für Django Admin)
sh
Kopieren
python manage.py createsuperuser
6️⃣ Server starten
sh
Kopieren
python manage.py runserver
Nun kannst du die App unter http://127.0.0.1:8000/ aufrufen.

🖥️ API Endpunkte
Methode	Endpoint	Beschreibung
POST	/api/register/	Benutzer registrieren
POST	/api/login/	Login mit Token-Authentifizierung
GET	/api/weight-entries/	Alle Gewichtseinträge abrufen
POST	/api/weight-entries/	Neues Gewicht speichern
POST	/api/logout/	Logout & Token löschen
👨‍💻 Entwickler
📌 Diana Naumovic – Entwicklerin
🚧 Work in Progress: Dieses Projekt ist noch nicht final – ich arbeite aktiv daran, neue Features hinzuzufügen und bestehende zu verbessern.
Falls du Fragen oder Feedback hast, schreib mir gerne! ✉️
