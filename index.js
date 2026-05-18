const express = require("express");
const app = express();
const cors = require("cors");
const academiaRoutes = require("./routes/academia");
const combateRoutes = require("./routes/combate");
const torneoRoutes = require("./routes/torneo");
const peleadorRoutes = require("./routes/peleador");
const matchupRoutes = require("./routes/matchup");
const inscripcionRoutes = require("./routes/inscripcion");
const authRoutes = require("./auth");
const db = require("./config/db");
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/academia", academiaRoutes);
app.use("/torneo", torneoRoutes);
app.use("/combate", combateRoutes);
app.use("/peleador", peleadorRoutes);
app.use("/matchup", matchupRoutes);
app.use("/inscripcion", inscripcionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Todo chido" });
});

app.get("/migrate", async (req, res) => {
  try {
    const query = "ALTER TABLE combate ADD COLUMN categoria VARCHAR(50) AFTER idTorneo;";
    await db.query(query);
    res.json({ success: true });
  } catch (err) {
    res.json({ error: err.message });
  }
});
const testDBConnectionAndStart = async () => {
  try {
    //   await db.query ('SELECT 1')
    //   console.log('Ta funcionando')
    //   app.listen(3000, () => {
    //     console.log("Servidor corriendo en http://localhost:3000");
    //   });
    // } catch (error) {
    //   console.error('tas mal con la DB',error.message)
    //   process.exit(1)
    // }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Hay algo mal en el backend mi chavo:", error.message);
    process.exit(1);
  }
};
testDBConnectionAndStart();
