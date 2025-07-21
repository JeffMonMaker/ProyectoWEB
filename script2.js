let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  obtenerProductos();
  actualizarContador();
});

// ✅ Cargar productos desde el archivo JSON
function obtenerProductos() {
  fetch('productos.json')
    .then(response => response.json())
    .then(data => mostrarProductos(data))
    .catch(error => console.error("Error al cargar productos:", error));
}

// ✅ Mostrar productos en el DOM
function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedor-productos");

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("card-producto");
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
}

// ✅ Agregar al carrito
function agregarAlCarrito(producto) {
  const existe = carrito.find(p => p.id === producto.id);
  if (existe) {
    existe.cantidad++;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  guardarCarrito();
  actualizarContador();
}

// ✅ Guardar en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ✅ Cargar carrito desde localStorage
function cargarCarrito() {
  const guardado = localStorage.getItem("carrito");
  carrito = guardado ? JSON.parse(guardado) : [];
}

// ✅ Actualizar contador
function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  contador.textContent = total;
}
