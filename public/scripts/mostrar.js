let panesArray = [];

fetch('/inventario')
.then(response=> response.json())
.then(data=>{
    panesArray = data
        
    panes(panesArray);

})
.catch(error=>console.error('Error;',error));


function panes(array){

    const thbody = document.querySelector('#panesDiv');

    array.forEach(element => {

        const fila = document.createElement('tr');
        const columnaNombre = document.createElement('th');
        const columnaDescripcion = document.createElement('th');
        const columnaPrecio = document.createElement('th');
        const columnaCategoria = document.createElement('th');
        const columnaURL = document.createElement('th');
        const columnaCantidad = document.createElement('th');
        const img = document.createElement('img');

        columnaNombre.textContent = element.Nombre;
        columnaDescripcion.textContent = element.Descripcion;
        columnaPrecio.textContent = element.Precio;
        
        if(element.categoria == 1){
            columnaCategoria.textContent = 'Temporada';
        }
        else{
            columnaCategoria.textContent = 'Tradicional';
        }
        
        columnaCantidad.textContent = element.cantidad;
        img.src = element.urlimage;
        img.alt = 'Imagen no encontrada';
        img.className='imagen';

        columnaURL.appendChild(img);

        fila.appendChild(columnaNombre);
        fila.appendChild(columnaDescripcion);
        fila.appendChild(columnaPrecio);
        fila.appendChild(columnaCategoria);
        fila.appendChild(columnaURL);
        fila.appendChild(columnaCantidad);

        thbody.appendChild(fila);
    });

}