const getUsers = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const [rows] = await db.query("SELECT * FROM users WHERE idUsuario = ?", [idUsuario]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      message: `No existe un usuario con el id ${id}`,
    });
  }

  res.json(user);
};

const createUser = (req, res) => {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({
      error: "El nombre es obligatorio",
    });
  }

  const nuevo = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    nombre: nombre.trim(),
  };

  users.push(nuevo);

  res.status(201).json(nuevo);
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      message: `No existe un usuario con el id ${id}`,
    });
  }

  const { nombre } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({
      error: "El nombre es obligatorio",
    });
  }

  users[index] = {
    ...users[index],
    nombre: nombre.trim(),
  };

  res.json({
    message: "Usuario actualizado",
    user: users[index],
  });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      message: `No existe un usuario con el id ${id}`,
    });
  }

  const userEliminado = users.splice(index, 1);

  res.json({
    message: "Usuario eliminado",
    user: userEliminado[0],
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
