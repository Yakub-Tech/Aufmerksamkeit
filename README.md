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



Bildmaterial

Hero-Illustration (public/hero.jpg). Beschreibung der Illustration:

Minimalistische editoriale Hero-Illustration zum Thema Aufmerksamkeitsökonomie im Stil eines modernen Zeitungsmagazins. Warme Beige- und Sandtöne, ruhige cineastische Lichtstimmung, viel negativer Raum auf der linken Seite für große Typografie und CTA-Elemente. Unten rechts liegt ein schwarzes Smartphone auf einer neutralen Oberfläche. Aus dem Smartphone entsteht ein abstrakter Wirbel aus schwebenden Social-Media-Fragmenten, Benachrichtigungen, UI-Elementen und digitalen Partikeln, die wie ein endloser Scroll-Sog nach oben ziehen. Sehr reduzierte, elegante Komposition, keine Menschen, keine grellen Farben, hochwertige Art-Direction, subtiler Orange-Akzent passend zu Editorial-Webdesign, atmosphärisch, modern, clean, sophisticated, magazine aesthetic, shallow depth of field, soft shadows, cinematic minimalism
