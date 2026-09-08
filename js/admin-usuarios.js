let usuariosIniciales = [
  {
    run: "19011022K", nombre: "Camila", apellidos: "Rojas Peña",
    correo: "camila.rojas@duoc.cl", fechaNacimiento: "1992-03-10",
    tipo: "Administrador", region: "Región de Coquimbo", comuna: "La Serena",
    direccion: "Av. Francisco de Aguirre 123"
  },
  {
    run: "180432567", nombre: "Diego", apellidos: "Fernández Silva",
    correo: "diego.fernandez@gmail.com", fechaNacimiento: "1988-07-22",
    tipo: "Vendedor", region: "Región de Coquimbo", comuna: "Coquimbo",
    direccion: "Calle Aldunate 456"
  }
];

if (!localStorage.getItem("usuarios")) {
  localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
}

function obtenerUsuariosAdmin() {
  let datosGuardados = localStorage.getItem("usuarios");
  if (!datosGuardados) {
    return [];
  }
  return JSON.parse(datosGuardados);
}

function guardarUsuariosAdmin(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function claseBadgeTipo(tipo) {
  if (tipo === "Administrador") {
    return "badge-admin";
  }
  if (tipo === "Vendedor") {
    return "badge-vendedor";
  }
  return "badge-cliente";
}

function renderizarTablaUsuarios() {
  let tbody = document.getElementById("tbody-usuarios");
  if (!tbody) {
    return;
  }

  let usuarios = obtenerUsuariosAdmin();
  tbody.innerHTML = "";

  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#667085;padding:24px;">Aún no hay usuarios registrados.</td></tr>';
    return;
  }

  for (let i = 0; i < usuarios.length; i++) {
    let u = usuarios[i];
    let region = u.region;
    if (!region) {
      region = "-";
    }
    let comuna = u.comuna;
    if (!comuna) {
      comuna = "-";
    }

    let fila = document.createElement("tr");
    fila.innerHTML =
      '<td>' + u.run + '</td>' +
      '<td>' + u.nombre + ' ' + u.apellidos + '</td>' +
      '<td>' + u.correo + '</td>' +
      '<td><span class="badge ' + claseBadgeTipo(u.tipo) + '">' + u.tipo + '</span></td>' +
      '<td>' + region + ' / ' + comuna + '</td>' +
      '<td style="display:flex;gap:6px;">' +
      '<button type="button" class="btn-outline" onclick="iniciarEdicionUsuario(\'' + u.run + '\')">Editar</button>' +
      '<button type="button" class="btn-outline" onclick="eliminarUsuarioAdmin(\'' + u.run + '\')">Eliminar</button>' +
      '</td>';

    tbody.appendChild(fila);
  }
}

let usuarioEditandoRun = null;

function iniciarEdicionUsuario(run) {
  let usuarios = obtenerUsuariosAdmin();
  let usuario = null;
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].run === run) {
      usuario = usuarios[i];
    }
  }
  if (!usuario) {
    return;
  }

  usuarioEditandoRun = run;
  document.getElementById("usuario-editando-run").value = run;
  document.getElementById("run-usuario").value = usuario.run;
  document.getElementById("run-usuario").disabled = true; // el RUN es la clave, no se edita
  document.getElementById("nombre-usuario").value = usuario.nombre;
  document.getElementById("apellidos-usuario").value = usuario.apellidos;
  document.getElementById("correo-usuario").value = usuario.correo;

  if (usuario.fechaNacimiento) {
    document.getElementById("fecha-nacimiento-usuario").value = usuario.fechaNacimiento;
  } else {
    document.getElementById("fecha-nacimiento-usuario").value = "";
  }

  document.getElementById("tipo-usuario").value = usuario.tipo;
  document.getElementById("direccion-usuario").value = usuario.direccion;

  seleccionarRegionComuna("region-usuario", "comuna-usuario", usuario.region, usuario.comuna);

  document.getElementById("btn-guardar-usuario").textContent = "Actualizar usuario";
  document.getElementById("btn-cancelar-usuario").style.display = "inline-block";
  document.getElementById("form-usuario-admin").scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicionUsuario() {
  usuarioEditandoRun = null;
  let form = document.getElementById("form-usuario-admin");
  form.reset();
  document.getElementById("usuario-editando-run").value = "";
  document.getElementById("run-usuario").disabled = false;
  document.getElementById("comuna-usuario").innerHTML = "<option value=''>-- Seleccione la comuna --</option>";
  document.getElementById("btn-guardar-usuario").textContent = "Guardar usuario";
  document.getElementById("btn-cancelar-usuario").style.display = "none";

  let camposMarcados = form.querySelectorAll(".invalido, .valido");
  for (let i = 0; i < camposMarcados.length; i++) {
    camposMarcados[i].classList.remove("invalido", "valido");
  }
  let mensajes = form.querySelectorAll(".mensaje-error");
  for (let i = 0; i < mensajes.length; i++) {
    mensajes[i].textContent = "";
  }
}

function eliminarUsuarioAdmin(run) {
  let confirmacion = confirm("¿Eliminar este usuario del sistema?");
  if (!confirmacion) {
    return;
  }

  let usuarios = obtenerUsuariosAdmin();
  let usuariosNuevos = [];
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].run !== run) {
      usuariosNuevos.push(usuarios[i]);
    }
  }

  guardarUsuariosAdmin(usuariosNuevos);
  if (usuarioEditandoRun === run) {
    cancelarEdicionUsuario();
  }
  renderizarTablaUsuarios();
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarTablaUsuarios();

  if (typeof poblarRegiones === "function") {
    poblarRegiones("region-usuario", "comuna-usuario");
  }

  let form = document.getElementById("form-usuario-admin");
  if (!form) {
    return;
  }

  let run = document.getElementById("run-usuario");
  let nombre = document.getElementById("nombre-usuario");
  let apellidos = document.getElementById("apellidos-usuario");
  let correo = document.getElementById("correo-usuario");
  let tipo = document.getElementById("tipo-usuario");
  let region = document.getElementById("region-usuario");
  let comuna = document.getElementById("comuna-usuario");
  let direccion = document.getElementById("direccion-usuario");

 
  run.addEventListener("input", function () {
    if (!run.disabled) {
      validarRutInput(run);
    }
  });
  nombre.addEventListener("input", function () {
    validarRequeridoYMax(nombre, 50, "El nombre");
  });
  apellidos.addEventListener("input", function () {
    validarRequeridoYMax(apellidos, 100, "Los apellidos");
  });
  correo.addEventListener("input", function () {
    validarCorreo(correo, true);
  });
  tipo.addEventListener("change", function () {
    validarRequerido(tipo, "El tipo de usuario");
  });
  region.addEventListener("change", function () {
    validarRequerido(region, "La región");
  });
  comuna.addEventListener("change", function () {
    validarRequerido(comuna, "La comuna");
  });
  direccion.addEventListener("input", function () {
    validarRequeridoYMax(direccion, 300, "La dirección");
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let usuarios = obtenerUsuariosAdmin();
    let runValor = run.value.trim().toUpperCase();

    let okRun = true;
    if (!run.disabled) {
      okRun = validarRutInput(run);
    }
    let okNombre = validarRequeridoYMax(nombre, 50, "El nombre");
    let okApellidos = validarRequeridoYMax(apellidos, 100, "Los apellidos");
    let okCorreo = validarCorreo(correo, true);
    let okTipo = validarRequerido(tipo, "El tipo de usuario");
    let okRegion = validarRequerido(region, "La región");
    let okComuna = validarRequerido(comuna, "La comuna");
    let okDireccion = validarRequeridoYMax(direccion, 300, "La dirección");

    
    let okRunRepetido = true;
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].run === runValor && usuarios[i].run !== usuarioEditandoRun) {
        okRunRepetido = false;
      }
    }
    if (!okRunRepetido) {
      marcarCampo(run, "Ya existe un usuario con ese RUN.");
    }

    let todoValido = okRun && okNombre && okApellidos && okCorreo && okTipo &&
      okRegion && okComuna && okDireccion && okRunRepetido;

    if (!todoValido) {
      mostrarAlertaFormulario(form, "fracaso", "Revisa los campos marcados en rojo.");
      return;
    }

    let fechaNacimiento = document.getElementById("fecha-nacimiento-usuario").value;
    if (!fechaNacimiento) {
      fechaNacimiento = "";
    }

    let datosUsuario = {
      run: runValor,
      nombre: nombre.value.trim(),
      apellidos: apellidos.value.trim(),
      correo: correo.value.trim(),
      fechaNacimiento: fechaNacimiento,
      tipo: tipo.value,
      region: region.value,
      comuna: comuna.value,
      direccion: direccion.value.trim()
    };

    if (usuarioEditandoRun) {
     
      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].run === usuarioEditandoRun) {
          usuarios[i] = datosUsuario;
        }
      }
    } else {
     
      usuarios.push(datosUsuario);
    }

    guardarUsuariosAdmin(usuarios);
    renderizarTablaUsuarios();

    let mensajeExito = "Usuario creado correctamente.";
    if (usuarioEditandoRun) {
      mensajeExito = "Usuario actualizado correctamente.";
    }
    cancelarEdicionUsuario();
    mostrarAlertaFormulario(form, "exito", mensajeExito);
  });
});
