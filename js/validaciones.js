/* =============================================================
   Validaciones de formularios — Ferretería Los Maestros
   Valida mientras el usuario escribe (evento "input") y muestra
   mensajes de error debajo de cada campo.
   Necesita que js/regiones.js esté cargado antes que este archivo.
   ============================================================= */

// Correos permitidos: solo estos 3 dominios
let dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/* ---------- Función que muestra u oculta el mensaje de error ---------- */

function marcarCampo(input, mensaje) {
  let contenedor = input.closest(".form-field");
  let spanError = null;
  if (contenedor) {
    spanError = contenedor.querySelector(".mensaje-error");
  }

  if (mensaje) {
    input.classList.add("invalido");
    input.classList.remove("valido");
    if (spanError) {
      spanError.textContent = mensaje;
    }
    return false;
  } else {
    input.classList.remove("invalido");
    input.classList.add("valido");
    if (spanError) {
      spanError.textContent = "";
    }
    return true;
  }
}

function mostrarAlertaFormulario(form, tipo, texto) {
  let alerta = form.querySelector(".form-alert");
  if (!alerta) {
    return;
  }
  alerta.textContent = texto;
  alerta.classList.remove("exito", "fracaso");
  alerta.classList.add(tipo);
}

/* ---------- Validaciones individuales ---------- */

function validarRequerido(input, etiqueta) {
  let valor = input.value.trim();
  if (valor === "") {
    return marcarCampo(input, etiqueta + " es obligatorio.");
  }
  return marcarCampo(input, "");
}

function validarRequeridoYMax(input, max, etiqueta) {
  let valor = input.value.trim();
  if (valor === "") {
    return marcarCampo(input, etiqueta + " es obligatorio.");
  }
  if (valor.length > max) {
    return marcarCampo(input, etiqueta + " no puede superar " + max + " caracteres.");
  }
  return marcarCampo(input, "");
}

// Revisa si un correo termina en alguno de los dominios permitidos
function tieneDominioPermitido(correo) {
  let correoMinuscula = correo.toLowerCase();
  for (let i = 0; i < dominiosPermitidos.length; i++) {
    let dominio = dominiosPermitidos[i];
    let inicio = correoMinuscula.length - dominio.length;
    if (correoMinuscula.indexOf(dominio) === inicio) {
      return true;
    }
  }
  return false;
}

function validarCorreo(input, requerido) {
  if (requerido === undefined) {
    requerido = true;
  }
  let valor = input.value.trim();

  if (valor === "") {
    if (requerido) {
      return marcarCampo(input, "El correo es obligatorio.");
    }
    return marcarCampo(input, "");
  }
  if (valor.length > 100) {
    return marcarCampo(input, "El correo no puede superar 100 caracteres.");
  }
  if (valor.indexOf("@") === -1 || !tieneDominioPermitido(valor)) {
    return marcarCampo(input, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
  }
  return marcarCampo(input, "");
}

function validarPassword(input) {
  let valor = input.value;
  if (valor === "") {
    return marcarCampo(input, "La contraseña es obligatoria.");
  }
  if (valor.length < 4 || valor.length > 10) {
    return marcarCampo(input, "Debe tener entre 4 y 10 caracteres.");
  }
  return marcarCampo(input, "");
}

function validarConfirmPassword(inputPass, inputConfirm) {
  if (inputConfirm.value === "") {
    return marcarCampo(inputConfirm, "Confirma tu contraseña.");
  }
  if (inputConfirm.value !== inputPass.value) {
    return marcarCampo(inputConfirm, "Las contraseñas no coinciden.");
  }
  return marcarCampo(inputConfirm, "");
}

// Revisa que el texto tenga solo números, y al final opcionalmente una "K"
function esFormatoRutValido(rut) {
  for (let i = 0; i < rut.length; i++) {
    let caracter = rut.charAt(i);
    let esUltimo = (i === rut.length - 1);
    let esDigito = (caracter >= "0" && caracter <= "9");
    let esK = (esUltimo && (caracter === "K" || caracter === "k"));
    if (!esDigito && !esK) {
      return false;
    }
  }
  return true;
}

// Calcula el dígito verificador de un RUT chileno (algoritmo módulo 11)
function validarRut(rut) {
  if (!esFormatoRutValido(rut)) {
    return false;
  }
  if (rut.length < 7 || rut.length > 9) {
    return false;
  }

  let dv = rut.charAt(rut.length - 1).toUpperCase();
  let cuerpo = rut.substring(0, rut.length - 1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma = suma + multiplo * parseInt(cuerpo.charAt(i));
    multiplo = multiplo + 1;
    if (multiplo > 7) {
      multiplo = 2;
    }
  }

  let resto = 11 - (suma % 11);
  let dvCalculado = "";
  if (resto === 11) {
    dvCalculado = "0";
  } else if (resto === 10) {
    dvCalculado = "K";
  } else {
    dvCalculado = resto.toString();
  }

  return dv === dvCalculado;
}

function validarRutInput(input) {
  let valor = input.value.trim();
  if (valor === "") {
    return marcarCampo(input, "El RUN es obligatorio.");
  }
  if (valor.length < 7 || valor.length > 9) {
    return marcarCampo(input, "El RUN debe tener entre 7 y 9 caracteres.");
  }
  if (!validarRut(valor)) {
    return marcarCampo(input, "RUN inválido. Ej: 19011022K (sin puntos ni guion).");
  }
  return marcarCampo(input, "");
}

/* ---------- Región / comuna dinámicas (formulario de registro) ---------- */

function inicializarRegionComuna() {
  if (typeof poblarRegiones !== "function") {
    return; // regiones.js no está cargado en esta página
  }
  poblarRegiones("region", "comuna", function () {
    marcarCampo(document.getElementById("region"), "");
  });
}

/* ---------- Formulario: Iniciar sesión ---------- */

function inicializarFormLogin() {
  let form = document.getElementById("form-login");
  if (!form) {
    return;
  }

  let email = document.getElementById("email");
  let password = document.getElementById("password");

  email.addEventListener("input", function () {
    validarCorreo(email, true);
  });
  password.addEventListener("input", function () {
    validarPassword(password);
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let okEmail = validarCorreo(email, true);
    let okPass = validarPassword(password);

    if (okEmail && okPass) {
      mostrarAlertaFormulario(form, "exito", "Inicio de sesión exitoso. Redirigiendo...");
    } else {
      mostrarAlertaFormulario(form, "fracaso", "Revisa los campos marcados en rojo.");
    }
  });
}

/* ---------- Formulario: Registro de usuario ---------- */

function inicializarFormRegistro() {
  let form = document.getElementById("form-registro");
  if (!form) {
    return;
  }

  let run = document.getElementById("run");
  let nombre = document.getElementById("nombre");
  let apellidos = document.getElementById("apellidos");
  let correo = document.getElementById("correo");
  let password = document.getElementById("password");
  let confirmar = document.getElementById("confirmar-password");
  let region = document.getElementById("region");
  let comuna = document.getElementById("comuna");
  let direccion = document.getElementById("direccion");

  run.addEventListener("input", function () {
    validarRutInput(run);
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
  if (password) {
    password.addEventListener("input", function () {
      validarPassword(password);
    });
  }
  if (confirmar) {
    confirmar.addEventListener("input", function () {
      validarConfirmPassword(password, confirmar);
    });
  }
  direccion.addEventListener("input", function () {
    validarRequeridoYMax(direccion, 300, "La dirección");
  });
  region.addEventListener("change", function () {
    validarRequerido(region, "La región");
  });
  comuna.addEventListener("change", function () {
    validarRequerido(comuna, "La comuna");
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let okRun = validarRutInput(run);
    let okNombre = validarRequeridoYMax(nombre, 50, "El nombre");
    let okApellidos = validarRequeridoYMax(apellidos, 100, "Los apellidos");
    let okCorreo = validarCorreo(correo, true);
    let okPassword = true;
    let okConfirmar = true;
    if (password) {
      okPassword = validarPassword(password);
    }
    if (confirmar) {
      okConfirmar = validarConfirmPassword(password, confirmar);
    }
    let okRegion = validarRequerido(region, "La región");
    let okComuna = validarRequerido(comuna, "La comuna");
    let okDireccion = validarRequeridoYMax(direccion, 300, "La dirección");

    let todoValido = okRun && okNombre && okApellidos && okCorreo && okPassword &&
      okConfirmar && okRegion && okComuna && okDireccion;

    if (todoValido) {
      mostrarAlertaFormulario(form, "exito", "¡Registro exitoso! Ya puedes iniciar sesión.");
      form.reset();
      let camposValidos = document.querySelectorAll("#form-registro .valido");
      for (let i = 0; i < camposValidos.length; i++) {
        camposValidos[i].classList.remove("valido");
      }
    } else {
      mostrarAlertaFormulario(form, "fracaso", "Revisa los campos marcados en rojo antes de continuar.");
    }
  });
}

/* ---------- Formulario: Contacto ---------- */

function inicializarFormContacto() {
  let form = document.getElementById("form-contacto");
  if (!form) {
    return;
  }

  let nombre = document.getElementById("nombre-contacto");
  let correo = document.getElementById("correo-contacto");
  let mensaje = document.getElementById("mensaje-contacto");

  nombre.addEventListener("input", function () {
    validarRequeridoYMax(nombre, 100, "El nombre");
  });
  correo.addEventListener("input", function () {
    validarCorreo(correo, false);
  });
  mensaje.addEventListener("input", function () {
    validarRequeridoYMax(mensaje, 500, "El mensaje");
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let okNombre = validarRequeridoYMax(nombre, 100, "El nombre");
    let okCorreo = validarCorreo(correo, false);
    let okMensaje = validarRequeridoYMax(mensaje, 500, "El mensaje");

    if (okNombre && okCorreo && okMensaje) {
      mostrarAlertaFormulario(form, "exito", "¡Gracias! Tu mensaje fue enviado correctamente.");
      form.reset();
      let camposValidos = document.querySelectorAll("#form-contacto .valido");
      for (let i = 0; i < camposValidos.length; i++) {
        camposValidos[i].classList.remove("valido");
      }
    } else {
      mostrarAlertaFormulario(form, "fracaso", "Revisa los campos marcados en rojo.");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  inicializarRegionComuna();
  inicializarFormLogin();
  inicializarFormRegistro();
  inicializarFormContacto();
});
