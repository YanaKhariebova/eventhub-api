# EventHub API

REST-API für kostenlose Veranstaltungen als Backend-Modulabschlussprojekt.
Die fachlichen Endpunkte werden noch implementiert.

## Einrichtung

Voraussetzungen: Node.js 24 LTS, npm und eine PostgreSQL-Entwicklungsdatenbank.

1. Abhängigkeiten mit `npm ci` installieren.
2. `.env.example` nach `.env` kopieren und `DATABASE_URL` für die eigene
   Entwicklungsdatenbank setzen. Clerk-Werte werden für die spätere
   Authentifizierung benötigt.
3. `npm run prisma:validate` ausführen.
4. `npm run prisma:generate` ausführen.
5. Bestehende Migrationen mit `npm run prisma:deploy` anwenden.
6. Kategorien mit `npm run prisma:seed` anlegen.
7. Mit `npm run dev` starten; `GET /health` prüft die Erreichbarkeit.

Node.js lädt die lokale `.env` über seine eingebauten Optionen. Bei `start`
und den nicht interaktiven Prisma-Kommandos ist die Datei optional, damit im
Hosting direkt gesetzte Umgebungsvariablen verwendet werden können.
`DATABASE_URL` muss trotzdem gesetzt sein. `.env` darf nicht committet werden.

## Prisma und Datenbank

Prisma CLI und Prisma Client verwenden Version **6.19.3**.
`prisma/schema.prisma` enthält deshalb `url = env("DATABASE_URL")`.
`prisma.config.ts` definiert Schema, Migrationen und Seed.
Die zentrale Client-Instanz liegt in `src/database/prismaClient.js` und wird
als Default-Export importiert. Sie verwendet die eingebaute Prisma-Engine.

Die Workspace-Einstellung `prisma.pinToPrisma6` in `.vscode/settings.json`
aktiviert den Prisma-6-Sprachserver im VS-Code-Plugin. Falls weiterhin eine
Prisma-7-Diagnose für `url` angezeigt wird, in der Befehlspalette
`Prisma: Restart Language Server` ausführen.

| Kommando | Zweck |
| --- | --- |
| `npm run prisma:validate` | Schema prüfen |
| `npm run prisma:generate` | Client nach Schemaänderungen generieren |
| `npm run prisma:status` | Status der Migrationen prüfen |
| `npm run prisma:migrate -- --name beschreibung` | Neue Migration in der Entwicklungsdatenbank erstellen und anwenden |
| `npm run prisma:deploy` | Bestehende Migrationen anwenden, auch im Deployment |
| `npm run prisma:seed` | Fünf Kategorien wiederholbar anlegen |
| `npm run prisma:studio` | Lokale Datenbankoberfläche öffnen |

`migrate dev` darf nur gegen eine Entwicklungsdatenbank laufen. Bereits
angewendete Migrationen werden nicht geändert. Der Kategorie-Seed verwendet
`upsert` mit eindeutigen Namen; wiederholtes Ausführen erzeugt keine Duplikate.
Er legt keine Benutzer an.

Im Deployment `DATABASE_URL` und die weiteren benötigten Umgebungsvariablen
setzen, den Client generieren, bestehende Migrationen mit `prisma:deploy`
anwenden und Kategorien mit `prisma:seed` anlegen. `npm start` startet den
Server mit dem konfigurierten `PORT`.

## Tests

`npm test -- --runInBand` startet Jest. Die vorhandenen Testdateien sind noch
leer; der Testlauf schlägt deshalb derzeit fehl. Datenbank-Constraints und
Löschverhalten müssen später gegen eine getrennte Testdatenbank geprüft werden.

## Dokumentation

- [Projektplan](docs/plan.md)
- [Datenmodell und ERD](docs/erd.md)
- [API-Design](docs/api.md)
- [Aufgaben und Fortschritt](todo.md)

Beteiligte und Live-URL werden vor der Abgabe ergänzt.
