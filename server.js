const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Conexión a Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Obtener mensajes
app.get("/mensajes", async (req, res) => {
  const { data, error } = await supabase
    .from("mensajes")
    .select("*")
    .order("timestamp", { ascending: true });
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Guardar mensaje
app.post("/mensajes", async (req, res) => {
  const { nombre, texto } = req.body;
  const { data, error } = await supabase
    .from("mensajes")
    .insert([{ nombre, texto, timestamp: new Date() }]);
  if (error) return res.status(500).json({ error });
  res.status(201).json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

