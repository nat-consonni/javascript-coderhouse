//
// Funciones para productos
//

// Devuelve productos segun estas condiciones
function obtenerProductosFiltrados(filtroFn) {
  return tiendas.flatMap(tienda =>
    tienda.productos
      .filter(p => p.disponible && filtroFn(p))
      .map(p => ({ ...p, tienda: tienda.nombre }))
  );
}

// Todos los productos disponibles
function obtenerProductosDisponibles() {
  return obtenerProductosFiltrados(() => true);
}

// Solo productos destacados
function obtenerProductosDestacados() {
  return obtenerProductosFiltrados(p => p.destacado);
}


//
// Renderiza cards de productos
//

function crearCardProducto(producto) {
  const card = document.createElement("div");
  card.className = "col-12 col-sm-6 col-md-4 col-lg-3 card-producto p-2";
  card.dataset.id = producto.id;

  const paises = producto.paisesPreferencia.join(", ");

  card.innerHTML = `
    <div class="card p-4 h-100">
      <p class="tienda">${producto.tienda}</p>
      <h5>${producto.nombre}</h5>
      <p>Marca: ${producto.marca}</p>
      <p>Origen: ${paises}</p>
      <div class="row footer">
        <div class="col-6 pl-0">
          <p class="precio"><span>Precio:</span> $ ${producto.precio} <small>c/u</small></p>
        </div>
        <div class="col-6 pr-0 text-right contenedor-control" data-id="${producto.id}">
          <button class="btn btn-sm" data-id="${producto.id}">
            <i class="bi bi-cart-plus-fill"></i> Agregar
          </button>
        </div>
      </div>
    </div>
  `;

  return card;
}

function renderizarListaProductos(productos, contenedor, vacioCallback = null) {
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    if (vacioCallback) vacioCallback();
    return;
  }

  productos.forEach(producto => {
    const card = crearCardProducto(producto);
    contenedor.appendChild(card);
  });
}

function mostrarProductosDestacados(productos) {
  const contenedor = document.getElementById("productos-destacados");
  renderizarListaProductos(productos, contenedor);
}

function mostrarProductos(productos) {
  const wrapper = document.getElementById("resultados-busqueda-wrapper");

  const hayBusqueda = inputBusqueda.value.trim() !== "";
  if (!hayBusqueda) {
    wrapper.classList.add("d-none");
    mensajeSinResultados.classList.add("d-none");
    contenedorResultados.innerHTML = "";
    return;
  }

  wrapper.classList.remove("d-none");

  renderizarListaProductos(productos, contenedorResultados, () => {
    mensajeSinResultados.classList.remove("d-none");
  });

  if (productos.length > 0) {
    mensajeSinResultados.classList.add("d-none");
  }
}

function actualizarVistaProductos() {
  document.querySelectorAll(".card-producto").forEach(card => {
    const id = String(card.dataset.id); //para arregalr que btn-quitar no me borraba del carrito
    const producto = productos.find(p => p.id === id);
    const contenedor = card.querySelector(".contenedor-control");
    const enCarrito = carrito.find(p => p.id === id);

    if (!contenedor) return;

    if (enCarrito) {
      inicializarControlesCantidad(producto, contenedor, enCarrito.cantidadSeleccionada);
    } else {
      contenedor.innerHTML = `
        <button class="btn btn-sm" data-id="${producto.id}">
          <i class="bi bi-cart-plus-fill"></i> Agregar
        </button>
      `;
    }
  });
}

//
// Lógica del carrito
//

function inicializarControlesCantidad(producto, contenedor, cantidadInicial = 1) {
  const cantidadMaxima = producto.cantidad;

  const wrapper = document.createElement("div");
  wrapper.className = "d-flex align-items-center justify-content-end";

  const btnMenos = document.createElement("button");
  btnMenos.className = "btn btn-sm btn-outline-secondary rounded-circle px-2";
  btnMenos.textContent = "−";

  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.value = cantidadInicial;
  inputCantidad.min = 1;
  inputCantidad.max = cantidadMaxima;
  inputCantidad.className = "mx-2 text-center";

  const btnMas = document.createElement("button");
  btnMas.className = "btn btn-sm btn-outline-secondary rounded-circle px-2";
  btnMas.textContent = "+";

  wrapper.appendChild(btnMenos);
  wrapper.appendChild(inputCantidad);
  wrapper.appendChild(btnMas);

  contenedor.innerHTML = "";
  contenedor.appendChild(wrapper);

  function actualizarBotones() {
    btnMas.disabled = Number(inputCantidad.value) >= cantidadMaxima;
  }

  function onChange(delta) {
    let nuevaCantidad = Number(inputCantidad.value) + delta;
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(producto.id);
      return;
    }
    if (nuevaCantidad > cantidadMaxima) return;
    inputCantidad.value = nuevaCantidad;
    actualizarCarrito(producto.id, nuevaCantidad);
    actualizarBotones();
  }

  btnMas.addEventListener("click", () => onChange(1));
  btnMenos.addEventListener("click", () => onChange(-1));

  inputCantidad.addEventListener("blur", () => {
    let nuevaCantidad = Number(inputCantidad.value);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      quitarDelCarrito(producto.id);
    } else {
      nuevaCantidad = Math.min(nuevaCantidad, cantidadMaxima);
      inputCantidad.value = nuevaCantidad;
      actualizarCarrito(producto.id, nuevaCantidad);
      actualizarBotones();
    }
  });

  actualizarBotones();
}

function actualizarCarrito(id, cantidad) {
  const index = carrito.findIndex(p => p.id === id);
  const productoBase = productos.find(p => p.id === id);
  if (!productoBase) return;

  if (cantidad <= 0) {
    if (index !== -1) carrito.splice(index, 1);
  } else {
    const productoConCantidad = { ...productoBase, cantidadSeleccionada: cantidad };
    if (index === -1) {
      carrito.push(productoConCantidad);
    } else {
      carrito[index] = productoConCantidad;
    }
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarVistaProductos();
}

function quitarDelCarrito(id) {
  id = String(id);
  carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarVistaProductos();
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
  actualizarVistaProductos();
}

function mostrarCarrito() {
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    btnVaciar.classList.add("d-none");
    return;
  }

  carrito.forEach(item => {
    const cantidad = item.cantidadSeleccionada || 1;
    const totalItem = item.precio * cantidad;

    const div = document.createElement("div");
    div.className = "card-producto mb-2";

    div.innerHTML = `
      <div class="card p-2">
        <div class="row align-items-center">
          <div class="col-8 pl-0">
            <p><strong>${item.nombre}</strong></p>
            <p>Marca: ${item.marca}</p>
            <p class="precio"><span>Precio:</span> $${totalItem} <small>($${item.precio} c/u)</small></p>
            <div class="input-group cantidad-group">
              <input type="number" min="0" class="form-control cantidad-input" value="${cantidad}" data-id="${item.id}">              
            </div>
          </div>
          <div class="col-4 pr-0 text-right">
            <button class="btn text-color-danger p-0 btn-quitar" data-id="${item.id}">
              <i class="bi bi-x-circle"></i> <span class="d-none">Quitar</span>
            </button>
          </div>
        </div>
      </div>
    `;
    contenedorCarrito.appendChild(div);
  });

  const total = carrito.reduce((acc, item) => acc + item.precio * (item.cantidadSeleccionada || 1), 0);
  const totalDiv = document.createElement("div");
  totalDiv.className = "mt-3";
  totalDiv.innerHTML = `<h5>Total: $${total}</h5>`;
  contenedorCarrito.appendChild(totalDiv);

  btnVaciar.classList.remove("d-none");

  // Funciones para productos dentro del carrito
  contenedorCarrito.querySelectorAll(".btn-mas").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const producto = carrito.find(p => p.id === id);
      const productoBase = productos.find(p => p.id === id);
      if (!producto || !productoBase) return;

      const nuevaCantidad = producto.cantidadSeleccionada + 1;
      if (nuevaCantidad <= productoBase.cantidad) {
        actualizarCarrito(id, nuevaCantidad);
      }
    });
  });

  contenedorCarrito.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const producto = carrito.find(p => p.id === id);
      if (!producto) return;

      const nuevaCantidad = producto.cantidadSeleccionada - 1;
      if (nuevaCantidad <= 0) {
        quitarDelCarrito(id);
      } else {
        actualizarCarrito(id, nuevaCantidad);
      }
    });
  });

  contenedorCarrito.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("blur", () => {
      const id = input.dataset.id;
      let valor = parseInt(input.value);
      if (isNaN(valor) || valor <= 0) {
        quitarDelCarrito(id);
      } else {
        const producto = productos.find(p => p.id === id);
        if (producto) {
          valor = Math.min(valor, producto.cantidad);
          actualizarCarrito(id, valor);
        }
      }
    });
  });

  contenedorCarrito.querySelectorAll(".btn-quitar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = String(btn.dataset.id);  // fuerzo el string porque no me funciona
      quitarDelCarrito(id);
    });
  });

}

//
// Búsqueda
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
  actualizarVistaProductos();

  iconoBusqueda.classList.remove("bi-search-heart");
  iconoBusqueda.classList.add("bi-x-circle");
}

function agregarAlCarrito(id) {
  id = String(id);
  
  const producto = productos.find(p => p.id === id);
  
  productos = productos.map(p => ({ ...p, id: String(p.id) }));
  if (!producto) return;

  const card = document.querySelector(`.card-producto[data-id='${id}']`);
  const contenedor = card?.querySelector(".contenedor-control");

  if (contenedor) {
    inicializarControlesCantidad(producto, contenedor);
    actualizarCarrito(id, 1);
  }
}



//
// Globales
//

let productos = obtenerProductosDisponibles().map(p => ({ ...p, id: String(p.id) })); //porque no me funciona el btn-quitar del carrito
let carrito = (JSON.parse(localStorage.getItem("carrito")) || []).map(p => ({ ...p, id: String(p.id) }));


// Todos los IDs para strings porque me daba error
productos = productos.map(p => ({ ...p, id: String(p.id) }));
carrito = carrito.map(p => ({ ...p, id: String(p.id) }));

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
// AddEventListener
//

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

inputBusqueda.addEventListener("keypress", e => {
  if (e.key === "Enter") buscarProductos();
});

inputBusqueda.addEventListener("input", () => {
  if (inputBusqueda.value.trim() === "") {
    iconoBusqueda.classList.add("bi-search-heart");
    iconoBusqueda.classList.remove("bi-x-circle");
    wrapperResultados.classList.add("d-none");
    mensajeSinResultados.classList.add("d-none");
    contenedorResultados.innerHTML = "";
  }
});

document.addEventListener("click", e => {
  const boton = e.target.closest("button[data-id]");
  if (boton) agregarAlCarrito(boton.dataset.id);
});

btnVaciar.addEventListener("click", vaciarCarrito);

btnCarritoFlotante.addEventListener("click", () => {
  burbujaCarrito.classList.toggle("d-none");
});

document.addEventListener("click", e => {
  const esClickInterno = burbujaCarrito.contains(e.target) || btnCarritoFlotante.contains(e.target);
  if (!esClickInterno) burbujaCarrito.classList.add("d-none");
});

//
// Inicio del simulador
//

mostrarCarrito();
mostrarProductosDestacados(obtenerProductosDestacados());
actualizarVistaProductos();
