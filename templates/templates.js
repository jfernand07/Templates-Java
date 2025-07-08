/**
 * Función que agrega un nuevo usuario (nombre) a la tabla
 * y crea dinámicamente un botón para eliminar esa fila.
 */
function agregarUsuario() {
  // 1. Obtener el nombre desde el input
const inputNombre = document.getElementById("nombreUsuario");
const nombre = inputNombre.value.trim();

  // 2. Validar que el campo no esté vacío
if (nombre === "") {
    alert("Por favor, ingresa un nombre válido.");
    return;
}

  // 3. Crear una nueva fila <tr>
const fila = document.createElement("tr");

  // 4. Crear celda con el nombre
const celdaNombre = document.createElement("td");
celdaNombre.textContent = nombre;

  // 5. Crear celda con botón de eliminar
const celdaAccion = document.createElement("td");
const botonEliminar = document.createElement("button");
botonEliminar.textContent = "Eliminar";
botonEliminar.classList.add("btn-eliminar");

  // 6. Asignar evento al botón para eliminar la fila (usuario)
botonEliminar.addEventListener("click", function () {
    eliminarUsuario(fila, nombre);
});

  // 7. Añadir botón a la celda de acción y celdas a la fila
celdaAccion.appendChild(botonEliminar);
fila.appendChild(celdaNombre);
fila.appendChild(celdaAccion);

  // 8. Agregar la fila a la tabla
const cuerpoTabla = document.getElementById("cuerpoTabla");
cuerpoTabla.appendChild(fila);

  // 9. Limpiar el input
inputNombre.value = "";
}


/*------------------------------------------------------------------------------------------------------------*/

/**
 * Función que elimina un usuario (una fila de la tabla).
 * @param {HTMLElement} fila - La fila <tr> que se desea eliminar.
 * @param {string} nombre - El nombre del usuario (opcional para mostrar).
 */
function eliminarUsuario(fila, nombre) {
  // Confirmar con el usuario si desea eliminar
const confirmar = confirm(`¿Deseas eliminar a "${nombre}"?`);

if (confirmar) {
    fila.remove(); // Elimina la fila del DOM
    console.log(`Usuario "${nombre}" eliminado correctamente.`);
}
}




/*-------------------------------------------------------------------------------------------------------------*/

// 1. Capturamos el formulario y el contenedor de productos
const formProducto = document.getElementById("form-producto");
const contenedorProductos = document.getElementById("contenedorProductos");

// 2. Evento al enviar el formulario
formProducto.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevenir recarga de página

  // 3. Obtener los valores de los inputs
const nombre = document.getElementById("nombreProducto").value.trim();
const precio = document.getElementById("precioProducto").value;
const inputImagen = document.getElementById("imagenProducto");
const archivo = inputImagen.files[0];

  // 4. Validar los campos básicos
if (!nombre || !precio) {
    alert("Por favor, complete todos los campos obligatorios.");
    return;
}

  // 5. Crear una URL de imagen (si se sube una imagen desde el equipo)
let urlImagen = "";

if (archivo) {
    // Crear una URL temporal del archivo cargado
    urlImagen = URL.createObjectURL(archivo);
} else {
   // Imagen por defecto si no se seleccionó ninguna
    urlImagen = "https://via.placeholder.com/150?text=Producto";
}

  // 6. Crear una tarjeta HTML con los datos del producto
const tarjeta = document.createElement("div");
tarjeta.style.border = "1px solid #ccc";
tarjeta.style.padding = "10px";
tarjeta.style.width = "200px";
tarjeta.style.borderRadius = "8px";
tarjeta.style.backgroundColor = "#f9f9f9";
tarjeta.innerHTML = `
    <img src="${urlImagen}" alt="Producto" style="width: 100%; height: auto; object-fit: cover; border-radius: 4px;" />
    <h3>${nombre}</h3>
    <p>Precio: $${parseFloat(precio).toFixed(2)}</p>
`;

// 7. Agregar la tarjeta al contenedor principal
contenedorProductos.appendChild(tarjeta);

  // 8. Limpiar el formulario
formProducto.reset();
});


/*-------------------------------------------------------------------------------------------------------------*/

// Variables para manejar el estado de edición
let productos = []; // Almacenará productos en memoria
let editandoId = null; // ID del producto que se está editando

const form = document.getElementById("form-producto");
// const contenedorProductos = document.getElementById("contenedorProductos"); // Eliminated duplicate declaration

form.addEventListener("submit", function (e) {
e.preventDefault();

  // Obtener datos del formulario
const nombre = document.getElementById("nombreProducto").value.trim();
const precio = parseFloat(document.getElementById("precioProducto").value);
const imagenInput = document.getElementById("imagenProducto");
const imagenArchivo = imagenInput.files[0];

if (!nombre || isNaN(precio)) {
    alert("Por favor ingresa nombre y precio válidos.");
    return;
}

  // Crear o actualizar imagen temporal
let urlImagen = "https://via.placeholder.com/150?text=Producto";

if (imagenArchivo) {
    urlImagen = URL.createObjectURL(imagenArchivo);
}

if (editandoId !== null) {
    // 🚀 MODO EDICIÓN: Actualizar producto existente
    const producto = productos.find(p => p.id === editandoId);
    producto.nombre = nombre;
    producto.precio = precio;
    if (imagenArchivo) {
    producto.imagen = urlImagen;
    }

    renderizarProductos(); // Volver a dibujar todo
    editandoId = null; // Salir del modo edición
} else {
    // ➕ MODO CREACIÓN: Agregar nuevo producto
    const nuevoProducto = {
      id: Date.now(), // ID único
    nombre,
    precio,
    imagen: urlImagen
    };

    productos.push(nuevoProducto); // Guardar en memoria
    agregarProductoAlDOM(nuevoProducto);
}

  form.reset(); // Limpiar formulario
});

/**
 * Agrega una tarjeta visual al DOM con la información de un producto
 */
function agregarProductoAlDOM(producto) {
const tarjeta = document.createElement("div");
tarjeta.classList.add("tarjeta-producto");
tarjeta.style.width = "200px";
tarjeta.style.border = "1px solid #ccc";
tarjeta.style.borderRadius = "8px";
tarjeta.style.padding = "10px";
tarjeta.style.backgroundColor = "#f4f4f4";
  tarjeta.setAttribute("data-id", producto.id); // Identificador único

tarjeta.innerHTML = `
    <img src="${producto.imagen}" alt="Imagen" style="width:100%; border-radius:4px;" />
    <h3>${producto.nombre}</h3>
    <p>Precio: $${producto.precio.toFixed(2)}</p>
    <button onclick="editarProducto(${producto.id})">Editar</button>
`;

contenedor.appendChild(tarjeta);
}

/**
 * Edita un producto cargando su información al formulario
 */
window.editarProducto = function (id) {
const producto = productos.find(p => p.id === id);
if (!producto) return;

 // Cargar datos al formulario
document.getElementById("nombreProducto").value = producto.nombre;
document.getElementById("precioProducto").value = producto.precio;
document.getElementById("productoId").value = producto.id;

  editandoId = id; // Activar modo edición
}

/**
 * Redibuja todas las tarjetas en pantalla (tras editar)
 */
function renderizarProductos() {
  contenedorProductos.innerHTML = ""; // Limpiar contenedor
productos.forEach(p => agregarProductoAlDOM(p));
}


/*--------------------------------------------------------------------------------------------------------------*/  
// Variable global que representa el valor actual del contador
let contador = 0;

/**
 * Actualiza visualmente el número del contador en el DOM.
 */
function actualizarVista() {
document.getElementById("valorContador").textContent = contador;
}

/**
 * Incrementa el valor del contador en 1.
 */
function incrementar() {
contador++;
  actualizarVista(); // Reflejar cambio en la pantalla
}

/**
 * Decrementa el valor del contador en 1.
 */
function decrementar() {
contador--;
actualizarVista();
}

/**
 * Reinicia el contador a 0.
 */
function reiniciar() {
contador = 0;
actualizarVista();
}


/*---------------------------------------------------------------------------------------------------------------*/


/*HTML para SPA*/
/* <!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>SPA Básica</title>
<style>
    body { font-family: Arial; margin: 0; padding: 0; }
    nav { background: #333; padding: 10px; }
    nav a {
    color: white; margin: 0 10px; text-decoration: none; cursor: pointer;
    }
    .active { text-decoration: underline; }
    #contenido { padding: 20px; }
</style>
</head>
<body>

<!-- SPA: Menú de navegación (no recarga la página) -->
<nav>
    <a data-seccion="inicio" class="active">Inicio</a>
    <a data-seccion="productos">Productos</a>
    <a data-seccion="perfil">Perfil</a>
</nav>

<!-- SPA: Contenido dinámico -->
<div id="contenido">
    <!-- Aquí se cargará el contenido dinámicamente -->
</div>

<script src="spa.js"></script>
</body>
</html>   */

/** * spa.js - Lógica para manejar la SPA
 */
// Contenedor donde se cargará el contenido dinámico
const contenedorSPA = document.getElementById("contenido");

// Obtenemos todos los enlaces de navegación
const enlaces = document.querySelectorAll("nav a");

// Contenido simulado de cada sección (como si fueran "páginas")
const secciones = {
inicio: "<h1>Bienvenido a la Página de Inicio</h1><p>Este es el inicio de nuestra SPA.</p>",
productos: "<h1>Productos</h1><ul><li>Producto A</li><li>Producto B</li></ul>",
perfil: "<h1>Perfil de Usuario</h1><p>Nombre: Juan Pérez<br>Correo: juan@example.com</p>",
};

/**
 * Cambia la sección actual cargando su contenido en el DOM
 * @param {string} nombreSeccion - Clave del objeto `secciones`
 */
function mostrarSeccion(nombreSeccion) {
  // 1. Buscar el contenido de esa sección
const html = secciones[nombreSeccion];

  // 2. Insertar el contenido en el contenedor
contenedorSPA.innerHTML = html;

  // 3. Actualizar clases activas
enlaces.forEach(enlace => enlace.classList.remove("active"));
document.querySelector(`a[data-seccion="${nombreSeccion}"]`).classList.add("active");
}

// Asignar eventos de clic a los enlaces
enlaces.forEach(enlace => {
enlace.addEventListener("click", function () {
    const seccion = this.getAttribute("data-seccion");
    mostrarSeccion(seccion); // SPA: Cambiar sección sin recargar
});
});

// SPA: Cargar sección inicial por defecto
mostrarSeccion("inicio");

