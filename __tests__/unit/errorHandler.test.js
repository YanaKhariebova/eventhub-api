import { jest } from "@jest/globals";
import { errorHandler } from "../../src/middleware/errorHandler.js";

describe("Zentrale Fehlerbehandlung", () => {
  test("Interne Fehler liefern 500 ohne interne Meldung oder Stacktrace", () => {
    const error = new Error("Interne Datenbankdetails dürfen nicht erscheinen.");
    const res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(error, {}, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Ein interner Fehler ist aufgetreten.",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("Nach gesendeten Headern wird der Fehler weitergegeben", () => {
    const error = new Error("Antwort wurde bereits begonnen.");
    const res = {
      headersSent: true,
      status: jest.fn(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(error, {}, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
