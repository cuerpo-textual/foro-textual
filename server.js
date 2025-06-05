const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "mensajes.json";
const ADMIN_KEY = process.env.ADMIN_KEY || "secreto";

app.use(cors());
app.use(bodyParser.json());

const loadMensajes = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch {
    return [];
  }
};

const saveMensajes = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get("/mensajes", (req, res) => {
  res.json(loadMensajes());
});

app.post("/post", (req, res) => {
  const { nombre, texto, respuestaA } = req.body;
  if (!nombre || !texto) return res.status(400).send("Falta nombre o texto.");

  const mensajes = loadMensajes();
  const nuevo = {
    id: Date.now().toString(),
    nombre,
    texto,
    respuestaA: respuestaA || null,
    fecha: new Date().toISOString()
  };
  mensajes.push(nuevo);
  saveMensajes(mensajes);
  res.json({ ok: true, mensaje: nuevo });
});

app.post("/borrar", (req, res) => {
  const { id, clave } = req.body;
  if (clave !== ADMIN_KEY) return res.status(403).send("Clave incorrecta.");

  let mensajes = loadMensajes();
  mensajes = mensajes.filter((m) => m.id !== id);
  saveMensajes(mensajes);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log("Foro backend en http://localhost:" + PORT);
});
