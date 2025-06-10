const BACKEND_URL = "https://foro-textual.onrender.com"; // Cámbialo por tu URL real
const ADMIN_KEY = "n1c0lovezlynx"; // Sólo si tú quieres borrar

let mensajesGlobal = [];

async function cargarMensajes() {
  const res = await fetch(`${BACKEND_URL}/mensajes`);
  const mensajes = await res.json();
  renderizarMensajes();
}

function renderizarMensajes() {
  const contenedor = document.querySelector("#mensajes");
  const orden = document.getElementById("orden").value;
  const busqueda = document.getElementById("busqueda").value.toLowerCase();
  
  let mensajesFiltrados = mensajesGlobal.filter(({ nombre, texto})) =>
    nombre.toLowerCase().includes(busqueda) || texto.toLowerCase().includes(busqueda)
  );
  
  if (orden === "recientes") {
    mensajesFiltrados = mensajesFiltrados.slice().reverse();
  }

  contenedor.innerHTML = "";
  mensajes.Filtrados.forEach(({ d, nombre, texto, timestamp}) => {
    const div = document.createElement("div");
    div.classname = "mensaje";
    div.innerHTML = `
      <strong>${nombre}</strong>
      <p><em>${new Date(timestamp).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</em></p>
      <p>${texto}</p>
    `;
    contenedor.appendChild(div);
  });
}

document.getElementById("orden").addEventListener("change", renderizarMensajes);
document.getElementById("busqueda").addEventListener("input", renderizarMensajes);


  mensajes.slice().reverse().forEach(({ id, nombre, texto, timestamp }) => {
    const div = document.createElement("div");
    div.className = "mensaje";
    div.innerHTML = `
      <strong>${nombre}</strong> 
      <p><em>${new Date(timestamp).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</em></p>
      <p>${texto}</p>
    `;
    contenedor.appendChild(div);
  });
}

document.querySelector("#formulario").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const nombre = form.nombre.value;
  const texto = form.texto.value;

  await fetch(`${BACKEND_URL}/mensajes`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre, texto })
});

  form.reset();
  cargarMensajes();
});

document.querySelector("#mensajes").addEventListener("click", async (e) => {
  if (e.target.classList.contains("borrar")) {
    const id = e.target.dataset.id;
    await fetch(`${BACKEND_URL}/borrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, clave: ADMIN_KEY })
    });
    cargarMensajes();
  }
});

cargarMensajes();
