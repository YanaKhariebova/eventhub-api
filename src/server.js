import app from "./app.js";

const PORT = process.env.PORT || 3000;

//Wir starten den Server und geben seine Adresse im Terminal aus.
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
