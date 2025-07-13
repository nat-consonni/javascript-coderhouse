let datosApp = {}; // variable global para guardar los datos

// ---------------------------------------------------------------------------------------------------
// Cargar JSON una vez

fetch('./data/productos.json')
.then(res => res.json())
.then(data => {
  datosApp = data; // guardar globalmente
  console.log('Datos recibidos:', data); // BORRAR LUEGO
  mostrarDestacados(); // llamar destacados

  // Carrito guardado
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  if (Array.isArray(carritoGuardado)) {
    carrito = carritoGuardado;
    actualizarCarritoUI();
    // Corregir controles de cantidad
    carrito.forEach(item => {
      mostrarControlesCantidad(item.id, item.cantidad);
    });
  }
})

.catch(err => console.error('Error al cargar JSON:', err));


// ---------------------------------------------------------------------------------------------------
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
      <div class="card-producto border p-2 rounded-1 h-100 d-flex flex-column">
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
} // end destacados

// ---------------------------------------------------------------------------------------------------
//
// Variables para proceso de compra

let carrito = [];
const contenedorCarrito = document.getElementById("carrito");
const accionesCarrito = document.getElementById("accionesCarrito");
const btnVaciar = document.getElementById("btn-vaciar");
const burbujaCarrito = document.getElementById("burbuja-carrito");
const btnCarritoFlotante = document.getElementById("btn-carrito-flotante");
const mensajeVacio = document.getElementById("mensajeCarritoVacio");
// tabs
const tabEnvioTab = document.getElementById("envio-tab");
const tabFacturacionTab = document.getElementById("facturacion-tab");

// ---------------------------------------------------------------------------------------------------
// Boton continuar proceso de compra

document.querySelector('#btn-continuar').addEventListener('click', () => {
  const tab = new bootstrap.Tab(document.querySelector('#envio-tab'));
  tab.show();
}); // end btn-continuar


// ---------------------------------------------------------------------------------------------------
//
// Agregar producto al carrito

function actualizarCarritoUI() {
  
  console.log('Carrito:', carrito); // BORRAR LUEGO

  contenedorCarrito.innerHTML = ''; // limpiar antes -- o sea que cada vez que agrega algo borra, chequear de optimizar

  //agrega o quita mensaje de carrito vacio y boton vaciar carrito
  if(carrito.length > 0){
    mensajeVacio.classList.add('d-none');
    accionesCarrito.classList.remove('d-none');
    tabEnvioTab.classList.remove('disabled');

  }else{
    mensajeVacio.classList.remove('d-none');
    accionesCarrito.classList.add('d-none');
    tabEnvioTab.classList.add('disabled');
  };

  let totalPrecio = 0;
  let numeroProductos = 0;

  carrito.forEach(productos =>{
    totalPrecio += productos.precio * productos.cantidad;
    numeroProductos += productos.cantidad;

    const cardProductoCarrito = document.createElement('div');
    cardProductoCarrito.classList.add('card-producto', 'border', 'p-2', 'rounded-1', 'd-flex', 'flex-column', 'mb-3');
   
    cardProductoCarrito.innerHTML=`
      <div class="row">
        <div class="col-2">
          <div class="img-wrapper mb-0">
            <img src="${productos.imagen}" class="d-block w-100" alt="Imagen del producto: ${productos.nombre}">
          </div>
        </div>
        <div class="col-6 pt-2">
          <p class="h6 text-break">${productos.nombre}</p>
          <a class="nombre-tienda" href="#">${productos.tienda}</a>  
          <p class="region">${productos.regiones_preferencia}</p>            
        </div>
        <div class="col-4">
          <div class="footer d-flex justify-content-between align-items-end h-100">
            <div class="cantidad-group align-items-center pb-1" data-id="${productos.id}">
              <button class="btn btn-sm btn-outline-secondary btn-menos" data-id="${productos.id}">-</button>
              <span class="cantidad">${productos.cantidad}</span>
              <button class="btn btn-sm btn-outline-secondary btn-mas" data-id="${productos.id}">+</button>
            </div>
            <p class="d-flex mb-0 price"><span class="d-inline-block">$</span> ${productos.precio * productos.cantidad}</p>
          </div>
        </div>
      </div>                    
    `;
    contenedorCarrito.appendChild(cardProductoCarrito);
  });// cierro carrito for each

  document.querySelector('#sumaPrecioTotal').textContent = `$${totalPrecio}`;
  document.querySelector('#contador-productos').textContent = `(${numeroProductos})`;
  localStorage.setItem('carrito', JSON.stringify(carrito)); // guardo en el local storage

};

// Botones para "Agregar"
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



// ---------------------------------------------------------------------------------------------------
//
// Vaciar carrito
btnVaciar.addEventListener('click', () => {
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarritoUI();

  document.querySelectorAll('.cantidad-group').forEach(el => el.classList.add('d-none'));
  document.querySelectorAll('.agregar').forEach(el => el.classList.remove('d-none'));
});




//////////



// 
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