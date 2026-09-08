/* =============================================================
   Datos de Región / Comuna, compartidos entre registro.html
   y el mantenedor de usuarios del panel de administración.
   ============================================================= */

let regionesComunas = {
  "Región de Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Vicuña"],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Región Metropolitana": ["Santiago", "Maipú", "Huechuraba", "Puente Alto"]
};

// Nombres de las regiones (para recorrerlas con un for normal)
let nombresRegiones = Object.keys(regionesComunas);

/* Llena un <select> de región y prepara el cambio de comuna cuando
   el usuario elige una región. Uso: poblarRegiones("region", "comuna") */
function poblarRegiones(idSelectRegion, idSelectComuna, funcionExtra) {
  let selectReg = document.getElementById(idSelectRegion);
  let selectCom = document.getElementById(idSelectComuna);
  if (!selectReg || !selectCom) {
    return;
  }

  for (let i = 0; i < nombresRegiones.length; i++) {
    let nombreRegion = nombresRegiones[i];
    let opcion = document.createElement("option");
    opcion.value = nombreRegion;
    opcion.textContent = nombreRegion;
    selectReg.appendChild(opcion);
  }

  selectReg.addEventListener("change", function () {
    selectCom.innerHTML = "<option value=''>-- Seleccione la comuna --</option>";
    let regionElegida = selectReg.value;

    if (regionElegida) {
      let listaComunas = regionesComunas[regionElegida];
      for (let i = 0; i < listaComunas.length; i++) {
        let opcion = document.createElement("option");
        opcion.value = listaComunas[i];
        opcion.textContent = listaComunas[i];
        selectCom.appendChild(opcion);
      }
    }

    if (typeof funcionExtra === "function") {
      funcionExtra();
    }
  });
}

/* Selecciona programáticamente una región y su comuna (se usa al editar) */
function seleccionarRegionComuna(idSelectRegion, idSelectComuna, region, comuna) {
  let selectReg = document.getElementById(idSelectRegion);
  let selectCom = document.getElementById(idSelectComuna);
  if (!selectReg || !selectCom || !region) {
    return;
  }

  selectReg.value = region;
  selectCom.innerHTML = "<option value=''>-- Seleccione la comuna --</option>";

  let listaComunas = regionesComunas[region];
  if (listaComunas) {
    for (let i = 0; i < listaComunas.length; i++) {
      let opcion = document.createElement("option");
      opcion.value = listaComunas[i];
      opcion.textContent = listaComunas[i];
      selectCom.appendChild(opcion);
    }
  }

  if (comuna) {
    selectCom.value = comuna;
  }
}
