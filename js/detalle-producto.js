document.addEventListener("DOMContentLoaded", function () {
  let contenedor = document.getElementById("detalle-producto");
  if (!contenedor) {
    return;
  }

  let parametros = new URLSearchParams(window.location.search);
  let id = parametros.get("id");

  let productos = obtenerProductos();
  let producto = null;
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) {
      producto = productos[i];
    }
  }

  if (!producto) {
    contenedor.innerHTML =
      '<div class="carrito-vacio">' +
      '<p>No encontramos ese producto.</p>' +
      '<a href="catalogo.html" class="btn" style="display:inline-block;margin-top:12px;">Volver al catálogo</a>' +
      '</div>';
    document.getElementById("relacionados-wrapper").style.display = "none";
    return;
  }

  document.title = "Ferretería Los Maestros - " + producto.nombre;

  let categoriaMostrada = producto.subcategoria;
  if (!categoriaMostrada) {
    categoriaMostrada = producto.categoria;
  }

  let textoStock = "Stock disponible: " + producto.stock + " unidades";
  let claseStock = "stock-info";
  if (producto.stockCritico !== undefined && producto.stock <= producto.stockCritico) {
    textoStock = "Stock bajo: quedan " + producto.stock + " unidades";
    claseStock = "stock-info stock-critico";
  }

  let descripcionMostrada = producto.descripcion;
  if (!descripcionMostrada) {
    descripcionMostrada = "Producto disponible en nuestra ferretería. Consulta por retiro o despacho.";
  }

  let stockMaximo = producto.stock;
  if (stockMaximo < 1) {
    stockMaximo = 1;
  }

  contenedor.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;">' +
    '<div class="hero-image" style="background:#fff;border:1px solid #e2e6ec;">' +
    '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" style="max-height:320px;">' +
    '</div>' +
    '<div>' +
    '<span class="categoria-tag">' + categoriaMostrada + '</span>' +
    '<h1 class="page-title" style="margin-top:10px;">' + producto.nombre + '</h1>' +
    '<p class="precio" style="font-size:1.6rem;">' + formatearPrecio(producto.precio) + '</p>' +
    '<p class="' + claseStock + '">' + textoStock + '</p>' +
    '<p style="margin:16px 0;color:#667085;">' + descripcionMostrada + '</p>' +
    '<div class="form-field" style="max-width:160px;">' +
    '<label for="cantidad-detalle">Cantidad</label>' +
    '<input type="number" id="cantidad-detalle" value="1" min="1" max="' + stockMaximo + '">' +
    '</div>' +
    '<button type="button" id="btn-agregar-detalle" style="margin-top:10px;">Añadir a la cotización</button>' +
    '</div>' +
    '</div>';

  document.getElementById("btn-agregar-detalle").addEventListener("click", function () {
    let cantidadInput = document.getElementById("cantidad-detalle");
    let cantidad = parseInt(cantidadInput.value, 10);
    if (isNaN(cantidad) || cantidad < 1) {
      cantidad = 1;
    }

    let carrito = obtenerCarrito();
    let yaEsta = false;

    for (let i = 0; i < carrito.length; i++) {
      if (carrito[i].id === producto.id) {
        carrito[i].cantidad = carrito[i].cantidad + cantidad;
        yaEsta = true;
      }
    }

    if (!yaEsta) {
      let itemNuevo = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad
      };
      carrito.push(itemNuevo);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (typeof actualizarContadorCarrito === "function") {
      actualizarContadorCarrito();
    }
    alert(producto.nombre + " (x" + cantidad + ") fue añadido a la cotización.");
  });

  // Productos relacionados: misma categoría o subcategoría, sin el actual
  let relacionadosContenedor = document.getElementById("contenedor-relacionados");
  let relacionados = [];

  for (let i = 0; i < productos.length; i++) {
    let otro = productos[i];
    let mismaCategoria = (otro.subcategoria === producto.subcategoria) || (otro.categoria === producto.categoria);
    if (otro.id !== producto.id && mismaCategoria) {
      relacionados.push(otro);
    }
  }

  if (relacionados.length === 0) {
    document.getElementById("relacionados-wrapper").style.display = "none";
  } else {
    let html = "";
    for (let i = 0; i < relacionados.length; i++) {
      let rp = relacionados[i];
      let catRp = rp.subcategoria;
      if (!catRp) {
        catRp = rp.categoria;
      }
      html = html +
        '<div class="card-producto">' +
        '<a href="detalle-producto.html?id=' + rp.id + '" style="text-decoration:none;color:inherit;">' +
        '<img src="' + rp.imagen + '" alt="' + rp.nombre + '">' +
        '<span class="categoria-tag">' + catRp + '</span>' +
        '<h3>' + rp.nombre + '</h3>' +
        '<p class="precio">' + formatearPrecio(rp.precio) + '</p>' +
        '</a>' +
        '</div>';
    }
    relacionadosContenedor.innerHTML = html;
  }
});
