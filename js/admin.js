/* =============================================================
   Mantenedor de PRODUCTOS — Panel de administración
   Permite Crear, Listar, Editar y Eliminar productos.
   ============================================================= */

function obtenerProductosAdmin() {
  let datosGuardados = localStorage.getItem("productos");
  if (!datosGuardados) {
    return [];
  }
  return JSON.parse(datosGuardados);
}

function guardarProductosAdmin(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function formatearPrecio(numero) {
  return "$" + Number(numero).toLocaleString("es-CL");
}

// Genera un código de producto que no se repita, ej: PROD007
function generarCodigoProducto(productos) {
  let numero = productos.length + 1;
  let codigo = "PROD" + String(numero).padStart(3, "0");

  let existe = true;
  while (existe) {
    existe = false;
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id === codigo) {
        existe = true;
      }
    }
    if (existe) {
      numero = numero + 1;
      codigo = "PROD" + String(numero).padStart(3, "0");
    }
  }

  return codigo;
}

function renderizarTablaAdmin() {
  let tbody = document.getElementById("tbody-productos");
  if (!tbody) {
    return;
  }

  let productos = obtenerProductosAdmin();
  tbody.innerHTML = "";

  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#667085;padding:24px;">Aún no hay productos cargados.</td></tr>';
    return;
  }

  for (let i = 0; i < productos.length; i++) {
    let p = productos[i];

    let stockTexto = p.stock;
    if (p.stockCritico !== undefined && p.stockCritico !== "" && p.stock <= p.stockCritico) {
      stockTexto = '<span class="badge" style="background:#ffe4e4;color:#b91c1c;">' + p.stock + ' ⚠</span>';
    }

    let fila = document.createElement("tr");
    fila.innerHTML =
      '<td><img src="' + p.imagen + '" alt="' + p.nombre + '" style="width:56px;height:56px;object-fit:contain;background:#f7f8fa;border-radius:6px;"></td>' +
      '<td>' + p.id + '</td>' +
      '<td>' + p.nombre + '</td>' +
      '<td>' + p.categoria + '</td>' +
      '<td>' + formatearPrecio(p.precio) + '</td>' +
      '<td>' + stockTexto + '</td>' +
      '<td style="display:flex;gap:6px;">' +
      '<button type="button" class="btn-outline" onclick="iniciarEdicionProducto(\'' + p.id + '\')">Editar</button>' +
      '<button type="button" class="btn-outline" onclick="eliminarProductoAdmin(\'' + p.id + '\')">Eliminar</button>' +
      '</td>';

    tbody.appendChild(fila);
  }
}

let productoEditandoId = null;

function iniciarEdicionProducto(id) {
  let productos = obtenerProductosAdmin();
  let producto = null;
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) {
      producto = productos[i];
    }
  }
  if (!producto) {
    return;
  }

  productoEditandoId = id;
  document.getElementById("producto-editando-id").value = id;
  document.getElementById("nombre-prod").value = producto.nombre;
  document.getElementById("cat-prod").value = producto.categoria;
  document.getElementById("precio-prod").value = producto.precio;
  document.getElementById("stock-prod").value = producto.stock;

  if (producto.stockCritico === undefined) {
    document.getElementById("stock-critico-prod").value = "";
  } else {
    document.getElementById("stock-critico-prod").value = producto.stockCritico;
  }

  if (producto.imagen && producto.imagen.indexOf("http") === 0) {
    document.getElementById("imagen-prod").value = producto.imagen;
  } else {
    document.getElementById("imagen-prod").value = "";
  }

  if (producto.descripcion) {
    document.getElementById("descripcion-prod").value = producto.descripcion;
  } else {
    document.getElementById("descripcion-prod").value = "";
  }

  document.getElementById("btn-guardar-prod").textContent = "Actualizar producto";
  document.getElementById("btn-cancelar-prod").style.display = "inline-block";
  document.getElementById("form-producto-admin").scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicionProducto() {
  productoEditandoId = null;
  document.getElementById("form-producto-admin").reset();
  document.getElementById("producto-editando-id").value = "";
  document.getElementById("btn-guardar-prod").textContent = "Guardar producto";
  document.getElementById("btn-cancelar-prod").style.display = "none";
}

function eliminarProductoAdmin(id) {
  let confirmacion = confirm("¿Eliminar este producto del catálogo?");
  if (!confirmacion) {
    return;
  }

  let productos = obtenerProductosAdmin();
  let productosNuevos = [];
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id !== id) {
      productosNuevos.push(productos[i]);
    }
  }

  guardarProductosAdmin(productosNuevos);
  if (productoEditandoId === id) {
    cancelarEdicionProducto();
  }
  renderizarTablaAdmin();
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarTablaAdmin();

  let formProducto = document.getElementById("form-producto-admin");
  if (!formProducto) {
    return;
  }

  formProducto.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let nombre = document.getElementById("nombre-prod").value.trim();
    let categoria = document.getElementById("cat-prod").value.trim();
    let precio = parseFloat(document.getElementById("precio-prod").value);
    let stock = parseInt(document.getElementById("stock-prod").value, 10);
    let stockCriticoRaw = document.getElementById("stock-critico-prod").value;
    let stockCritico = undefined;
    if (stockCriticoRaw !== "") {
      stockCritico = parseInt(stockCriticoRaw, 10);
    }
    let imagenIngresada = document.getElementById("imagen-prod").value.trim();
    let descripcion = document.getElementById("descripcion-prod").value.trim();

    if (!nombre || !categoria || isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0) {
      alert("Por favor completa nombre, categoría, precio y stock con valores válidos.");
      return;
    }

    let productos = obtenerProductosAdmin();

    if (productoEditandoId) {
      // Modo edición: buscamos el producto y actualizamos sus datos
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === productoEditandoId) {
          productos[i].nombre = nombre;
          productos[i].categoria = categoria;
          productos[i].subcategoria = categoria;
          productos[i].precio = precio;
          productos[i].stock = stock;
          productos[i].stockCritico = stockCritico;
          productos[i].descripcion = descripcion;
          if (imagenIngresada) {
            productos[i].imagen = imagenIngresada;
          }
        }
      }
      guardarProductosAdmin(productos);
      cancelarEdicionProducto();
    } else {
      // Modo creación: agregamos un producto nuevo
      let imagenFinal = imagenIngresada;
      if (!imagenFinal) {
        imagenFinal = "https://via.placeholder.com/300x220.png?text=" + encodeURIComponent(nombre);
      }

      let nuevoProducto = {
        id: generarCodigoProducto(productos),
        nombre: nombre,
        categoria: categoria,
        subcategoria: categoria,
        precio: precio,
        stock: stock,
        stockCritico: stockCritico,
        descripcion: descripcion,
        imagen: imagenFinal
      };
      productos.push(nuevoProducto);
      guardarProductosAdmin(productos);
      formProducto.reset();
    }

    renderizarTablaAdmin();
  });
});

function cambiarPanelAdmin(panel) {
  let panelProductos = document.getElementById("panel-productos");
  let panelUsuarios = document.getElementById("panel-usuarios");
  let tabProductos = document.getElementById("tab-productos");
  let tabUsuarios = document.getElementById("tab-usuarios");
  if (!panelProductos || !panelUsuarios) {
    return;
  }

  if (panel === "usuarios") {
    panelProductos.style.display = "none";
    panelUsuarios.style.display = "block";
    tabProductos.classList.remove("active");
    tabUsuarios.classList.add("active");
  } else {
    panelProductos.style.display = "block";
    panelUsuarios.style.display = "none";
    tabProductos.classList.add("active");
    tabUsuarios.classList.remove("active");
  }
}
