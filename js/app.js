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

//------------------------------------------------------------
// Buscar producto por id
function buscarProductoPorId(id) {
  for (const tienda of datosApp.tiendas) {
    const prod = tienda.productos.find(p => p.id === id);
    if (prod) return { ...prod, tienda: tienda.nombre };
  }
  return null;
}

// ---------------------------------------------------------------------------------------------------
//
// iniciar Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


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

//
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


// ---------------------------------------------------------------------------------------------------
//
// Datos de envío

// Elementos del formulario
const form = document.getElementById('formDatosEnvio');

// IDs de los campos del formulario a validar/guardar
const camposEnvio = [
  'nombreCliente',
  'emailCliente',
  'calleCliente',
  'numeroCliente',
  'ciudadCliente',
  'departamentoCliente',
  'cpCliente'
];
const camposPago = [
  'tarjetaCliente',
  'expiraciontarjetaCliente',
  'cvcCliente'
];

// Función para guardar en localStorage
function guardarDatosEnvio() {
  const datosFormEnvio = {};

  camposEnvio.forEach(id => {
    const el = document.getElementById(id);
    datosFormEnvio[id] = el.value.trim();
  });

  localStorage.setItem('datosEnvio', JSON.stringify(datosFormEnvio));
}

function guardarDatosPago() {
  const datosFormPago = {};

  camposPago.forEach(id => {
    const el = document.getElementById(id);
    datosFormPago[id] = el.value.trim();
  });

  localStorage.setItem('datosPago', JSON.stringify(datosFormPago));
}

// Validar formulario
function validarFormulario(listaCampos) {
  let esValido = true;
  listaCampos.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add('is-invalid');
      esValido = false;
    } else {
      el.classList.remove('is-invalid');
    }
  });
  return esValido;
}

// Calcular tiempo de preparacion
function calcularTiempoPreparacion(carrito, tiendas) {
  const tiendasUsadas = new Set();

  // Registrar qué tiendas están en el carrito
  carrito.forEach(producto => {
    tiendasUsadas.add(producto.tiendaId);
  });

  // Sumar el tiempo de preparación de cada tienda única
  let totalTiempo = 0;

  tiendasUsadas.forEach(tiendaId => {
    const tienda = tiendas.find(t => t.id === tiendaId);
    if (tienda) {
      totalTiempo += tienda.tiempo_preparacion || 0;
    }
  });

  return totalTiempo;
}


// -----------------------------------------------------------------------------------------
// Auto-guardar en localStorage si el usuario cambia un campo y sale de él
camposEnvio.forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', guardarDatosEnvio);
});
camposPago.forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', guardarDatosPago);
});


// -----------------------------------------------------------------------------------------
//
// Resumen de compra para crear el modal de compra realizada
function mostrarResumenCompra() {
  const datosEnvio = JSON.parse(localStorage.getItem('datosEnvio')) || {};
  const cantidadTotal = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  const tiempo = calcularTiempoPreparacion(carrito, tiendas);

  console.log(`Tiempo total de preparación: ${tiempo} minutos`);

  //const horas = Math.floor(tiempo / 60);
  //const minutos = tiempo % 60;
  const tiempoFormateado = isNaN(tiempo) ? "No disponible" : `${tiempo} min`; //`${horas > 0 ? horas + 'h ' : ''}${minutos} min`;

  const mensajeHTML = `
    <p>Gracias <strong>${datosEnvio.nombreCliente || 'Cliente'}</strong>, tu compra ha sido registrada con éxito!</p>
    <p><i class="bi bi-box2-heart"></i> <strong>${cantidadTotal}</strong> producto(s)</p>
    <p><i class="bi bi-coin"></i> Total: <strong>$${totalPrecio.toFixed(2)}</strong></p>
    <p><i class="bi bi-hourglass-split"></i> Tiempo estimado de preparación: <strong>${tiempoFormateado}</strong></p>
    <hr>
    <p><strong>Dirección de envío:</strong><br>
    ${datosEnvio.calleCliente || ''} ${datosEnvio.numeroCliente || ''}, ${datosEnvio.ciudadCliente || ''}, ${datosEnvio.departamentoCliente || ''} - CP ${datosEnvio.cpCliente || ''}</p>
    <p><strong>Email:</strong> ${datosEnvio.emailCliente || ''}</p>
    <hr>
    <p>Se enviará una confirmación al correo electrónico proporcionado.</p>`;

  document.getElementById('detalleConfirmacion').innerHTML = mensajeHTML;

  const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
  modal.show();
}

// para que resetee todo despues de terminar de comprar exitosamente
document.querySelector('#cerrarModalConfirmacionCompra').addEventListener('click',() =>{
  localStorage.removeItem('carrito');
  location.reload(true);
});  


// ---------------------------------------------------------------------------------------------------
// Proceso de compra

document.querySelector('#btnContinuar').addEventListener('click', () => {
  const tabTusProductos = document.getElementById('tus-productos');
  const tabDatosEnvio = document.getElementById('envio');
  const tabDatosPago = document.getElementById('facturacion');

  if(tabTusProductos.classList.contains('active') && (carrito.length > 0)){ // si la tab 1 esta activa, y hay productos en el carrito
    
    const siguienteTab = new bootstrap.Tab(document.querySelector('#envio-tab'));
    siguienteTab.show();

    document.querySelector('#buttonContinuarTextContent').textContent = 'Continuar';

  }else if( tabDatosEnvio.classList.contains('active') ){ // la tab 2 está activa
    if(validarFormulario(camposEnvio)){ // y los datos de envio estan completos
      guardarDatosEnvio(); //guardo los daots

      const siguienteTab = new bootstrap.Tab(document.querySelector('#facturacion-tab'));
      document.getElementById('facturacion-tab').classList.remove('disabled'); // activo el boton
      siguienteTab.show(); // navego hacia el ultimo paso

      document.querySelector('#buttonContinuarTextContent').textContent = 'Finalizar compra'; // cambio el lable del boton
    }else{ // y los datos de envio NO estan completos
      alert("Debes completar los datos de envío para proceder");
      document.getElementById('facturacion-tab').classList.add('disabled'); // desactivo el boton
    }
  }else if( tabDatosPago.classList.contains('active')){ // si la tab 3 está activa
    
    if(validarFormulario(camposPago)){ // y el formlario de pago esta completo
      mostrarResumenCompra(); // mostrar resumen de compra
    }else{
      alert("Completa los datos de pago para finalizar la compra");
    }
  }

}); // end Proceso de compra


