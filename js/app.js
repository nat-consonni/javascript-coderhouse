let datosApp = {}; // variable global para guardar los datos

// Cargar JSON una vez
fetch('./data/productos.json')
.then(res => res.json())
.then(data => {
  datosApp = data; // guardar globalmente
  console.log('Datos recibidos:', data); // BORRAR LUEGO
  mostrarDestacados(); // llamar destacados
})

.catch(err => console.error('Error al cargar JSON:', err));

//
// Función para mostrar destacados
function mostrarDestacados() {
  const contenedor = document.getElementById('productos-destacados');
  contenedor.innerHTML = ''; // limpiar antes

  const destacados = [];

  datosApp.tiendas.forEach(tienda => {
    tienda.productos.forEach(producto => {
      if (producto.destacado === true && destacados.length < 6) {
        destacados.push({ ...producto, tienda: tienda.nombre });
      }
    });
  });

  destacados.forEach(item => {
    const col = document.createElement('div');
    col.classList.add('col-2');
    col.innerHTML = `
      <div class="card-producto border p-3 rounded-1 h-100 d-flex flex-column">
        <div class="img-wrapper mb-3">
          <img src="${item.imagen}" class="d-block w-100" alt="${item.nombre}">
        </div>
        <p class="h6 text-break">${item.nombre}</p>
        <div class="detalles-venta mt-auto">
          <a class="nombre-tienda" href="#">${item.tienda}</a>  
          <p class="region">${item.regiones_preferencia.join(', ')}</p>            
        </div>
        <div class="footer d-flex align-items-center justify-content-between w-100 mt-2">
          <p class="d-flex mb-0 price"><span class="d-inline-block">$</span> ${item.precio}</p>
          <div class="agregar" data-id="${item.id}">
            <button class="btn btn-sm btn-primary" data-id="${item.id}">Agregar</button>
          </div>
          <div class="cantidad-group d-none align-items-center gap-2" data-id="${item.id}">
            <button class="btn btn-sm btn-outline-secondary btn-menos" data-id="${item.id}">−</button>
            <span class="cantidad">1</span>
            <button class="btn btn-sm btn-outline-secondary btn-mas" data-id="${item.id}">+</button>
          </div>
        </div>  
      </div>
    `;
    contenedor.appendChild(col);
  });
}


//
// Funciones del carrito

let carrito = [];
const contenedorCarrito = document.getElementById("carrito");
const btnVaciar = document.getElementById("btn-vaciar");
const burbujaCarrito = document.getElementById("burbuja-carrito");
const btnCarritoFlotante = document.getElementById("btn-carrito-flotante");

// Abrir carrito
btnCarritoFlotante.addEventListener('click', function(){
  if(burbujaCarrito.classList.contains('d-none')){
    burbujaCarrito.classList.remove('d-none')
  }else{
    burbujaCarrito.classList.add('d-none');
  };
}); // funcion abrir carrito


function actualizarCarritoUI() {
  // Acá podrías redibujar un resumen del carrito si querés
  console.log('Carrito:', carrito);
}

// Delegación para botones "Agregar"
document.addEventListener('click', (e) => {
  const btnAgregar = e.target.closest('.btn-primary[data-id]');
  if (!btnAgregar) return;

  const id = btnAgregar.dataset.id;
  const producto = buscarProductoPorId(id);
  if (!producto) return;

  // Agregar al carrito
  const enCarrito = carrito.find(p => p.id === id);
  if (!enCarrito) {
    carrito.push({ ...producto, cantidad: 1 });
  }

  // Actualizar UI
  mostrarControlesCantidad(id, 1);
  actualizarCarritoUI();
});

// Botón +
document.addEventListener('click', (e) => {
  const btnMas = e.target.closest('.btn-mas[data-id]');
  if (!btnMas) return;

  const id = btnMas.dataset.id;
  const producto = carrito.find(p => p.id === id);
  if (!producto) return;

  producto.cantidad++;
  mostrarControlesCantidad(id, producto.cantidad);
  actualizarCarritoUI();
});

// Botón -
document.addEventListener('click', (e) => {
  const btnMenos = e.target.closest('.btn-menos[data-id]');
  if (!btnMenos) return;

  const id = btnMenos.dataset.id;
  const index = carrito.findIndex(p => p.id === id);
  if (index === -1) return;

  const producto = carrito[index];
  if (producto.cantidad === 1) {
    // Quitar del carrito
    carrito.splice(index, 1);
    ocultarControlesCantidad(id);
  } else {
    producto.cantidad--;
    mostrarControlesCantidad(id, producto.cantidad);
  }

  actualizarCarritoUI();
});

function buscarProductoPorId(id) {
  for (const tienda of datosApp.tiendas) {
    const prod = tienda.productos.find(p => p.id === id);
    if (prod) return { ...prod, tienda: tienda.nombre };
  }
  return null;
}

function mostrarControlesCantidad(id, cantidad) {
  const group = document.querySelector(`.cantidad-group[data-id="${id}"]`);
  const btnAgregar = document.querySelector(`.agregar[data-id="${id}"]`);
  if (!group || !btnAgregar) return;

  const spanCantidad = group.querySelector('.cantidad');
  spanCantidad.textContent = cantidad;

  // Mostrar icono de eliminar si hay 1 solo
  const btnMenos = group.querySelector('.btn-menos');
  if (cantidad === 1) {
    btnMenos.innerHTML = '<i class="bi bi-trash3-fill"></i>';
  } else {
    btnMenos.textContent = '−';
  }

  group.classList.remove('d-none');
  btnAgregar.classList.add('d-none');
}

function ocultarControlesCantidad(id) {
  const group = document.querySelector(`.cantidad-group[data-id="${id}"]`);
  const btnAgregar = document.querySelector(`.agregar[data-id="${id}"]`);
  if (!group || !btnAgregar) return;

  group.classList.add('d-none');
  btnAgregar.classList.remove('d-none');
}