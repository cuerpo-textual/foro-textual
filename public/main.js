const BACKEND_URL = "https://foro-textual.onrender.com"; // Cámbialo por tu URL real
const ADMIN_KEY = "n1c0lovezlynx"; // Sólo si tú quieres borrar

async function cargarMensajes() {
  const res = await fetch(`${BACKEND_URL}/mensajes`);
  const mensajes = await res.json();

  const contenedor = document.querySelector("#mensajes");
  contenedor.innerHTML = "";

  mensajes.slice().reverse().forEach(({ id, nombre, texto, timestamp }) => {
    const div = document.createElement("div");
    div.className = "mensaje";
    div.innerHTML = `
      <strong>${nombre}</strong> 
      <p><em>${new Date(fecha).toLocaleString()}</em></p>
     <p class="id-mensaje">ID: ${id}</p>
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
