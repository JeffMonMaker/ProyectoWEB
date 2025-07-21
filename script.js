// Variables y selectores
const listaProductos = document.getElementById('lista-productos');
const carritoIcono = document.querySelector('.carrito-icono');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoSection = document.getElementById('carrito');
const carritoLista = document.getElementById('carrito-lista');
const carritoTotal = document.getElementById('carrito-total');
const cerrarCarritoBtn = document.getElementById('cerrar-carrito');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar contador en icono carrito
function actualizarContador() {
  const totalCantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  contadorCarrito.textContent = totalCantidad;
}

// Función para mostrar productos en el DOM
function mostrarProductos(productos) {
  listaProductos.innerHTML = '';
  productos.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" />
      <h3>${producto.title}</h3>
      <p>$${producto.price.toFixed(2)}</p>
      <button aria-label="Agregar ${producto.title} al carrito" data-id="${producto.id}">Agregar al carrito</button>
    `;
    listaProductos.appendChild(card);
  });
}

// Fetch a API pública para productos (ejemplo: fakestoreapi)
async function obtenerProductos() {
  try {
    const response = await fetch('https://fakestoreapi.com/products?limit=8');
    const data = await response.json();
    mostrarProductos(data);
  } catch (error) {
    listaProductos.innerHTML = '<p>Error al cargar productos.</p>';
  }
}

// Función para agregar producto al carrito
function agregarAlCarrito(id) {
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then(res => res.json())
    .then(producto => {
      const existe = carrito.find(item => item.id === producto.id);
      if (existe) {
        existe.cantidad++;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }
      guardarCarrito();
      actualizarContador();
      alert(`Se agregó "${producto.title}" al carrito.`);
    });
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar carrito con edición y total dinámico
function mostrarCarrito() {
  carritoLista.innerHTML = '';
  if (carrito.length === 0) {
    carritoLista.innerHTML = '<p>El carrito está vacío.</p>';
    carritoTotal.textContent = '';
    return;
  }
  carrito.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <span>${item.title}</span>
      <input type="number" min="1" value="${item.cantidad}" aria-label="Cantidad de ${item.title}" data-id="${item.id}" />
      <span>$${(item.price * item.cantidad).toFixed(2)}</span>
      <button aria-label="Eliminar ${item.title} del carrito" data-id="${item.id}">X</button>
    `;
    carritoLista.appendChild(div);

    // Evento para cambio cantidad
    div.querySelector('input').addEventListener('change', e => {
      const nuevaCantidad = parseInt(e.target.value);
      if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) {
        e.target.value = 1;
        return;
      }
      const producto = carrito.find(p => p.id === item.id);
      producto.cantidad = nuevaCantidad;
      guardarCarrito();
      mostrarCarrito();
      actualizarContador();
    });

    // Evento para eliminar producto
    div.querySelector('button').addEventListener('click', e => {
      carrito = carrito.filter(p => p.id !== item.id);
      guardarCarrito();
      mostrarCarrito();
      actualizarContador();
    });
  });

  // Total de compra
  const total = carrito.reduce((acc, prod) => acc + prod.price * prod.cantidad, 0);
  carritoTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Mostrar / Ocultar carrito
carritoIcono.addEventListener('click', () => {
  if (carritoSection.hasAttribute('hidden')) {
    mostrarCarrito();
    carritoSection.removeAttribute('hidden');
    carritoSection.focus();
  } else {
    carritoSection.setAttribute('hidden', '');
  }
});
cerrarCarritoBtn.addEventListener('click', () => {
  carritoSection.setAttribute('hidden', '');
});

// Validación simple del formulario de contacto con feedback
const formContacto = document.getElementById('form-contacto');
const formFeedback = document.getElementById('form-feedback');

formContacto.addEventListener('submit', e => {
  e.preventDefault();
  const nombre = formContacto.nombre.value.trim();
  const email = formContacto.email.value.trim();
  const mensaje = formContacto.mensaje.value.trim();

  if (!nombre || !email || !mensaje) {
    formFeedback.textContent = 'Por favor, completa todos los campos.';
    formFeedback.style.color = 'red';
    return;
  }

  // Validar formato básico email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formFeedback.textContent = 'Por favor, ingresa un correo válido.';
    formFeedback.style.color = 'red';
    return;
  }

  formFeedback.textContent = 'Enviando...';

  // Enviar el formulario (Formspree funciona con el submit normal)
  formContacto.submit();
});

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  obtenerProductos();
  actualizarContador();
});
