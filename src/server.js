import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

//Wir starten den Server und geben seine Adresse im Terminal aus.
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
