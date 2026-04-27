const express = require("express");
const { m } = require("framer-motion");
//instanciar app
const app = express();
//aca le decimos middelware para json
app.use(express.json());
//configurar puerto
const PORT = 3000;
//definir las rutas
//req = request(lo que viene del cliente)
//res = response(lo que enviamos al cliente)
app.get("/", (req, res) => {
  res.send("Hola mundo desde back");
});

let users = [{ id: 1, nombre: "Chris" }];

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
    if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }
    res.json(user);
});

app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }
    users[index] = { id, ...req.body };
    res.json({
        message: "Usuario actualizado",
        user: users[index]
    });
});

app.post("/users", (req, res) => {
  const nuevo = { id: users.length + 1, ...req.body };
  users.push(nuevo);
  res.status(201).json(nuevo);
});

//agregar nombre con validacion
app.post("/users", (req, res) => {
    const { nombre } = req.body;
    if(!nombre||nombre.trim()===''){
        return res.status(400).json({
            error: "El nombre es requerido"
        });
    }
  const nuevo = { id: users.length + 1, ...nombre };
  users.push(nuevo);
  res.status(201).json(nuevo);
});

app.delete("/users/:id", (req, res) => {
  const idDelete = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === idDelete);
  if (index === -1) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      message: `No existe n usuario con el id ${idDelete}`,
    });
  }
  const userEliminado = users.splice(index, 1);
  res.json({
    message: "Usuario eliminado",
    user: userEliminado[0],
  });
});

//***Tarea CRUD a tablas de la BD***

//**METODOS DE APOYO**
//BUSQUEDA DE ID
function buscarId(tabla, id, i = 0) {
  if (i === tabla.length) {
    return -1;
  }
  if (tabla[i].id === id) {
    return tabla[i];
  }
  return buscarId(tabla, id, i + 1);
}
const validarExistencia = (tabla, nombreCampo) => {
    return (req, res, next) => {
        const idV = req.body[nombreCampo];
        const resBus = buscarId(tabla, idV);
        if (resBus === -1) {
            return res.status(404).json({
                error: "Registro no encontrado",
                message: `No existe un registro con el ID ${idV} en la tabla de referencia.`,
            });
        }
        next();
    };
};

//Estos son las tablas de mentira, arreglos con datos de la BD
let academias = [
    { id: 1, nombre: "Chao team", entrenador: "Adrian chao", direccion: "fortnite2", telefono: "6141111111" }, 
    { id: 2, nombre: "Ikki team", entrenador: "Pedro zapata", direccion: "fortnite3", telefono: "6141121212" }];
let peleadores = [
    { id: 1, idAcademia: 2, nombre: "Jesus Leos", apodo: "Kikin La Cabra", peso: 80.5, nivel: "Avanzado", telefono: "6144956596" },
    { id: 2, idAcademia: 3, nombre: "Kevin Meza", apodo: "Peloncillo", peso: 80.5, nivel: "Avanzado", telefono: "6141111111" }];
let matchups = [{}];
let torneos = [{}];
let combates = [{}];
//**ACADEMIAS**
//Aqui no se cambia mucho por que no dependemos de otras tablas para trabajar

app.get("/academias", (req, res) => {
  res.json(academias);
});

app.post("/academias", (req, res) => {
  const nuevo = { id: academias.length + 1, ...req.body };
  academias.push(nuevo);
  res.status(201).json(nuevo);
});

app.delete("/academias/:id", (req, res) => {
  const idDelete = parseInt(req.params.id);
  const index = academias.findIndex((a) => a.id === idDelete);
  if (index === -1) {
    return res.status(404).json({
      error: "Academia no encontrada",
      message: `No existe n academia con el id ${idDelete}`,
    });
  }
  const academiaEliminada = academias.splice(index, 1);
  res.json({
    message: "Academia eliminada",
    academia: academiaEliminada[0],
  });
});

//PUT - ACTUALIZAR
app.put("/academias/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = academias.findIndex((a) => a.id === id);
    if (index === -1) {
    return res.status(404).json({
      error: "Academia no encontrada"
    });
  }
    academias[index] = { id, ...req.body };
    res.json({
        message: "Academia actualizada",
        academia: academias[index]
    });
});

//**PELEADORES**
app.get("/peleadores", (req, res) => {
  res.json(peleadores);
});

app.post("/peleadores",validarExistencia(academias, "idAcademia"), (req, res) => {
  const nueva = { id: peleadores.length + 1, ...req.body };
  peleadores.push(nueva);
  res.status(201).json(nueva);
});

app.delete("/peleadores/:id", (req, res) => {
  const idDelete = parseInt(req.params.id);
  const index = peleadores.findIndex((p) => p.id === idDelete);
  if (index === -1) {
    return res.status(404).json({
      error: "Peleador no encontrado",
      message: `No existe n peleador con el id ${idDelete}`,
    });
  }
  const peleadorEliminado = peleadores.splice(index, 1);
  res.json({
    message: "Peleador eliminado",
    peleador: peleadorEliminado[0],
  });
});

//PUT - ACTUALIZAR
app.put("/peleadores/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = peleadores.findIndex((p) => p.id === id);
    if (index === -1) {
    return res.status(404).json({
      error: "Peleador no encontrado"
    });
  }
    peleadores[index] = { id, ...req.body };
    res.json({
        message: "Peleador actualizado",
        peleador: peleadores[index]
    });
});

//**TORNEOS**
app.get("/torneos", (req, res) => {
  res.json(torneos);
});

app.post("/torneos", (req, res) => {
  const nuevo = { id: torneos.length + 1, ...req.body };
  torneos.push(nuevo);
  res.status(201).json(nuevo);
});

app.delete("/torneos/:id", (req, res) => {
  const idDelete = parseInt(req.params.id);
  const index = torneos.findIndex((t) => t.id === idDelete);
  if (index === -1) {
    return res.status(404).json({
      error: "Torneo no encontrado",
      message: `No existe n torneo con el id ${idDelete}`,
    });
  }
  const torneoEliminado = torneos.splice(index, 1);
  res.json({
    message: "Torneo eliminado",
    torneo: torneoEliminado[0],
  });
});

//PUT - ACTUALIZAR
app.put("/torneos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = torneos.findIndex((t) => t.id === id);
    if (index === -1) {
    return res.status(404).json({
      error: "Torneo no encontrado"
    });
  }
    torneos[index] = { id, ...req.body };
    res.json({
        message: "Torneo actualizado",
        torneo: torneos[index]
    });
});

//**COMBATES**
app.get("/combates", (req, res) => {
  res.json(combates);
});

app.post("/combates",validarExistencia(torneos, "idTorneo"),(req, res) => {
  const nueva = { id: combates.length + 1, ...req.body };
  combates.push(nueva);
  res.status(201).json(nueva);
});

app.delete("/combates/:id", (req, res) => {
  const idDelete = parseInt(req.params.id);
  const index = combates.findIndex((c) => c.id === idDelete);
  if (index === -1) {
    return res.status(404).json({
      error: "Combate no encontrado",
      message: `No existe n combate con el id ${idDelete}`,
    });
  }
  const combateEliminado = combates.splice(index, 1);
  res.json({
    message: "Combate eliminado",
    combate: combateEliminado[0],
  });
});

//PUT - ACTUALIZAR
app.put("/combates/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = combates.findIndex((c) => c.id === id);
    if (index === -1) {
    return res.status(404).json({
      error: "Combate no encontrado"
    });
  }
    combates[index] = { id, ...req.body };
    res.json({
        message: "Combate actualizado",
        combate: combates[index]
    });
});

//**MATCHUPS**
app.get("/matchups", (req, res) => {
  res.json(matchups);
});

app.post("/matchups",validarExistencia(peleadores, "idPeleador"),validarExistencia(combates, "idCombate"), (req, res) => {
  const nueva = { id: matchups.length + 1, ...req.body };
  matchups.push(nueva);
  res.status(201).json(nueva);
});

app.delete("/matchups/:id", (req, res) => {
  const idDelete = parseInt(req.params.id);
  const index = matchups.findIndex((p) => p.id === idDelete);
  if (index === -1) {
    return res.status(404).json({
      error: "Matchup no encontrado",
      message: `No existe n matchup con el id ${idDelete}`,
    });
  }
  const matchupEliminado = matchups.splice(index, 1);
  res.json({
    message: "Matchup eliminado",
    matchup: matchupEliminado[0],
  });
});

//PUT - ACTUALIZAR
app.put("/matchups/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = matchups.findIndex((p) => p.id === id);
    if (index === -1) {
    return res.status(404).json({
      error: "Matchup no encontrado"
    });
  }
    matchups[index] = { id, ...req.body };
    res.json({
        message: "Matchup actualizado",
        matchup: matchups[index]
    });
});

//levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
