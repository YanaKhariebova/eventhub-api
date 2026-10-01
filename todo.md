# EventHub API — Projektplan und TODO

Abgabefrist: 19. Oktober 2026, 23:59 Uhr.

## Projektidee

EventHub ist eine REST-API für kostenlose Veranstaltungen.

Besucher können Veranstaltungen suchen und ansehen.
Angemeldete Benutzer können eigene Veranstaltungen erstellen,
sich für andere Veranstaltungen anmelden und ihre Anmeldungen verwalten.

Die erste Version enthält kein Frontend, keine Bezahlung,
keinen Chat und keine Datei-Uploads.

## Technologie-Stack

- JavaScript mit ES Modules
- Node.js und Express
- PostgreSQL und Prisma
- Clerk für Authentifizierung
- Eigene Besitzprüfungen für Autorisierung
- Zod für Validierung
- cors und express-rate-limit
- Jest und Supertest
- Postman für manuelle Tests
- GitHub für Versionsverwaltung

Hosting und Datenbankanbieter werden nach Prüfung
der aktuellen Tarife und Limits ausgewählt.

## Datenmodelle

### User

- id
- clerkId: eindeutig
- createdAt

### Category

- id
- name: eindeutig

### Event

- id
- title
- description
- city
- location
- startsAt
- organizerId: Fremdschlüssel zu User
- categoryId: Fremdschlüssel zu Category
- createdAt
- updatedAt

### Registration

- id
- userId: Fremdschlüssel zu User
- eventId: Fremdschlüssel zu Event
- createdAt
- Kombination userId + eventId: eindeutig

## Beziehungen

- Eine Kategorie hat viele Veranstaltungen.
- Ein Benutzer organisiert viele Veranstaltungen.
- Benutzer und Veranstaltungen sind über Registration
  in einer Many-to-many-Beziehung verbunden.

## Geschäftsregeln

- Kategorien werden zunächst über einen Seed angelegt.
- Nur angemeldete Benutzer erstellen Veranstaltungen.
- Nur der Organisator darf sein Event ändern oder löschen.
- Neue Events müssen in der Zukunft liegen.
- Nach Beginn darf ein Event nicht mehr bearbeitet werden.
- Anmeldung zu bereits begonnenen Events ist nicht möglich.
- Doppelte Anmeldung ist nicht möglich.
- Anmeldung zum eigenen Event ist nicht möglich.
- Jeder Benutzer sieht und löscht nur seine eigenen Anmeldungen.
- Beim Löschen eines Events werden seine Anmeldungen gelöscht.
- Verwendete Kategorien dürfen nicht gelöscht werden.
- userId und organizerId werden aus der geprüften Identität
  bestimmt, nicht aus dem Request-Body übernommen.

## Endpunkte

### Öffentlich

- GET /events
- GET /events/:id
- GET /categories

### Angemeldet

- POST /events
- PATCH /events/:id — nur Organisator
- DELETE /events/:id — nur Organisator
- POST /events/:id/registrations
- DELETE /events/:id/registrations/me
- GET /me/registrations
- GET /me/events

### Technisch

- GET /health

GET /events unterstützt:
search, city, categoryId, from, to, page und limit.

Pagination:

- page: Standard 1
- limit: Standard 10, maximal 50
- Auch persönliche Listen werden paginiert.

## 1. Planung — 30.09.–01.10.

- [x] Zweck und Zielgruppe dokumentieren.
- [x] Projektumfang festlegen.
- [x] Stack und Begründungen dokumentieren.
- [x] Datenfelder und Geschäftsregeln festlegen.
- [x] ERD mit Schlüsseln und Beziehungen erstellen.
- [x] Endpunkte und Zugriffsrechte dokumentieren.
- [x] Anfrage-, Antwort- und Fehlerbeispiele schreiben.
- [x] Clerk-Nutzung und Auth-Test über Postman planen.
- [x] Projektplan in docs/plan.md speichern.
- [x] ERD in docs/erd.md speichern.
- [x] Endpunktdokumentation in docs/api.md speichern.

## 2. Grundgerüst und Datenbank — 02.10.–04.10.

- [x] GitHub-Repository eventhub-api erstellen.
- [x] npm-Projekt mit ES Modules einrichten.
- [x] Abhängigkeiten installieren.
- [x] Scripts für dev, start und test einrichten.
- [x] .gitignore und .env.example erstellen.
- [x] app.js und server.js trennen.
- [x] Ordnerstruktur erstellen.
- [ ] GET /health implementieren.
- [ ] PostgreSQL und Prisma einrichten.
- [ ] Vier Modelle und Constraints implementieren.
- [ ] Migration erstellen und prüfen.
- [ ] Wiederholbaren Kategorie-Seed schreiben.
- [ ] Zentrale 404- und Fehlerbehandlung erstellen.

## 3. Öffentlicher Katalog — 05.10.–07.10.

- [ ] GET /categories implementieren.
- [ ] GET /events/:id implementieren.
- [ ] GET /events implementieren.
- [ ] Suche und Filter hinzufügen.
- [ ] Pagination und stabile Sortierung hinzufügen.
- [ ] params und query mit Zod validieren.
- [ ] Einheitliche JSON-Antworten umsetzen.
- [ ] Katalog mit Postman prüfen.
- [ ] Erste automatisierte Tests schreiben.

## 4. Clerk und geschützte Funktionen — 08.10.–11.10.

- [ ] Clerk integrieren.
- [ ] Fehlende oder ungültige Anmeldung mit JSON-401 behandeln.
- [ ] Lokalen User anhand der verifizierten Clerk ID anlegen.
- [ ] POST /events implementieren.
- [ ] PATCH /events/:id implementieren.
- [ ] DELETE /events/:id implementieren.
- [ ] Besitzprüfung umsetzen.
- [ ] Anmeldung und Abmeldung implementieren.
- [ ] Doppelte Anmeldung mit Unique-Constraint verhindern.
- [ ] Geschäftsregeln für Anmeldung prüfen.
- [ ] GET /me/events implementieren.
- [ ] GET /me/registrations implementieren.
- [ ] Rechte mit zwei echten Clerk-Benutzern prüfen.

## 5. Sicherheit und Tests — 12.10.–14.10.

- [ ] body, params und query vollständig validieren.
- [ ] Unbekannte und verbotene Body-Felder zurückweisen.
- [ ] Texte sinnvoll trimmen.
- [ ] CORS gezielt konfigurieren.
- [ ] Rate Limiting konfigurieren.
- [ ] JSON-Body-Größe begrenzen.
- [ ] Sicherheitsheader konfigurieren.
- [ ] Sichere Fehlerantworten prüfen.
- [ ] Keine Secrets oder Token protokollieren.
- [ ] Unit-Tests für Geschäftsregeln schreiben.
- [ ] Supertest-Tests für erfolgreiche Anfragen schreiben.
- [ ] Ungültige Eingaben testen.
- [ ] 401, 403, 404 und 409 testen.
- [ ] Doppelte Anmeldung und vergangene Events testen.
- [ ] Clerk in automatisierten Tests kontrolliert mocken.
- [ ] DB-Constraints und Löschverhalten gegen eine
      getrennte Testdatenbank testen.
- [ ] Alle Tests ausführen und Fehler beheben.
- [ ] Relevante Sicherheitsentscheidungen dokumentieren.

## 6. Deployment und Dokumentation — 15.10.–17.10.

- [ ] Aktuelle Hostingangebote und Kostenlimits prüfen.
- [ ] Hosting- und Datenbankanbieter auswählen.
- [ ] Deployment frühzeitig ausprobieren.
- [ ] Environment Variables sicher konfigurieren.
- [ ] Prisma Client generieren.
- [ ] Migrationen mit migrate deploy anwenden.
- [ ] Kategorien in der bereitgestellten DB anlegen.
- [ ] Startkommando und PORT prüfen.
- [ ] HTTPS und Dienststart prüfen.
- [ ] Öffentliche und geschützte Endpunkte live testen.
- [ ] Datenpersistenz nach Neustart prüfen.
- [ ] README vervollständigen.
- [ ] Installation, Konfiguration und Tests erklären.
- [ ] Auth-Test für die Lehrkraft dokumentieren.
- [ ] Plan, ERD und API-Dokumentation verlinken.
- [ ] Namen der Beteiligten und Live-URL ergänzen.

## 7. Abschluss — 18.10.–19.10.

- [ ] Einrichtung aus einem frischen Checkout prüfen.
- [ ] Abschließende Tests ausführen.
- [ ] Live-API erneut prüfen.
- [ ] Repository auf veröffentlichte Secrets prüfen.
- [ ] Technisches Interview vorbereiten.
- [ ] GitHub-Link und Live-URL rechtzeitig abgeben.
- [ ] Bei Gruppenarbeit: gemeinsamer Code in den
      privaten Repositories aller Mitglieder.

## Tägliche Slack-Updates

Ab 30.09. während des gesamten Projektzeitraums.

### Morgens zwischen 09:00 und 10:00

- Drei wichtigste Aufgaben.
- Größtes Risiko oder Hindernis.
- Geplante Gegenmaßnahme.

### Nach ILP, spätestens 23:59

- Mindestens drei tatsächlich abgeschlossene Aufgaben.
- Wichtigste Erkenntnis.
- Höchste Priorität für morgen.

Blockaden und nicht erledigte Aufgaben ehrlich nennen.
Keine erfundenen Fortschritte melden.

## Definition of Done

- [ ] Verbundene Datenmodelle funktionieren.
- [ ] Daten werden dauerhaft gespeichert.
- [ ] Alle geplanten fachlichen Endpunkte funktionieren.
- [ ] Authentifizierung und Besitzprüfungen funktionieren.
- [ ] Sicherheitsmaßnahmen sind umgesetzt und erklärt.
- [ ] Wichtige Erfolgs- und Fehlerfälle sind getestet.
- [ ] Dokumentation ermöglicht anderen die Einrichtung.
- [ ] Live-API funktioniert über HTTPS.
- [ ] Abgabe und tägliche Updates sind vollständig.
- [ ] Ich kann den Code und die Entscheidungen erklären.
