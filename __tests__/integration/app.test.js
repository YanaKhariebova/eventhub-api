import request from "supertest";
import app from "../../src/app.js";

describe("HTTP-Grundgerüst", () => {
  test("GET /health liefert 200 mit dem vereinbarten Antwortformat", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { status: "ok" } });
  });

  test("Unbekannte Routen liefern eine JSON-404-Antwort", async () => {
    const response = await request(app).get("/unknown");

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      error: { code: "NOT_FOUND", message: "Route nicht gefunden." },
    });
  });

  test("Ungültiges JSON liefert 400 statt 404 oder 500", async () => {
    const response = await request(app)
      .post("/health")
      .set("Content-Type", "application/json")
      .send('{"title":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "INVALID_JSON",
        message: "Der Request-Body enthält ungültiges JSON.",
      },
    });
  });

  test("JSON über 100 KB liefert eine sichere 400-Antwort", async () => {
    const response = await request(app)
      .post("/health")
      .send({ title: "a".repeat(101 * 1024) });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "BODY_TOO_LARGE",
        message: "Der Request-Body ist zu groß.",
      },
    });
  });
});
