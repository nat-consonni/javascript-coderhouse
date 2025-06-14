//
// Trae todos los productos disponibles de todas las tiendas
function obtenerProductosDisponibles() {
  return tiendas.flatMap(tienda =>
    tienda.productos
      .filter(p => p.disponible)
      .map(p => {
        const nuevoProducto = Object.assign({}, p); // clona el producto
        nuevoProducto.tienda = tienda.nombre;       // agrega el nombre de la tienda
        return nuevoProducto;
      })
  );
}



//
// Trae solo los productos destacados (y disponibles) de todas las tiendas
// vi esta forma para hacer de esta forma: `...p` en MDN como "spread operator", sirve para clonar objetos y agregarles cosas nuevas.
// Más info: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax
//
function obtenerProductosDestacados() {
  return tiendas.flatMap(tienda =>
    tienda.productos
      .filter(p => p.disponible && p.destacado)
      .map(p => ({
        ...p,
        tienda: tienda.nombre
      }))
  );
}


// Variables globales y elementos del DOM
let productos = obtenerProductosDisponibles();
let carrito = JSON.parse(localStorage.getItem("carrito")) || []; // podríamos agregar un modal para confirmar si se quiere guardar antes de salir

const inputBusqueda = document.getElementById("busqueda");
const btnBuscar = document.getElementById("btn-buscar");
const contenedorResultados = document.getElementById("resultados");
const mensajeSinResultados = document.getElementById("sin-resultados");
const contenedorCarrito = document.getElementById("carrito");
const btnVaciar = document.getElementById("btn-vaciar");

//
// Muestra los productos destacados en su sección
//no quede muy conforme en como hice el card.innerHTML... creo se podría optimizar
// estaria bueno despues agregar la cantidad, y que el icono de carrito cambiara a eliminar o algo asi
function mostrarProductosDestacados(productos) {
  const contenedorDestacados = document.getElementById("productos-destacados");
  contenedorDestacados.innerHTML = "";

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.className = "col-3 card-producto p-2";

    const paises = producto.paisesPreferencia.join(", ");

    card.innerHTML = `
      <div class="card p-4">
      <p class="tienda">${producto.tienda}</p>
      <h5>${producto.nombre}</h5>
      <p>Marca: ${producto.marca}</p>
      <p>Origen: ${paises}</p>
      <div class="row footer">
        <div class="col-6 pl-0">
          <p class="precio"><span>Precio:</span> $ ${producto.precio}</p>
        </div>
        <div class="col-6 pr-0 text-right">
          <button class="btn btn-sm" data-id="${producto.id}">
            <i class="bi bi-cart-plus-fill"></i> Agregar
          </button>
        </div>
      </div>
      </div>
    `;

    contenedorDestacados.appendChild(card);
  });
}

//
// Muestra los productos que resultaron de una búsqueda
// y mensaje de error
function mostrarProductos(productos) {
  const hayBusqueda = inputBusqueda.value.trim() !== "";

  const wrapper = document.getElementById("resultados-busqueda-wrapper");

  if (!hayBusqueda) {
    wrapper.classList.add("d-none");
    mensajeSinResultados.classList.add("d-none");
    contenedorResultados.innerHTML = "";
    return;
  }

  wrapper.classList.remove("d-none");
  contenedorResultados.innerHTML = "";

  if (productos.length === 0) {
    mensajeSinResultados.classList.remove("d-none");
    return;
  }

  mensajeSinResultados.classList.add("d-none");

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4 col-lg-3 card-producto p-2";

    const paises = producto.paisesPreferencia.join(", ");

    card.innerHTML = `
      <div class="card p-4 h-100">
        <p class="tienda">${producto.tienda}</p>
        <h5>${producto.nombre}</h5>
        <p>Marca: ${producto.marca}</p>
        <p>Origen: ${paises}</p>
        <div class="row footer">
          <div class="col-6 pl-0">
            <p class="precio"><span>Precio:</span> $ ${producto.precio}</p>
          </div>
          <div class="col-6 pr-0 text-right">
            <button class="btn btn-sm" data-id="${producto.id}">
              <i class="bi bi-cart-plus-fill"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    `;

    contenedorResultados.appendChild(card);
  });
}


//
// Muestra los productos que están en el carrito
function mostrarCarrito() {
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.className = "card-producto mb-2";

    const paises = item.paisesPreferencia.join(", ");

    div.innerHTML = `
      <div class="card p-2">
      <div class="row">
        <div class="col-8 pl-0">
          <p><strong>${item.nombre}</strong></p>
          <p>Marca: ${item.marca}</p>
          <p class="precio"><span>Precio:</span> $ ${item.precio}</p>
        </div>
        <div class="col-4 pr-0 text-right">
          
          <button class="btn text-color-danger p-0" data-id="${item.id}">
            <i class="bi bi-x-circle"></i> <span class="d-none">Quitar</span>
          </button>
          </div>
        </div>
      </div>
      
    `;

    contenedorCarrito.appendChild(div);
  });

}



//
// Filtra productos según la búsqueda del usuario
function buscarProductos() {
  const query = inputBusqueda.value.trim().toLowerCase();

  if (query === "") {
    mostrarProductos([]);
    return;
  }

  const resultados = productos.filter(p =>
    p.nombre.toLowerCase().includes(query) ||
    p.marca.toLowerCase().includes(query) ||
    p.paisesPreferencia.some(pais => pais.toLowerCase().includes(query))
  );

  mostrarProductos(resultados);
}

//
// Agrega un producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);

  if (producto && !carrito.find(p => p.id === producto.id)) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

//
// Quita un producto del carrito
function quitarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

//
// Vacía el carrito completo
function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
}

//
// Eventos del DOM
btnBuscar.addEventListener("click", buscarProductos);
// También permitir buscar al presionar Enter en el input
inputBusqueda.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscarProductos();
  }
});

//inputBusqueda.addEventListener("input", buscarProductos); // búsqueda en tiempo real ME VOLVIA LOCA ESTO ja


contenedorResultados.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
    agregarAlCarrito(e.target.dataset.id);
  }
});

contenedorCarrito.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
    quitarDelCarrito(e.target.dataset.id);
  }
});

btnVaciar.addEventListener("click", vaciarCarrito);



//
// Con este se me rompio todo mil veces
//
const iconoBusqueda = document.getElementById("icono-busqueda");
const wrapperResultados = document.getElementById("resultados-busqueda-wrapper");

// evento al escribir para actualizar el ícono del botón
inputBusqueda.addEventListener("input", () => {
  const valor = inputBusqueda.value.trim();
  if (valor !== "") {
    iconoBusqueda.classList.remove("bi-search-heart");
    iconoBusqueda.classList.add("bi-x-circle");
  } else {
    iconoBusqueda.classList.add("bi-search-heart");
    iconoBusqueda.classList.remove("bi-x-circle");
    wrapperResultados.classList.add("d-none");
    mensajeSinResultados.classList.add("d-none");
    contenedorResultados.innerHTML = "";
  }
});

// Evento click en el botón (buscar o limpiar)
btnBuscar.addEventListener("click", () => {
  const valor = inputBusqueda.value.trim();
  if (valor === "") return;

  // Si el ícono es una "x", limpia
  if (iconoBusqueda.classList.contains("bi-x-circle")) {
    inputBusqueda.value = "";
    iconoBusqueda.classList.add("bi-search-heart");
    iconoBusqueda.classList.remove("bi-x-circle");

    wrapperResultados.classList.add("d-none");
    mensajeSinResultados.classList.add("d-none");
    contenedorResultados.innerHTML = "";
    return;
  }

  // Si el ícono es de búsqueda, ejecuta la búsqueda
  buscarProductos();
});
// WOW NO PUEDO CREER QUE FUNCIONOOOOO


//
//
// se me ocurrió que el carrito sea algo flotante en la pagina
const btnCarritoFlotante = document.getElementById("btn-carrito-flotante");
const burbujaCarrito = document.getElementById("burbuja-carrito");

// Mostrar/ocultar burbuja
btnCarritoFlotante.addEventListener("click", () => {
  burbujaCarrito.classList.toggle("d-none");
});

// Ocultar burbuja si se clickea afuera
document.addEventListener("click", (e) => {
  const esClickInterno = burbujaCarrito.contains(e.target) || btnCarritoFlotante.contains(e.target);
  if (!esClickInterno) {
    burbujaCarrito.classList.add("d-none");
  }
});


//
// Inicialización al cargar la página
mostrarCarrito(); // muestra lo que ya había en el carrito
mostrarProductosDestacados(obtenerProductosDestacados()); // muestra los productos destacados al principio
