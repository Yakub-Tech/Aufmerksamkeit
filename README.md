Aufmerksamkeit


Man braucht Docker Desktop auf dem Computer. Docker muss laufen bevor man die Befehle benutzt.






Vorbereitung

Bevor man irgendwas startet muss man einmal die Datei .env anlegen. Dafür kopiert man die Vorlage.

cp .env.example .env

In der .env stehen die Zugangsdaten für die Datenbank. Die Vorlage hat schon Werte drin die zum docker-compose passen, man muss da nichts ändern.






Projekt starten

Man geht mit dem Terminal in den Projektordner. Dann gibt man diesen Befehl ein.

docker compose up --build

Mehr braucht man nicht. Der Befehl baut das Projekt und startet zwei Container. Einen für die Webseite und einen für die Datenbank. Die Tabellen in der Datenbank werden beim Start automatisch angelegt. Beim ersten Mal dauert das ein paar Minuten.








Webseite ansehen

Wenn alles läuft kann man die Webseite im Browser öffnen.

http://localhost:3000

Den Community Bereich findet man unten auf der Seite. Dort kann man einen Beitrag schreiben und absenden. Der Beitrag wird in der Datenbank gespeichert und bleibt auch nach dem Neuladen da.



Projekt stoppen


docker compose down



Die Webseite läuft dann auch unter http://localhost:3000.
