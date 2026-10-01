import express from "express";

const app = express();

app.use(express.json());
// Wir starten den Server und geben seine Adresse im Terminal aus.
app.get("/", (req, res) => {
  res.send("Hallo von meinem Express-Server!");
});

export default app;
