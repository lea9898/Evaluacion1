let productosIniciales = [
  { id: "MC001", nombre: "Cemento Polpaico gris 25 kg", categoria: "Mat. Construcción", subcategoria: "Cementos", precio: 5990, stock: 80, stockCritico: 15, descripcion: "Cemento gris de uso general, ideal para hormigones, morteros y estucos.", imagen: "images/cemento-polpaico.avif" },
  { id: "MC002", nombre: "Cemento Melón blanco 25 kg", categoria: "Mat. Construcción", subcategoria: "Cementos", precio: 7490, stock: 40, stockCritico: 10, descripcion: "Cemento blanco especial para terminaciones decorativas y estucos finos.", imagen: "images/cemento-melon.webp" },
  { id: "MC003", nombre: "Mortero cola cerámica 25 kg", categoria: "Mat. Construcción", subcategoria: "Morteros", precio: 5200, stock: 50, stockCritico: 10, descripcion: "Adhesivo cementicio para la instalación de cerámicas y porcelanatos.", imagen: "images/mortero-cola.webp" },
  { id: "MC004", nombre: "Mortero nivelador piso 25 kg", categoria: "Mat. Construcción", subcategoria: "Morteros", precio: 6490, stock: 30, stockCritico: 8, descripcion: "Autonivelante ideal para dejar pisos listos antes de instalar el piso final.", imagen: "images/mortero-nivelador.webp" },
  { id: "MC005", nombre: "Arena fina construcción 25 kg", categoria: "Mat. Construcción", subcategoria: "Áridos", precio: 1800, stock: 60, stockCritico: 15, descripcion: "Árido fino tamizado, apto para morteros, estucos y hormigones.", imagen: "images/arena-fina.jpg" },
  { id: "MC006", nombre: "Ripio 25 kg", categoria: "Mat. Construcción", subcategoria: "Áridos", precio: 1500, stock: 60, stockCritico: 15, descripcion: "Árido grueso utilizado como base para hormigones y rellenos.", imagen: "images/ripio.jpg" }
];

// Solo se cargan los productos de fábrica si aún no existen en el navegador,
// así el trabajo hecho desde el panel de administración no se pierde al recargar.
if (!localStorage.getItem("productos")) {
  localStorage.setItem("productos", JSON.stringify(productosIniciales));
}