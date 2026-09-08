/* =============================================================
   Catálogo, carrito y contador del carrito
   ============================================================= */

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("contenedor-productos")) {
    renderizarCatalogo();
  }
  if (document.getElementById("contenedor-carrito")) {
    renderizarCarrito();
  }
  actualizarContadorCarrito();
});

function obtenerProductos() {
  let datosGuardados = localStorage.getItem("productos");
  if (!datosGuardados) {
    return [];
  }
  return JSON.parse(datosGuardados);
}

function formatearPrecio(numero) {
  return "$" + Number(numero).toLocaleString("es-CL");
}

function renderizarCatalogo() {
  let contenedor = document.getElementById("contenedor-productos");
  let productos = obtenerProductos();
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
    return;
  }

  for (let i = 0; i < productos.length; i++) {
    let p = productos[i];

    let textoStock = "Stock disponible: " + p.stock;
    let claseStock = "stock-info";
    if (p.stockCritico !== undefined && p.stock <= p.stockCritico) {
      textoStock = "⚠ Stock bajo: quedan " + p.stock + " unidades";
      claseStock = "stock-info stock-critico";
    }

    let categoriaMostrada = p.subcategoria;
    if (!categoriaMostrada) {
      categoriaMostrada = p.categoria;
    }

    let card = document.createElement("div");
    card.className = "card-producto";
    card.innerHTML =
      '<a href="detalle-producto.html?id=' + p.id + '" style="text-decoration:none;color:inherit;">' +
      '<img src="' + p.imagen + '" alt="' + p.nombre + '" loading="lazy">' +
      '<span class="categoria-tag">' + categoriaMostrada + '</span>' +
      '<h3>' + p.nombre + '</h3>' +
      '<p class="precio">' + formatearPrecio(p.precio) + '</p>' +
      '<p class="' + claseStock + '">' + textoStock + '</p>' +
      '</a>' +
      '<button type="button" onclick="agregarAlCarrito(\'' + p.id + '\')">Agregar a cotización</button>';

    contenedor.appendChild(card);
  }
}

function agregarAlCarrito(id) {
  let productos = obtenerProductos();
  let producto = null;

  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) {
      producto = productos[i];
    }
  }
  if (!producto) {
    return;
  }

  let carrito = obtenerCarrito();
  let yaEsta = false;

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      carrito[i].cantidad = carrito[i].cantidad + 1;
      yaEsta = true;
    }
  }

  if (!yaEsta) {
    let itemNuevo = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    };
    carrito.push(itemNuevo);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarCarrito();
  alert(producto.nombre + " fue añadido a la cotización.");
}

function obtenerCarrito() {
  let datosGuardados = localStorage.getItem("carrito");
  if (!datosGuardados) {
    return [];
  }
  return JSON.parse(datosGuardados);
}

function cambiarCantidad(id, delta) {
  let carrito = obtenerCarrito();
  let carritoNuevo = [];

  for (let i = 0; i < carrito.length; i++) {
    let item = carrito[i];
    if (item.id === id) {
      item.cantidad = item.cantidad + delta;
      if (item.cantidad > 0) {
        carritoNuevo.push(item);
      }
    } else {
      carritoNuevo.push(item);
    }
  }

  localStorage.setItem("carrito", JSON.stringify(carritoNuevo));
  actualizarContadorCarrito();
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito();
  let carritoNuevo = [];

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id !== id) {
      carritoNuevo.push(carrito[i]);
    }
  }

  localStorage.setItem("carrito", JSON.stringify(carritoNuevo));
  actualizarContadorCarrito();
  renderizarCarrito();
}

function renderizarCarrito() {
  let contenedor = document.getElementById("contenedor-carrito");
  if (!contenedor) {
    return;
  }

  let resumen = document.getElementById("resumen-total");
  let totalTexto = document.getElementById("total-carrito");
  let carrito = obtenerCarrito();
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML =
      '<div class="carrito-vacio">' +
      '<p>Tu cotización está vacía por ahora.</p>' +
      '<a href="catalogo.html" class="btn" style="display:inline-block;margin-top:12px;">Ver catálogo</a>' +
      '</div>';
    if (resumen) {
      resumen.style.display = "none";
    }
    return;
  }

  let total = 0;

  for (let i = 0; i < carrito.length; i++) {
    let item = carrito[i];
    let subtotal = item.precio * item.cantidad;
    total = total + subtotal;

    let div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML =
      '<img src="' + item.imagen + '" alt="' + item.nombre + '" style="width:64px;height:64px;object-fit:contain;background:#f7f8fa;border-radius:8px;">' +
      '<div class="detalle-item" style="flex:1;">' +
      '<h3>' + item.nombre + '</h3>' +
      '<p>Precio unitario: ' + formatearPrecio(item.precio) + '</p>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-top:6px;">' +
      '<button type="button" onclick="cambiarCantidad(\'' + item.id + '\', -1)" style="padding:4px 10px;">−</button>' +
      '<span>' + item.cantidad + '</span>' +
      '<button type="button" onclick="cambiarCantidad(\'' + item.id + '\', 1)" style="padding:4px 10px;">+</button>' +
      '</div>' +
      '</div>' +
      '<div style="text-align:right;">' +
      '<p class="subtotal">' + formatearPrecio(subtotal) + '</p>' +
      '<button type="button" onclick="eliminarDelCarrito(\'' + item.id + '\')" class="btn-outline" style="margin-top:8px;">Eliminar</button>' +
      '</div>';

    contenedor.appendChild(div);
  }

  if (resumen) {
    resumen.style.display = "flex";
  }
  if (totalTexto) {
    totalTexto.textContent = formatearPrecio(total);
  }
}

function actualizarContadorCarrito() {
  let carrito = obtenerCarrito();
  let totalItems = 0;

  for (let i = 0; i < carrito.length; i++) {
    totalItems = totalItems + carrito[i].cantidad;
  }

  let contadores = document.querySelectorAll(".cart-count");
  for (let i = 0; i < contadores.length; i++) {
    contadores[i].textContent = totalItems;
  }
}
