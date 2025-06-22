//
// 🔧 Funciones para obtener datos
//

function obtenerProductosDisponibles() {
  return tiendas.flatMap(tienda =>
    tienda.productos
      .filter(p => p.disponible)
      .map(p => ({ ...p, tienda: tienda.nombre }))
  );
}

function obtenerProductosDestacados() {
  return tiendas.flatMap(tienda =>
    tienda.productos
      .filter(p => p.disponible && p.destacado)
      .map(p => ({ ...p, tienda: tienda.nombre }))
  );
}


//
// 🎨 Funciones para mostrar en pantalla
//

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

function mostrarCarrito() {
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    btnVaciar.classList.add("d-none");
    return;
  }

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.className = "card-producto mb-2";

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

  btnVaciar.classList.remove("d-none");
}


//
// 🧠 Lógica
//

function buscarProductos() {
  const query = inputBusqueda.value.trim().toLowerCase();
  if (query === "") {
    mostrarProductos([]);
    return;
  }

  const resultados = productos.filter(p =>
    p.nombre.toLowerCase().includes(query) ||
    p.marca.toLowerCase().includes(query) ||
    p.tienda.toLowerCase().includes(query) ||
    p.paisesPreferencia.some(pais => pais.toLowerCase().includes(query))
  );

  mostrarProductos(resultados);

  // Cambiar el ícono a "x"
  iconoBusqueda.classList.remove("bi-search-heart");
  iconoBusqueda.classList.add("bi-x-circle");
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (producto && !carrito.find(p => p.id === producto.id)) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

function quitarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
}


//
// 📌 Variables globales y elementos
//

let productos = obtenerProductosDisponibles();
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const inputBusqueda = document.getElementById("busqueda");
const btnBuscar = document.getElementById("btn-buscar");
const contenedorResultados = document.getElementById("resultados");
const mensajeSinResultados = document.getElementById("sin-resultados");
const contenedorCarrito = document.getElementById("carrito");
const btnVaciar = document.getElementById("btn-vaciar");

const iconoBusqueda = document.getElementById("icono-busqueda");
const wrapperResultados = document.getElementById("resultados-busqueda-wrapper");

const btnCarritoFlotante = document.getElementById("btn-carrito-flotante");
const burbujaCarrito = document.getElementById("burbuja-carrito");


//
// 📌 Eventos
//

// Búsqueda por botón o Enter
btnBuscar.addEventListener("click", () => {
  const valor = inputBusqueda.value.trim();

  if (valor === "" && !iconoBusqueda.classList.contains("bi-x-circle")) return;

  if (iconoBusqueda.classList.contains("bi-x-circle")) {
    inputBusqueda.value = "";
    iconoBusqueda.classList.add("bi-search-heart");
    iconoBusqueda.classList.remove("bi-x-circle");

    wrapperResultados.classList.add("d-none");
    mensajeSinResultados.classList.add("d-none");
    contenedorResultados.innerHTML = "";
    return;
  }

  buscarProductos();
});

inputBusqueda.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscarProductos();
  }
});

inputBusqueda.addEventListener("input", () => {
  const valor = inputBusqueda.value.trim();

  if (valor === "") {
    iconoBusqueda.classList.add("bi-search-heart");
    iconoBusqueda.classList.remove("bi-x-circle");

    wrapperResultados.classList.add("d-none");
    mensajeSinResultados.classList.add("d-none");
    contenedorResultados.innerHTML = "";
  }
});


// Clicks en resultados
contenedorResultados.addEventListener("click", e => {
  const boton = e.target.closest("button");
  if (boton?.dataset?.id) {
    agregarAlCarrito(boton.dataset.id);
  }
});

// Clicks en destacados
document.getElementById("productos-destacados").addEventListener("click", e => {
  const boton = e.target.closest("button");
  if (boton?.dataset?.id) {
    agregarAlCarrito(boton.dataset.id);
  }
});

// Quitar del carrito
contenedorCarrito.addEventListener("click", e => {
  const boton = e.target.closest("button");
  if (boton?.dataset?.id) {
    quitarDelCarrito(boton.dataset.id);
  }
});

// Vaciar carrito
btnVaciar.addEventListener("click", vaciarCarrito);

// Burbuja carrito flotante
btnCarritoFlotante.addEventListener("click", () => {
  burbujaCarrito.classList.toggle("d-none");
});

document.addEventListener("click", (e) => {
  const esClickInterno = burbujaCarrito.contains(e.target) || btnCarritoFlotante.contains(e.target);
  if (!esClickInterno) {
    burbujaCarrito.classList.add("d-none");
  }
});


//
// 🚀 Inicio
//

mostrarCarrito();
mostrarProductosDestacados(obtenerProductosDestacados());
