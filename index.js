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

app.get("/migrate", (_req, res) => {
  res.status(403).json({ error: "Endpoint deshabilitado" });
});
const testDBConnectionAndStart = async () => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok;");

    if (rows[0]?.ok !== 1) {
      const error = new Error("Resultado inválido en la comprobación de MySQL");
      error.code = "DB_HEALTHCHECK_INVALID_RESULT";
      throw error;
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Conexión con MySQL comprobada");
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    const errorCode = /^[A-Z0-9_]+$/.test(error?.code)
      ? error.code
      : "DB_HEALTHCHECK_FAILED";
    console.error(`No se pudo comprobar la conexión con MySQL (${errorCode})`);
    process.exit(1);
  }
};
testDBConnectionAndStart();
