Design Notizen


Hier schreibe ich auf wie meine Seite aussehen soll. An das halte ich
mich dann beim Programmieren.


Logo:

Ich habe kein richtiges Bildlogo sondern nur den Schriftzug
"Aufmerksamkeit." in der Serif Schrift. Davor kommt ein kleines
orangenes Quadrat (8 mal 8 Pixel, leicht abgerundet). Der Punkt am
Ende ist kursiv und auch in dem Orange.
In der Navbar ist der Schriftzug 20 Pixel gross, im Footer 18 Pixel.
Schutzraum: rundherum mindestens so viel Platz wie das grosse A hoch
ist. Kleiner als 16 Pixel Schrift soll das Logo nie werden.

Favicon ist 32 mal 32 Pixel. Ich mache es als ico und nochmal als png
in 32 und 16. Da kommt aber nur das orangene Quadrat rein, ohne
Schriftzug, weil das in 32 Pixel sowieso nicht lesbar wäre. Liegt unter
app/favicon.ico.


Schrift:

Headlines mache ich in Instrument Serif (von Google Fonts). Normaler
Text ist Inter, auch von Google Fonts. Für die kleinen Labels in
Grossbuchstaben nehme ich JetBrains Mono. Alles ist schon über
next/font/google in app/layout.tsx eingebunden.

Die Strichstärken die ich brauche:
- Instrument Serif: 400 (normal und kursiv)
- Inter: 400, 500, 600, 700
- JetBrains Mono: 400, 500

Grössen ungefähr so:
H1 oben im Hero ist auf dem Handy 48 Pixel, auf dem Computer 104 Pixel.
H2 ist 36 Pixel auf dem Handy, 60 Pixel auf dem Computer.
H3 ist je nachdem 24 bis 30 auf dem Handy und 36 bis 48 auf dem Computer.
Normaler Body Text ist 16 Pixel auf dem Handy und 18 auf dem Computer,
kleinerer Body ist überall 14. Die Mono Labels sind 11 Pixel.
Line Height bei den Headlines ungefähr 1.0 bis 1.2, beim Body 1.6.

Die kleinen Labels schreibe ich in GROSSBUCHSTABEN mit weitem
Buchstabenabstand (uppercase tracking-widest in Tailwind).


Farben:

Hintergrund ist ein helles Beige, nicht ganz weiss: #F5F1EA.
Etwas dunkleres Beige für Karten und so: #EEE7DB.
Rahmen sind in #D9D2C3.
Als Akzentfarbe nehme ich das Orange #D64D1E. Damit mache ich das
Wort Aufmerksamkeit bunt und ein paar andere Sachen die auffallen
sollen. Es gibt noch einen ganz hellen Tint davon (#F9EEE6) für
Hover und ausgewählte Optionen.

Text ist fast schwarz: #0F0F0E. Etwas weicher: #2A2A28. Für kleine
Infos die nicht so wichtig sind nehme ich grau, also #6B6860, und
auf dunklem Hintergrund #8C8A82. Wenn Text auf einem schwarzen Block
liegt nehme ich das Background-Beige #F5F1EA.

Functional Colors für später falls ich so etwas wie Erfolgs- oder
Fehlermeldungen brauchen:
- Success (gut gelaufen): #3F7A4E
- Warning (Achtung): #C9852A
- Danger (Fehler): #B83A2A
- Info (nur ein Hinweis): #3F6A93


Bilder:

Fotos benutze ich aktuell gar nicht im Wireframe. Wenn ich später doch
welche brauchen sollen die warm wirken, eher gedämpft, mit viel
Tageslicht. Motive eher Hände, Bildschirme, Alltagsszenen mit Geräten.
Ich würde die von Unsplash holen (unsplash.com) oder Pexels
(pexels.com).

Illustrationen kommen im Wireframe auch nicht vor. Falls doch, wären
die flach und im Linien-Stil, nur Schwarz und das Orange, kein 3D und
keine Verläufe. Quellen wären eigene SVGs oder unDraw (undraw.co).

Da wo später ein Bild hin soll mache ich aktuell einen Kasten in
Surface-Beige mit dem dünnen Rahmen drum und schreiben "Bild hier"
oder "Abbildung hier" rein.


Icons:

Stil ist Outline, also nur Linien, keine ausgefüllten. Strichstärke 2.
Ich habe gar kein Icon Paket installiert sondern machen die Icons
einfach als SVG direkt im Code. Falls ich doch mal mehr brauche
würde ich Lucide (lucide.dev) nehmen oder Google Material Symbols
Outlined (fonts.google.com/icons).

Format ist SVG, entweder direkt im Code oder aus dem public Ordner.
Standardgrössen die ich verwende sind 14, 16, 20 oder 24 Pixel.

Aktuell habe ich im Wireframe nur ganz wenige Icons:
- Den Pfeil rechts im Button
- Das Hamburger Menü in der Navbar (sind nur 3 CSS Striche)
- Plus und Minus zum Aufklappen, das mache ich aber als normale
  Textzeichen + und -, nicht als SVG
- Das kleine orangene Quadrat vor dem Logo


Bildformate und technische Sachen:

JPEG nehme ich für Fotos. PNG für Screenshots oder wenn ich
Transparenz brauchen. SVG für Logo, Icons und Illustrationen. WebP
ist das Standardformat das next/image automatisch ausliefert wenn ich
die <Image> Komponente benutzen.

Bildgrössen je nach Einsatz:
- Hintergrundbilder gross, also 1920 mal 1080
- Header Bilder 1024 mal 576
- Inline Bilder ca. 800 Pixel breit, Höhe egal
- Logo zur Anzeige ca. 200 mal 60
- Favicon 32 mal 32

Retina: next/image macht das automatisch und liefert schon srcset mit
1x und 2x. Wenn ich doch mal ein normales <img> verwenden schreiben
ich das selber rein, also srcset="bild.jpg 1x, bild@2x.jpg 2x".

Alt Text: jedes Bild das Inhalt zeigt bekommt ein alt Attribut. Wenn
ein Bild rein deko ist lasse ich alt leer (alt=""). Ich schreibe
nicht "Bild von..." sondern beschreiben direkt was zu sehen ist.


Grid:

Ich denke in 12 Spalten. Die Seite ist nie breiter als 1280 Pixel
(max-w-7xl mx-auto in Tailwind). Links und rechts neben dem Container
lasse ich Platz, auf dem Handy 16 Pixel, auf dem Tablet 32 und auf
dem Computer 48. Zwischen Spalten kommen 24 Pixel Abstand (gap-6).
Oben und unten bei jeder Section nehme ich 64 Pixel auf dem Handy
und 96 auf dem Computer.


Buttons:

Die sollen rund sein also nicht eckig. Schwarz mit weisser Schrift.
Beim Drüberhovern wird der Hintergrund orange. Rechts neben dem Text
kommt noch ein kleiner Pfeil. Den Pfeil mache ich einfach als SVG
direkt im Code, also kein extra Paket installieren. Padding ist 16
Pixel oben und unten und 24 links und rechts.


Navigation oben:

Bleibt beim Scrollen oben kleben, Hintergrund ist das Beige mit etwas
Durchsichtigkeit und einem leichten Blur dahinter. Unten eine dünne
Trennlinie in der Rahmenfarbe. Die Links sind nur Text, beim Drüber-
hovern wird die Schriftfarbe orange.


Karten (Card Komponente):

Nichts übertriebenes. Einfach ein dünner Rand drum (#D9D2C3),
abgerundete Ecken (16 Pixel), Hintergrund entweder das normale Beige
oder das etwas dunklere. Kein Schatten und auch keine bunte Fläche.


Kleine Info Boxen:

An manchen Stellen will ich so kleine Boxen zeigen mit Texten wie
"03:42 SCROLL" oder "FOCUS BROKEN". Da kommt ein dünner schwarzer
Rand drum und der Text ist in JetBrains Mono in Grossbuchstaben,
ungefähr 10 oder 11 Pixel.


Breite der Seite:

Auf dem Computer soll die Seite nicht die ganze Bildschirmbreite
nutzen sondern in der Mitte bleiben damit man es noch gut lesen kann.
Ich nehme dafür max-w-7xl mx-auto von Tailwind. Oben und unten bei
jeder Section soll ordentlich Platz sein.


