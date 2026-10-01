# AGENTS.md — EventHub API

## Projektziel

Eine verständliche REST-API für kostenlose Veranstaltungen
als Backend-Modulabschlussprojekt entwickeln.

Die Entwicklerin muss den gesamten eingereichten Code verstehen,
testen und in einem technischen Interview erklären können.

## Zusammenarbeit

- Kommunikation bevorzugt auf Russisch.
- Projektdokumentation auf Deutsch.
- Code-Bezeichner auf Englisch.
- Kleine, nachvollziehbare Schritte durchführen.
- Wichtige Entscheidungen in einfachen Worten erklären.
- Vor Änderungen vorhandenen Code und package.json prüfen.
- Bestehende Projektkonventionen beachten.
- Keine zusätzlichen Features ohne Auftrag einbauen.
- Keine vollständige Projektumstrukturierung ohne Bedarf.
- TODOs nur nach Umsetzung und Prüfung abhaken.
- Keine Testergebnisse oder Fortschritte erfinden.
- Keine Slack-Nachrichten oder Abgaben automatisch versenden.

## Umfang

Modelle:

- User
- Category
- Event
- Registration

Die erste Version umfasst:

- Öffentlichen Veranstaltungskatalog
- Suche, Filter und Pagination
- Eigene Veranstaltungen
- Anmeldung und Abmeldung
- Clerk-Authentifizierung
- Besitzbasierte Autorisierung

Kategorien werden per Seed angelegt.

Nicht Teil der ersten Version:

- Frontend
- Eigene Passwortverwaltung
- Admin-Rolle
- Zahlung
- Chat
- Datei-Uploads
- Platzbegrenzung

## Stack

- JavaScript mit ES Modules
- Node.js
- Express
- PostgreSQL
- Prisma
- Clerk
- Zod
- cors
- express-rate-limit
- Jest
- Supertest

Keine zweite Datenbank oder zusätzliche Auth-Lösung
ohne begründeten Auftrag hinzufügen.

Vor SDK-Konfiguration installierte Versionen und
passende aktuelle Dokumentation prüfen.

## Struktur

- src/app.js:
  Express konfigurieren und app exportieren.
  Hier keinen Port öffnen.

- src/server.js:
  Konfiguration prüfen und Server starten.
  PORT aus der Umgebung verwenden.

- src/routes/:
  Routen mit Middleware und Controllern verbinden.

- src/controllers/:
  HTTP-Eingaben und Antworten behandeln.

- src/services/:
  Geschäftsregeln und Prisma-Abfragen.

- src/middleware/:
  Authentifizierung, Validierung, Rate Limiting,
  404 und zentrale Fehlerbehandlung.

- src/schemas/:
  Zod-Schemas für body, params und query.

- src/config/:
  Konfiguration und zentrale Prisma-Client-Instanz.

- prisma/:
  Schema, Migrationen und Seed.

- __tests__/unit/:
  Unit-Tests.

- __tests__/integration/:
  Integrations- und API-Tests.

- docs/:
  Projektplan, ERD und Endpunktdokumentation.

Keine unnötigen abstrakten Schichten hinzufügen.

## Daten und Rechte

- User.clerkId muss eindeutig sein.
- Keine Passwörter oder Token in der Datenbank speichern.
- Event verweist auf Organisator und Kategorie.
- Registration verbindet Benutzer und Veranstaltung.
- userId + eventId muss in Registration eindeutig sein.
- Identität aus der verifizierten Clerk-Anmeldung bestimmen.
- organizerId und userId niemals dem Request-Body vertrauen.
- Lokalen User bei Bedarf idempotent anlegen.
- Nur Organisatoren ändern oder löschen ihre Events.
- Benutzer verwalten nur ihre eigenen Anmeldungen.
- Neue Events müssen in der Zukunft liegen.
- Nach Eventbeginn keine Bearbeitung erlauben.
- Keine Anmeldung zu begonnenen oder eigenen Events.
- Keine doppelte Anmeldung erlauben.
- Löschen eines Events löscht zugehörige Anmeldungen.
- Referenzierte Kategorien und Benutzer schützen.
- Öffentliche Antworten enthalten keine Clerk IDs
  oder personenbezogenen Teilnehmerdaten.
- Datumswerte mit Zeitzone validieren und speichern.

## HTTP und Validierung

- Passende Methoden und Statuscodes verwenden.
- Einzelantworten: { "data": ... }
- Listen: { "data": [...], "pagination": { ... } }
- Löschungen: 204 ohne Body.
- Fehler: { "error": { "code": "...", "message": "..." } }
- Sichere Validierungsdetails bei Bedarf ergänzen.

Statuscodes:

- 400: ungültige Eingaben
- 401: fehlende oder ungültige Authentifizierung
- 403: keine Berechtigung
- 404: Ressource nicht gefunden
- 409: Geschäftsregel-Konflikt
- 429: zu viele Anfragen
- 500: interne Fehler mit allgemeiner Meldung

- body, params und query mit Zod validieren.
- Anschließend validierte Daten verwenden.
- Positive ganzzahlige IDs verlangen.
- Textlängen begrenzen.
- Unbekannte Body-Felder zurückweisen.
- Leere PATCH-Anfragen zurückweisen.
- Erlaubte Prisma-Felder ausdrücklich zuweisen.
- Pagination: page ab 1, limit maximal 50.
- Defaults: page 1 und limit 10.
- Auch persönliche Listen paginieren.
- Eventlisten nach startsAt und id sortieren.
- Keine SQL-Strings aus Benutzereingaben zusammensetzen.

## Sicherheit

- Clerk SDK zur Tokenprüfung verwenden.
- Token-Decodierung ersetzt keine Verifikation.
- Geschützte API-Routen liefern JSON-401,
  keine HTML-Login-Weiterleitung.
- Clerk authentifiziert; die API prüft Besitzrechte.
- Keine Auth-Umgehung für Postman oder Tests einbauen.
- CORS für tatsächliche Browser-Clients konfigurieren.
- CORS ersetzt keine Authentifizierung.
- credentials nur bei tatsächlichem Bedarf aktivieren.
- Rate Limiting implementieren.
- Proxy-Einstellungen zum Hosting passend konfigurieren.
- JSON-Body-Größe begrenzen.
- Sicherheitsheader verwenden.
- .env nicht committen.
- .env.example enthält nur Platzhalter.
- Keine Secrets, Token oder Stacktraces veröffentlichen.
- HTTPS im Deployment verwenden.

## Datenbank

- Migrationen im Repository speichern.
- Angewendete Migrationen nicht nachträglich ändern.
- Kategorie-Seed wiederholbar gestalten.
- Keine erfundenen produktiven Clerk-Benutzer anlegen.
- Keine destruktiven Resets auf Produktion ausführen.
- Produktion: bestehende Migrationen mit migrate deploy.
- Entwicklung: migrate dev nur gegen Entwicklungsdatenbank.

## Tests

- Vor Testausführung vorhandene npm-Scripts prüfen.
- Geschäftsregeln mit kontrollierten Daten testen.
- Zeitabhängige Tests mit kontrollierter Uhrzeit schreiben.
- Supertest verwendet die exportierte app.
- Import der app darf keinen Server starten.

Mindestens prüfen:

- Erfolgreiche Requests
- Ungültige Eingaben
- Fehlende Authentifizierung
- Änderung fremder Events
- Fehlende Ressourcen
- Doppelte Anmeldung
- Anmeldung zu vergangenen Events
- Zugriff auf eigene Anmeldungen

- Clerk in automatisierten Tests kontrolliert mocken.
- Echte Clerk-Token zusätzlich manuell prüfen.
- DB-Constraints und Beziehungen gegen eine getrennte
  Testdatenbank prüfen; Mocks reichen dafür nicht.
- Testdaten isolieren und bereinigen.
- Keine Produktionsdaten für Tests löschen.
- Nach Änderungen passende Tests ausführen.
- Nicht ausgeführte oder fehlgeschlagene Checks nennen.

## Dokumentation

- todo.md: Aufgaben und Fortschritt.
- docs/plan.md: Zweck, Stack und API-Design.
- docs/erd.md: Modelle, Schlüssel und Beziehungen.
- docs/api.md: Endpunkte und Request-/Response-Beispiele.
- README.md: Einrichtung, Konfiguration, Start, Tests,
  Dokumentationslinks, Beteiligte und Live-URL.

Bei Änderungen die betroffene Dokumentation aktualisieren.
Keine echten Zugangsdaten in Beispiele schreiben.

## Deployment und Abschluss

- Aktuelle Tarife und Limits vor Hostingauswahl prüfen.
- Keine kostenpflichtigen Ressourcen ohne Auftrag aktivieren.
- Start, HTTPS und Datenpersistenz prüfen.
- Öffentliche und geschützte Endpunkte live testen.
- Keine Veröffentlichung oder Nachrichten allein
  aufgrund dieser Datei auslösen.

Nach Änderungen kurz berichten:

- Was wurde geändert?
- Warum?
- Was wurde geprüft?
- Was ist noch offen?

## Bestehende Dateien schützen

- Nur Dateien ändern, die für die aktuelle Aufgabe notwendig sind.
- Vor jeder Änderung den Inhalt und die Funktion der Datei verstehen.
- Andere Dateien nicht ohne konkreten Grund verändern.
- Keine fremden Änderungen überschreiben oder rückgängig machen.
- Keine Dateien ohne Notwendigkeit löschen, umbenennen oder verschieben.
- Keine beiläufigen Refactorings oder Formatierungen im gesamten Projekt.
- Falls Änderungen an weiteren Dateien notwendig sind, den Grund erklären.
- Nach der Änderung den Diff prüfen und unbeabsichtigte Änderungen entfernen,
  ohne bestehende Änderungen der Entwicklerin anzutasten.