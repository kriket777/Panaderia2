document.addEventListener("DOMContentLoaded", function() {
    const formularioPan = document.getElementById("formulario-pan");
    const tablaCuerpo = document.getElementById("tabla-cuerpo");
    const mensajeError = document.createElement("div"); // Div para mostrar mensajes de error
    mensajeError.className = "mensaje-error";
    formularioPan.insertAdjacentElement('afterend', mensajeError);
    document.addEventListener("DOMContentLoaded", function() {
        const inventario = JSON.parse(localStorage.getItem("inventario")) || [];
    
        inventario.forEach(pan => {
            if (pan.categoria === "temporada") {
                agregarPanTemporada(pan); // Agrega al carrusel
            } else {
                agregarPanTradicional(pan); // Agrega al menú
            }
        });
    });
    

    let panes = []; // Arreglo para almacenar los panes

    document.addEventListener('DOMContentLoaded', () => {
        // Simulación de actualización en tiempo real
        setInterval(actualizarInventario, 5000);
    });

    function actualizarInventario() {
        fetch('gestion_inventario.json')  // Supongamos que esta es la fuente de datos de inventario
            .then(response => response.json())
            .then(data => {
                console.log("Inventario actualizado:", data);
                // Aquí puedes actualizar el DOM con la nueva información de inventario
            })
            .catch(error => console.error("Error al actualizar el inventario:", error));
    }

    // Función para mostrar los panes en la tabla
    function mostrarPanes() {
        tablaCuerpo.innerHTML = ""; // Limpia la tabla
        panes.forEach((pan, index) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${pan.nombre}</td>
                <td>${pan.descripcion}</td>
                <td>$${pan.precio}</td>
                <td>${pan.categoria}</td>
                <td><img src="${pan.urlImagen}" alt="${pan.nombre}" style="width: 50px; height: auto;"></td>
                <td>
                    <button class="boton-editar" onclick="editarPan(${index})">Editar</button>
                    <button class="boton-eliminar" onclick="eliminarPan(${index})">Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    }

    // Función para agregar un nuevo pan
    formularioPan.addEventListener("submit", function(event) {
        event.preventDefault();

        // Obtener valores del formulario
        const nombre = document.getElementById("nombre-pan").value;
        const descripcion = document.getElementById("descripcion-pan").value;
        const precio = document.getElementById("precio-pan").value;
        const categoria = document.getElementById("categoria-pan").value;
        const urlImagen = document.getElementById("url-imagen").value;

        // Validaciones
        let errores = [];
        if (!nombre) errores.push("El nombre del pan es obligatorio.");
        if (!descripcion) errores.push("La descripción es obligatoria.");
        if (!precio || precio <= 0) errores.push("El precio debe ser un número positivo.");
        if (!categoria) errores.push("La categoría es obligatoria.");
        if (!urlImagen || !/^https?:\/\//.test(urlImagen)) {
            errores.push("La URL de la imagen debe ser válida (debe comenzar con http:// o https://).");
        }

        // Mostrar errores si existen
        if (errores.length > 0) {
            mensajeError.innerHTML = errores.join("<br>"); // Muestra todos los errores
            return; // Sale de la función si hay errores
        } else {
            mensajeError.innerHTML = ""; // Limpia mensajes de error
        }

        // Agregar nuevo pan si no hay errores
        const nuevoPan = {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            categoria: categoria,
            urlImagen: urlImagen // Agregamos la URL de la imagen
        };

        panes.push(nuevoPan);
        mostrarPanes();
        formularioPan.reset();
    });

    // Función para editar un pan
    window.editarPan = function(index) {
        const pan = panes[index];
        document.getElementById("nombre-pan").value = pan.nombre;
        document.getElementById("descripcion-pan").value = pan.descripcion;
        document.getElementById("precio-pan").value = pan.precio;
        document.getElementById("categoria-pan").value = pan.categoria;
        document.getElementById("url-imagen").value = pan.urlImagen; // Cargar la URL de la imagen en el formulario

        // Remueve el pan de la lista y actualiza la tabla
        panes.splice(index, 1);
        mostrarPanes();
    };

    // Función para eliminar un pan
    window.eliminarPan = function(index) {
        panes.splice(index, 1); // Elimina el pan
        mostrarPanes();
    };

    mostrarPanes(); // Inicializa la tabla
});
function agregarPanTemporada(pan) {
    const elementosCarrusel = document.querySelector(".elementos-carrusel");
    const nuevoElemento = document.createElement("div");
    nuevoElemento.className = "elemento-carrusel";
    nuevoElemento.innerHTML = `
        <img src="${pan.urlImagen}" alt="${pan.nombre}">
        <h3>${pan.nombre}</h3>
        <p class="descripcion">${pan.descripcion}</p>
        <p class="precio">$${pan.precio}</p>
    `;
    elementosCarrusel.appendChild(nuevoElemento);
}

function agregarPanTradicional(pan) {
    const cuadriculaMenu = document.querySelector(".cuadricula-menu");
    const nuevoElemento = document.createElement("div");
    nuevoElemento.className = "elemento-menu";
    nuevoElemento.innerHTML = `
        <img src="${pan.urlImagen}" alt="${pan.nombre}">
        <h3>${pan.nombre}</h3>
        <p class="frase-menu">"Descripción del pan tradicional"</p>
        <p class="precio">$${pan.precio}</p>
    `;
    cuadriculaMenu.appendChild(nuevoElemento);
}

// Modificar la función para agregar un nuevo pan
formularioPan.addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre-pan").value;
    const descripcion = document.getElementById("descripcion-pan").value;
    const precio = document.getElementById("precio-pan").value;
    const categoria = document.getElementById("categoria-pan").value;
    const urlImagen = document.getElementById("url-imagen").value;

    // Validaciones...
    
    const nuevoPan = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        categoria: categoria,
        urlImagen: urlImagen
    };

    panes.push(nuevoPan);
    mostrarPanes(); // Actualiza la tabla

    // Guardar en localStorage
    localStorage.setItem("inventario", JSON.stringify(panes));

    if (categoria === "temporada") {
        agregarPanTemporada(nuevoPan); // Agrega al carrusel
    } else {
        agregarPanTradicional(nuevoPan); // Agrega al menú
    }
    
    formularioPan.reset();
});
