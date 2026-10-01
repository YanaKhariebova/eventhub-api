# EventHub API – Projektplan

## 1. Projektziel

EventHub ist eine REST-API für kostenlose Veranstaltungen. Sie soll einen
einfachen öffentlichen Veranstaltungskatalog bereitstellen und angemeldeten
Benutzern ermöglichen, eigene Veranstaltungen zu verwalten sowie sich für
fremde Veranstaltungen an- und abzumelden.

Die API wird als Backend-Modulabschlussprojekt entwickelt. Der Schwerpunkt
liegt auf einem verständlichen REST-Design, dauerhafter Datenspeicherung,
Authentifizierung, besitzbasierter Autorisierung, Eingabevalidierung,
automatisierten Tests und sicherem Deployment.

## 2. Zielgruppe

- Besucher, die kostenlose Veranstaltungen suchen und ansehen möchten
- Angemeldete Benutzer, die Veranstaltungen organisieren möchten
- Angemeldete Benutzer, die sich für Veranstaltungen registrieren möchten
- Entwickler, die später einen Browser- oder mobilen Client anbinden möchten

## 3. Umfang der ersten Version

### Enthalten

- Öffentlicher Veranstaltungskatalog
- Suche, Filter, Pagination und stabile Sortierung
- Detailansicht einer Veranstaltung
- Liste der Kategorien
- Erstellen, Bearbeiten und Löschen eigener Veranstaltungen
- Anmeldung zu und Abmeldung von fremden Veranstaltungen
- Persönliche Listen eigener Veranstaltungen und Anmeldungen
- Clerk-Authentifizierung
- Besitzbasierte Autorisierung in der API
- Zod-Validierung, Rate Limiting und zentrale Fehlerbehandlung
- Automatisierte Unit- und Integrationstests
- Deployment mit PostgreSQL-Datenbank und HTTPS

### Nicht enthalten

- Frontend
- Eigene Passwortverwaltung
- Admin-Rolle
- Bezahlfunktionen
- Chat
- Datei-Uploads
- Begrenzung der Teilnehmerzahl

Diese Funktionen werden nicht nebenbei ergänzt, damit die erste Version klein,
verständlich und innerhalb des Projektzeitraums testbar bleibt.

## 4. Technologie-Stack und Begründung

| Technologie               | Zweck und Begründung                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| JavaScript mit ES Modules | Im Kurs verwendete Sprache; ES Modules sorgen für eine einheitliche moderne Modulstruktur.                                  |
| Node.js und Express       | Schlanke Grundlage für REST-Endpunkte und Middleware.                                                                       |
| PostgreSQL                | Relationale Datenbank, passend für Benutzer, Events, Kategorien und Registrierungen mit klaren Beziehungen und Constraints. |
| Prisma                    | Typsichere, nachvollziehbare Datenbankabfragen, Migrationen und Seed-Unterstützung.                                         |
| Clerk                     | Externe Authentifizierung, sodass die API keine Passwörter speichern oder verwalten muss.                                   |
| Zod                       | Gemeinsame Validierung von Body-, Params- und Query-Daten.                                                                  |
| cors                      | Gezielte Freigabe erlaubter Browser-Clients.                                                                                |
| express-rate-limit        | Begrenzung zu vieler Anfragen und Schutz vor einfachem Missbrauch.                                                          |
| Helmet                    | Sichere Standardwerte für HTTP-Header.                                                                                      |
| Jest und Supertest        | Unit-Tests sowie HTTP-Tests gegen die exportierte Express-App.                                                              |
| Postman                   | Manuelle Prüfung der API und echter Clerk-Tokens.                                                                           |

Vor der SDK-Konfiguration werden die installierten Versionen und die dazu
passende aktuelle Dokumentation geprüft. Die derzeit installierten Versionen
sind in `package.json` festgehalten.

## 5. Geplante Architektur

Die Anwendung wird nach Verantwortlichkeiten gegliedert:

- `src/app.js`: Express-App konfigurieren und exportieren, ohne einen Port zu
  öffnen
- `src/server.js`: Konfiguration prüfen und den HTTP-Server mit `PORT` starten
- `src/routes/`: Routen mit Middleware und Controllern verbinden
- `src/controllers/`: HTTP-Eingaben lesen und HTTP-Antworten senden
- `src/services/`: Geschäftsregeln und Prisma-Abfragen ausführen
- `src/middleware/`: Authentifizierung, Validierung, Rate Limiting, 404- und
  Fehlerbehandlung
- `src/schemas/`: Zod-Schemas für Body, Params und Query
- `src/config/`: Konfiguration und zentrale Prisma-Client-Instanz
- `prisma/`: Schema, Migrationen und wiederholbarer Kategorie-Seed
- `tests/unit/`: Tests einzelner Geschäftsregeln
- `tests/integration/`: API- und Datenbanktests
- `docs/`: Projektplan, ERD und Endpunktdokumentation

Controller bleiben auf HTTP-Aufgaben begrenzt. Geschäftsregeln und
Datenbankzugriffe liegen in Services. Zusätzliche abstrakte Schichten werden
nur eingeführt, wenn sie einen konkreten Nutzen haben.

## 6. Datenmodell

### User

- `id`: Primärschlüssel
- `clerkId`: eindeutige Clerk-Benutzer-ID
- `createdAt`: Erstellungszeitpunkt

### Category

- `id`: Primärschlüssel
- `name`: eindeutiger Kategoriename

### Event

- `id`: Primärschlüssel
- `title`: Titel der Veranstaltung
- `description`: Beschreibung
- `city`: Stadt
- `location`: genauer Veranstaltungsort
- `startsAt`: Beginn mit Zeitzoneninformation
- `organizerId`: Fremdschlüssel zu `User`
- `categoryId`: Fremdschlüssel zu `Category`
- `createdAt`: Erstellungszeitpunkt
- `updatedAt`: Zeitpunkt der letzten Änderung

### Registration

- `id`: Primärschlüssel
- `userId`: Fremdschlüssel zu `User`
- `eventId`: Fremdschlüssel zu `Event`
- `createdAt`: Zeitpunkt der Anmeldung
- eindeutige Kombination aus `userId` und `eventId`

Eine Kategorie kann viele Veranstaltungen enthalten. Ein Benutzer kann viele
Veranstaltungen organisieren. Benutzer und Veranstaltungen stehen über
`Registration` in einer Many-to-many-Beziehung. Das ausführliche Diagramm wird
separat in `docs/erd.md` dokumentiert.

## 7. Geplante Endpunkte

### Öffentliche Endpunkte

| Methode | Pfad          | Zweck                                        |
| ------- | ------------- | -------------------------------------------- |
| `GET`   | `/health`     | Zustand des Dienstes prüfen                  |
| `GET`   | `/categories` | Alle Kategorien abrufen                      |
| `GET`   | `/events`     | Events suchen, filtern und paginiert abrufen |
| `GET`   | `/events/:id` | Einzelnes Event abrufen                      |

`GET /events` unterstützt die Query-Parameter `search`, `city`, `categoryId`,
`from`, `to`, `page` und `limit`.

### Geschützte Endpunkte

| Methode  | Pfad                           | Zweck                                |
| -------- | ------------------------------ | ------------------------------------ |
| `POST`   | `/events`                      | Eigenes Event erstellen              |
| `PATCH`  | `/events/:id`                  | Eigenes Event bearbeiten             |
| `DELETE` | `/events/:id`                  | Eigenes Event löschen                |
| `POST`   | `/events/:id/registrations`    | Für ein fremdes Event anmelden       |
| `DELETE` | `/events/:id/registrations/me` | Eigene Anmeldung löschen             |
| `GET`    | `/me/events`                   | Eigene Events paginiert abrufen      |
| `GET`    | `/me/registrations`            | Eigene Anmeldungen paginiert abrufen |

Request- und Response-Beispiele sowie alle erwarteten Fehlerfälle werden
separat in `docs/api.md` dokumentiert.

## 8. Antwortformat und HTTP-Regeln

- Einzelne Ressourcen: `{ "data": { ... } }`
- Listen: `{ "data": [ ... ], "pagination": { ... } }`
- Erfolgreiche Löschung: Status `204` ohne Body
- Fehler: `{ "error": { "code": "...", "message": "..." } }`

Verwendete Statuscodes:

- `200`: erfolgreiche Abfrage oder Änderung
- `201`: Ressource erfolgreich erstellt
- `204`: Ressource erfolgreich gelöscht
- `400`: ungültige Eingaben
- `401`: fehlende oder ungültige Authentifizierung
- `403`: fehlende Berechtigung
- `404`: Ressource nicht gefunden
- `409`: Konflikt mit einer Geschäftsregel
- `429`: zu viele Anfragen
- `500`: interner Fehler mit allgemeiner Meldung

Für Pagination gelten `page = 1` und `limit = 10` als Standardwerte. `page`
muss mindestens 1 sein; `limit` darf höchstens 50 sein. Eventlisten werden
stabil nach `startsAt` und `id` sortiert.

## 9. Authentifizierung und Autorisierung

Clerk authentifiziert Benutzer und verifiziert Tokens. Die API übernimmt die
verifizierte Clerk-ID und legt den zugehörigen lokalen Benutzer bei Bedarf
idempotent an. Eine reine Token-Decodierung ohne Verifikation reicht nicht aus.

Bei der Registrierung ist eine E-Mail-Adresse erforderlich. Clerk sendet einen
Bestätigungscode per E-Mail; der Benutzeraccount wird erst nach erfolgreicher
E-Mail-Verifizierung vollständig aktiviert. Die API versendet keine eigenen
Bestätigungs-E-Mails.

Die API selbst prüft die Besitzrechte:

- Nur der Organisator darf sein Event bearbeiten oder löschen.
- Benutzer dürfen nur ihre eigenen Anmeldungen verwalten.
- `organizerId` und `userId` werden nie aus dem Request-Body übernommen.
- Fehlende oder ungültige Authentifizierung liefert eine JSON-Antwort mit
  Status `401` und keine HTML-Weiterleitung.

In automatisierten Tests wird Clerk kontrolliert gemockt. Zusätzlich werden
geschützte Routen manuell mit echten Testbenutzern und echten Clerk-Tokens
geprüft. Tokens werden weder gespeichert noch dokumentiert.

## 10. Geschäftsregeln

- Kategorien werden mit einem wiederholbaren Seed angelegt.
- Neue Events müssen in der Zukunft liegen.
- Begonnene Events dürfen nicht mehr bearbeitet werden.
- Eine Anmeldung zu begonnenen Events ist nicht erlaubt.
- Organisatoren dürfen sich nicht für ihr eigenes Event anmelden.
- Eine doppelte Anmeldung wird durch Logik und einen Unique-Constraint
  verhindert.
- Beim Löschen eines Events werden die dazugehörigen Anmeldungen gelöscht.
- Referenzierte Kategorien und Benutzer werden vor unzulässigem Löschen
  geschützt.
- Öffentliche Antworten enthalten keine Clerk-IDs oder personenbezogenen
  Teilnehmerdaten.

## 11. Validierung und Sicherheit

- Body, Params und Query werden mit Zod validiert.
- Es werden nur positive ganzzahlige IDs akzeptiert.
- Textfelder werden getrimmt und in der Länge begrenzt.
- Unbekannte Body-Felder und leere PATCH-Anfragen werden abgelehnt.
- Erlaubte Prisma-Felder werden ausdrücklich zugewiesen.
- Datumswerte müssen eine Zeitzone enthalten.
- SQL-Strings werden nicht aus Benutzereingaben zusammengesetzt.
- CORS wird nur für tatsächliche Browser-Clients konfiguriert.
- Rate Limiting, Sicherheitsheader und ein begrenzter JSON-Body werden
  eingerichtet.
- Fehlerantworten enthalten keine Stacktraces, Secrets oder internen Details.
- Secrets liegen nur in Environment Variables; `.env` wird nicht committet.
- Das Deployment verwendet HTTPS und passende Proxy-Einstellungen.

Eigene Passwortsicherheit ist nicht Teil der API, weil Clerk die Anmeldung und
Passwortverwaltung übernimmt. Zahlungs- und Datei-Upload-Sicherheit sind für
die erste Version nicht relevant, da diese Funktionen nicht enthalten sind.

## 12. Teststrategie

### Unit-Tests

- Zeitabhängige Geschäftsregeln mit kontrollierter Uhrzeit
- Validierung von Eingaben
- Besitz- und Anmelderegeln
- Sichere Abbildung erwarteter Fehler

### Integrations- und API-Tests

- Erfolgreiche öffentliche und geschützte Requests
- Ungültige Body-, Params- und Query-Daten
- Fehlende oder ungültige Authentifizierung
- Versuch, ein fremdes Event zu ändern oder zu löschen
- Nicht vorhandene Ressourcen
- Doppelte Anmeldung
- Anmeldung zu einem begonnenen oder eigenen Event
- Zugriff nur auf eigene Events und Anmeldungen
- Pagination und stabile Sortierung
- Datenbank-Constraints, Beziehungen und Löschverhalten

Supertest verwendet die exportierte Express-App, deren Import keinen Server
startet. Datenbanktests laufen gegen eine getrennte Testdatenbank mit
isolierten und anschließend bereinigten Testdaten. Produktionsdaten werden
nicht für Tests verwendet oder gelöscht.

## 13. Umsetzungsschritte

1. Planung und Dokumentation von Zweck, Modell, Endpunkten und Beispielen
2. Projektgrundgerüst, Express-App und zentrale Fehlerbehandlung
3. PostgreSQL, Prisma-Schema, Migrationen und Kategorie-Seed
4. Öffentlicher Veranstaltungskatalog mit Suche, Filtern und Pagination
5. Clerk-Integration und lokale Benutzerzuordnung
6. Geschützte Eventverwaltung und besitzbasierte Autorisierung
7. An- und Abmeldung sowie persönliche Listen
8. Sicherheitskonfiguration und automatisierte Tests
9. Deployment, Live-Prüfung und abschließende Dokumentation

Der detaillierte Arbeitsfortschritt und die geplanten Termine werden in
`todo.md` gepflegt. Aufgaben werden dort erst nach Umsetzung und Prüfung als
erledigt markiert.

## 14. Deployment und Definition of Done

Vor der Auswahl werden aktuelle kostenlose Tarife und Limits für Hosting und
PostgreSQL geprüft. Es werden keine kostenpflichtigen Ressourcen ohne
ausdrücklichen Auftrag aktiviert. In Produktion werden bestehende Migrationen
mit `prisma migrate deploy` angewendet.

Die erste Version ist fertig, wenn:

- alle geplanten Kernendpunkte implementiert und dokumentiert sind,
- Authentifizierung und Besitzrechte nachweislich funktionieren,
- wichtige Erfolgs-, Validierungs- und Fehlerfälle automatisiert getestet sind,
- Datenbank-Constraints gegen eine getrennte Testdatenbank geprüft wurden,
- die Einrichtung aus einem frischen Checkout nachvollziehbar ist,
- der Dienst über HTTPS erreichbar ist,
- öffentliche und geschützte Endpunkte live geprüft wurden,
- die Daten nach einem Neustart erhalten bleiben und
- README, Projektplan, ERD und API-Dokumentation miteinander verlinkt sind.

Geplante Abgabefrist: **19. Oktober 2026, 23:59 Uhr**.
