# Komponentenplanung


Hier halte ich fest, welche Komponenten ich für die Seite plane
und was jede davon machen soll. Die Liste dient mir als Orientierung beim Bauen.


Navbar - das ist die Navigation ganz oben auf der Seite mit dem Logo und den Links.

HeroSection - der obere Bereich der Seite wo die grosse Überschrift "Aufmerksamkeit" steht und der Button.

AttentionTestSection - der Bereich in der Mitte wo mein Test rein soll. Da ist dann das Quiz drin.

Quiz - zeigt die Fragen nacheinander an. Man soll eine Antwort anklicken können und die wird dann farbig markiert.

AttentionMechanics - das sollen Fake Pop Ups und Benachrichtigungen sein die man neben dem Quiz sieht. Die sollen ablenken, passt ja zum Thema.

ProgressIndicator - zeigt an wie viele Fragen man schon beantwortet hat (so ein Balken).

EvaluationSection - wenn man mit dem Quiz fertig ist kommt hier die Auswertung.

StatisticsSection - Bereich mit Statistiken und Zahlen zum Thema. Da sollen 3 Cards drin sein.

Card - eine einfache Karte mit Titel und Text drin. Die möchte ich an mehreren Stellen verwenden.

LearningSection - Tipps und eine FAQ. Man soll auf einen Tipp klicken können und dann klappt der Text auf.

CommunitySection - Bereich wo man einen eigenen Post schreiben kann und andere Posts sieht.

Button - den Button möchte ich überall verwenden. Es soll 3 Varianten geben: schwarz mit Pfeil, durchsichtig mit Rand, oder nur Text.

Footer - ganz unten. Da soll das Impressum direkt drin stehen.


Welche Props die Komponenten kriegen sollen (also was man ihnen von aussen geben kann):

Navbar kriegt ein logo und die menuItems aber beide haben einen default, also man muss nichts geben.
Quiz kriegt onProgressChange damit es nach oben melden kann wie weit man ist.
ProgressIndicator kriegt currentStep und totalSteps.
Card kriegt title und description.
Button kriegt label, onClick und optional variant.
Die anderen Komponenten kriegen nichts, die sind einfach wie sie sind.


So soll alles untereinander angeordnet sein in page.tsx:

Navbar
HeroSection
AttentionTestSection (da drin sollen ProgressIndicator, AttentionMechanics und Quiz sein)
EvaluationSection
StatisticsSection (da drin sollen 3 Cards sein)
LearningSection
CommunitySection
Footer


Weitere Planung:

page.tsx soll einfach bleiben. Dort importiere ich die Sections
und ordne sie untereinander an. Fast keine Props sollen da reingegeben werden.

AttentionMechanics soll nicht echt animiert sein, das werden einfach Karten
die so aussehen als wären das Benachrichtigungen. Das reicht mir für diesen Entwurf.

Bei CommunitySection sollen die neuen Posts nur im State gespeichert werden.
Beim Neuladen wären sie wieder weg. Ein Backend plane ich erst
für eine spätere Abgabe.
