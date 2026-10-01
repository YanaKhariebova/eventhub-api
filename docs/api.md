# EventHub API – Endpunktdokumentation

## Basis-URL

Lokal:

`http://localhost:3000`

Die URL der bereitgestellten API wird nach dem Deployment ergänzt.

## Authentifizierung

Geschützte Endpunkte benötigen ein gültiges Clerk-Token im
`Authorization`-Header:

```http
Authorization: Bearer <token>
```

Fehlt das Token oder ist es ungültig, antwortet die API mit:

Status: `401 Unauthorized`

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentifizierung erforderlich."
  }
}
```

Echte Tokens, Clerk-IDs und Zugangsdaten werden nicht in dieser Dokumentation
gespeichert.

## Allgemeine Antwortformate

### Einzelne Ressource

```json
{
  "data": {}
}
```

### Liste

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### Fehler

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Beschreibung des Fehlers."
  }
}
```

Validierungsfehler können zusätzlich sichere Angaben zu den betroffenen
Feldern enthalten. Interne Fehler, Stacktraces und vertrauliche Daten werden
nicht ausgegeben.

## Event-Darstellung

Event-Antworten enthalten keine Clerk-ID und keine personenbezogenen Daten von
Teilnehmern. Ein Event wird grundsätzlich so dargestellt:

```json
{
  "id": 12,
  "title": "Open-Air-Konzert",
  "description": "Kostenloses Konzert im Stadtpark.",
  "city": "Berlin",
  "location": "Stadtpark",
  "startsAt": "2026-10-10T16:00:00.000Z",
  "category": {
    "id": 1,
    "name": "Musik"
  },
  "organizer": {
    "id": 4
  },
  "createdAt": "2026-10-01T10:00:00.000Z",
  "updatedAt": "2026-10-01T10:00:00.000Z"
}
```

## Öffentliche Endpunkte

### GET /health

Prüft, ob die API erreichbar ist.

#### Erfolgreiche Antwort

Status: `200 OK`

```json
{
  "data": {
    "status": "ok"
  }
}
```

---

### GET /categories

Gibt alle verfügbaren Kategorien zurück.

#### Erfolgreiche Antwort

Status: `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "name": "Musik"
    },
    {
      "id": 2,
      "name": "Sport"
    }
  ]
}
```

---

### GET /events

Gibt eine paginierte Liste öffentlicher Veranstaltungen zurück. Die Liste
wird stabil nach `startsAt` und `id` sortiert.

#### Query-Parameter

| Parameter | Typ | Pflicht | Beschreibung |
| --- | --- | --- | --- |
| `search` | String | Nein | Suche in Titel und Beschreibung |
| `city` | String | Nein | Filter nach Stadt |
| `categoryId` | positive Ganzzahl | Nein | Filter nach Kategorie |
| `from` | ISO-8601-Datum mit Zeitzone | Nein | Events ab diesem Zeitpunkt |
| `to` | ISO-8601-Datum mit Zeitzone | Nein | Events bis zu diesem Zeitpunkt |
| `page` | positive Ganzzahl | Nein | Seite, Standardwert: `1` |
| `limit` | positive Ganzzahl | Nein | Einträge pro Seite, Standardwert: `10`, maximal `50` |

#### Beispielanfrage

```http
GET /events?city=Berlin&categoryId=1&page=1&limit=10
```

#### Erfolgreiche Antwort

Status: `200 OK`

```json
{
  "data": [
    {
      "id": 12,
      "title": "Open-Air-Konzert",
      "description": "Kostenloses Konzert im Stadtpark.",
      "city": "Berlin",
      "location": "Stadtpark",
      "startsAt": "2026-10-10T16:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Musik"
      },
      "organizer": {
        "id": 4
      },
      "createdAt": "2026-10-01T10:00:00.000Z",
      "updatedAt": "2026-10-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Ungültige Query-Parameter

Status: `400 Bad Request`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ungültige Query-Parameter."
  }
}
```

---

### GET /events/:id

Gibt eine einzelne Veranstaltung zurück.

#### Path-Parameter

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| `id` | positive Ganzzahl | ID der Veranstaltung |

#### Erfolgreiche Antwort

Status: `200 OK`

```json
{
  "data": {
    "id": 12,
    "title": "Open-Air-Konzert",
    "description": "Kostenloses Konzert im Stadtpark.",
    "city": "Berlin",
    "location": "Stadtpark",
    "startsAt": "2026-10-10T16:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Musik"
    },
    "organizer": {
      "id": 4
    },
    "createdAt": "2026-10-01T10:00:00.000Z",
    "updatedAt": "2026-10-01T10:00:00.000Z"
  }
}
```

#### Event nicht gefunden

Status: `404 Not Found`

```json
{
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Veranstaltung nicht gefunden."
  }
}
```

## Geschützte Endpunkte

### POST /events

Erstellt eine Veranstaltung für den angemeldeten Benutzer. `organizerId` wird
aus der verifizierten Clerk-Identität bestimmt und darf nicht im Request-Body
stehen.

#### Request-Body

```json
{
  "title": "Open-Air-Konzert",
  "description": "Kostenloses Konzert im Stadtpark.",
  "city": "Berlin",
  "location": "Stadtpark",
  "startsAt": "2026-10-10T18:00:00+02:00",
  "categoryId": 1
}
```

#### Erfolgreiche Antwort

Status: `201 Created`

```json
{
  "data": {
    "id": 12,
    "title": "Open-Air-Konzert",
    "description": "Kostenloses Konzert im Stadtpark.",
    "city": "Berlin",
    "location": "Stadtpark",
    "startsAt": "2026-10-10T16:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Musik"
    },
    "organizer": {
      "id": 4
    },
    "createdAt": "2026-10-01T10:00:00.000Z",
    "updatedAt": "2026-10-01T10:00:00.000Z"
  }
}
```

#### Mögliche Fehler

- `400 Bad Request`: ungültige oder unbekannte Felder, Datum ohne Zeitzone
- `401 Unauthorized`: Authentifizierung fehlt oder ist ungültig
- `404 Not Found`: Kategorie wurde nicht gefunden
- `409 Conflict`: Startzeit liegt nicht in der Zukunft

---

### PATCH /events/:id

Ändert eine eigene, noch nicht begonnene Veranstaltung. Alle erlaubten Felder
sind optional, aber der Request-Body darf nicht leer sein. `organizerId` darf
nicht übergeben werden.

#### Request-Body

```json
{
  "title": "Neuer Veranstaltungstitel",
  "startsAt": "2026-10-11T18:00:00+02:00"
}
```

#### Erfolgreiche Antwort

Status: `200 OK`

```json
{
  "data": {
    "id": 12,
    "title": "Neuer Veranstaltungstitel",
    "description": "Kostenloses Konzert im Stadtpark.",
    "city": "Berlin",
    "location": "Stadtpark",
    "startsAt": "2026-10-11T16:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Musik"
    },
    "organizer": {
      "id": 4
    },
    "createdAt": "2026-10-01T10:00:00.000Z",
    "updatedAt": "2026-10-02T12:00:00.000Z"
  }
}
```

#### Mögliche Fehler

- `400 Bad Request`: ungültige, unbekannte oder leere Anfrage
- `401 Unauthorized`: Authentifizierung fehlt oder ist ungültig
- `403 Forbidden`: Benutzer ist nicht der Organisator
- `404 Not Found`: Event oder angegebene Kategorie wurde nicht gefunden
- `409 Conflict`: Event hat begonnen oder neue Startzeit liegt nicht in der Zukunft

---

### DELETE /events/:id

Löscht eine eigene Veranstaltung. Zugehörige Registrierungen werden ebenfalls
gelöscht.

#### Erfolgreiche Antwort

Status: `204 No Content`

Die Antwort enthält keinen Body.

#### Mögliche Fehler

- `401 Unauthorized`: Authentifizierung fehlt oder ist ungültig
- `403 Forbidden`: Benutzer ist nicht der Organisator
- `404 Not Found`: Event wurde nicht gefunden

---

### POST /events/:id/registrations

Meldet den angemeldeten Benutzer zu einer fremden Veranstaltung an. `userId`
wird aus der verifizierten Clerk-Identität bestimmt. Ein Request-Body ist nicht
erforderlich.

#### Erfolgreiche Antwort

Status: `201 Created`

```json
{
  "data": {
    "id": 25,
    "eventId": 12,
    "createdAt": "2026-10-02T14:00:00.000Z"
  }
}
```

#### Mögliche Fehler

- `401 Unauthorized`: Authentifizierung fehlt oder ist ungültig
- `404 Not Found`: Event wurde nicht gefunden
- `409 Conflict`: Event hat bereits begonnen
- `409 Conflict`: Benutzer ist bereits angemeldet
- `409 Conflict`: Benutzer ist Organisator des Events

---

### DELETE /events/:id/registrations/me

Löscht die eigene Anmeldung für eine Veranstaltung.

#### Erfolgreiche Antwort

Status: `204 No Content`

Die Antwort enthält keinen Body.

#### Mögliche Fehler

- `401 Unauthorized`: Authentifizierung fehlt oder ist ungültig
- `404 Not Found`: Event oder eigene Anmeldung wurde nicht gefunden

---

### GET /me/events

Gibt die vom angemeldeten Benutzer organisierten Veranstaltungen paginiert
zurück.

#### Query-Parameter

| Parameter | Typ | Pflicht | Beschreibung |
| --- | --- | --- | --- |
| `page` | positive Ganzzahl | Nein | Seite, Standardwert: `1` |
| `limit` | positive Ganzzahl | Nein | Einträge pro Seite, Standardwert: `10`, maximal `50` |

Die Antwort verwendet das allgemeine Listenformat und die öffentliche
Event-Darstellung.

#### Mögliche Fehler

- `400 Bad Request`: ungültige Query-Parameter
- `401 Unauthorized`: Authentifizierung fehlt oder ist ungültig

---

### GET /me/registrations

Gibt die eigenen Anmeldungen einschließlich der zugehörigen Events paginiert
zurück. Die Antwort enthält keine Daten anderer Teilnehmer.

#### Query-Parameter

| Parameter | Typ | Pflicht | Beschreibung |
| --- | --- | --- | --- |
| `page` | positive Ganzzahl | Nein | Seite, Standardwert: `1` |
| `limit` | positive Ganzzahl | Nein | Einträge pro Seite, Standardwert: `10`, maximal `50` |

#### Erfolgreiche Antwort

Status: `200 OK`

```json
{
  "data": [
    {
      "id": 25,
      "createdAt": "2026-10-02T14:00:00.000Z",
      "event": {
        "id": 12,
        "title": "Open-Air-Konzert",
        "city": "Berlin",
        "location": "Stadtpark",
        "startsAt": "2026-10-10T16:00:00.000Z",
        "category": {
          "id": 1,
          "name": "Musik"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Mögliche Fehler

- `400 Bad Request`: ungültige Query-Parameter
- `401 Unauthorized`: Authentifizierung fehlt oder ist ungültig

## Allgemeine Fehlerbeispiele

### Ungültige Eingabe

Status: `400 Bad Request`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ungültige Eingabedaten."
  }
}
```

### Keine Berechtigung

Status: `403 Forbidden`

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Keine Berechtigung für diese Aktion."
  }
}
```

### Geschäftsregel-Konflikt

Status: `409 Conflict`

```json
{
  "error": {
    "code": "REGISTRATION_CONFLICT",
    "message": "Anmeldung für diese Veranstaltung nicht möglich."
  }
}
```

### Zu viele Anfragen

Status: `429 Too Many Requests`

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Zu viele Anfragen. Bitte später erneut versuchen."
  }
}
```

### Interner Fehler

Status: `500 Internal Server Error`

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Ein interner Fehler ist aufgetreten."
  }
}
```

## Authentifizierung mit Postman testen

1. Mit einem Clerk-Testbenutzer anmelden.
2. Ein gültiges Session-Token abrufen.
3. In Postman den Tab **Authorization** öffnen.
4. Als Typ **Bearer Token** auswählen.
5. Das Token einfügen.
6. Einen geschützten Endpunkt aufrufen.
7. Den Request ohne Token wiederholen; erwartet wird Status `401`.
8. Besitzrechte mit zwei verschiedenen Testbenutzern prüfen. Beim Zugriff auf
   ein fremdes Event wird Status `403` erwartet.

Tokens dürfen nicht in Screenshots, Git-Commits, Postman-Exports oder
Dokumentationsbeispielen veröffentlicht werden.
