const modalAgregarProducto = document.getElementById('modalAgregarProducto');
const agregarProductoBtn = document.getElementById('agregarProductoBtn');
const cerrarModal = document.getElementById('cerrarModal');
const formAgregarProducto = document.getElementById('formAgregarProducto');
const productosContainer = document.getElementById('productos-container');

agregarProductoBtn.onclick = function() {
    // Limpiar el formulario y ocultar el ID
    formAgregarProducto.reset();
    modalAgregarProducto.removeAttribute('data-id'); // Eliminar el ID si es nuevo producto
    modalAgregarProducto.style.display = 'block';
}

cerrarModal.onclick = function() {
    modalAgregarProducto.style.display = 'none';
}

// Función para agregar o actualizar un producto
formAgregarProducto.onsubmit = async function(e) {
    e.preventDefault();

    const id = modalAgregarProducto.getAttribute('data-id'); // Obtener el ID del producto
    const nuevoProducto = {
        Nombre: document.getElementById('nombre').value.trim(),
        Descripcion: document.getElementById('descripcion').value.trim(),
        Precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value),
        categoria: document.getElementById('categoria').value,
        urlimage: document.getElementById('urlimage').value.trim()
    };

    // Validaciones
    if (!nuevoProducto.Nombre || !nuevoProducto.Descripcion || isNaN(nuevoProducto.Precio) || isNaN(nuevoProducto.cantidad) || !nuevoProducto.categoria || !nuevoProducto.urlimage) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        // Si hay un ID, se actualiza el producto, de lo contrario, se agrega uno nuevo
        if (id) {
            await actualizarProducto(id, nuevoProducto);
        } else {
            const response = await fetch('http://localhost:5000/inventario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto)
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                agregarProductoALista(nuevoProducto, data.id);
                modalAgregarProducto.style.display = 'none';
                formAgregarProducto.reset(); // Resetea el formulario
            } else {
                alert('Error al agregar el producto: ' + data.error);
            }
        }
    } catch (error) {
        console.error('Error al agregar o actualizar el producto:', error);
        alert('Error al procesar el producto. Intenta nuevamente.');
    }
}

// Función para agregar un producto a la lista en el DOM
function agregarProductoALista(producto, id) {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('cuadricula-menu');
    productoDiv.innerHTML = `
        <img src="${producto.urlimage}" alt="${producto.Nombre}">
        <h3>${producto.Nombre}</h3>
        <p class="descripcion">${producto.Descripcion}</p>
        <p class="precio">$${producto.Precio} MXN</p>
        <p class="cantidad">Cantidad: ${producto.cantidad}</p>
        <button class="boton-editar" data-id="${id}">Editar</button>
        <button class="boton-eliminar" data-id="${id}">Eliminar</button>
    `;

    // Añadir evento de eliminar
    const botonEliminar = productoDiv.querySelector('.boton-eliminar');
    botonEliminar.onclick = function() {
        eliminarProducto(id, productoDiv);
    };

    // Añadir evento de editar
    const botonEditar = productoDiv.querySelector('.boton-editar');
    botonEditar.onclick = function() {
        editarProducto(producto);
    };

    productosContainer.appendChild(productoDiv);
}

// Función para eliminar un producto
async function eliminarProducto(id, productoDiv) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            const response = await fetch('http://localhost:5000/inventario/${id}', {
                method: 'DELETE'
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                productosContainer.removeChild(productoDiv); // Elimina el producto del DOM
            } else {
                alert('Error al eliminar el producto: ' + data.error);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto. Intenta nuevamente.');
        }
    }
}


// Función para editar un producto
function editarProducto(producto) {
    // Rellenar el formulario con los datos actuales del producto
    document.getElementById('nombre').value = producto.Nombre;
    document.getElementById('descripcion').value = producto.Descripcion;
    document.getElementById('precio').value = producto.Precio;
    document.getElementById('cantidad').value = producto.cantidad;
    document.getElementById('categoria').value = producto.categoria;
    document.getElementById('urlimage').value = producto.urlimage;

    // Establece el ID del producto en el modal
    modalAgregarProducto.setAttribute('data-id', producto.PANID);
    modalAgregarProducto.style.display = 'block';
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target === modalAgregarProducto) {
        modalAgregarProducto.style.display = 'none';
    }
};

// Función para cargar productos al inicio
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:5000/inventario');
        const productos = await response.json();
        productos.forEach(producto => {
            agregarProductoALista(producto, producto.PANID);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Cargar productos al inicio
cargarProductos();