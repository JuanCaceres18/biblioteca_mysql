
async function agregarLibro(){
    // Obtener elementos html
    const libros = {
        titulo: document.querySelector(".titulo").value,
        autor: document.querySelector(".autor").value,
        fecha: document.querySelector(".fecha").value,
        genero:document.querySelector(".genero").value,
        score:document.querySelector(".calificacion").value
    }    

    console.log(`Titulo: ${libros.titulo}`);
    console.log(`Autor: ${libros.autor}`);
    console.log(`Fecha: ${libros.fecha}`);
    console.log(`Genero: ${libros.genero}`);
    console.log(`Score: ${libros.score}`);

    await fetch("/api/libros", {
        method: "POST",
        headers:{
        "Content-Type":"application/json"
        },
        body: JSON.stringify(libros)
    })
    .then(response => {
        if (!response.ok){
            throw new Error("The network doesn't work");
        }
        return response.json()
    })
    .then(data => {
        console.log(data)
        Swal.fire({
            icon: "success",
            title: "Genial!",
            text: "Libro guardado",
          });
        mostrarLibros();
    })
    .catch(error => {
        console.error("Hubo un error: ", error)
    })
}

async function mostrarLibros(){
    fetch("/api/libros")
    .then(response => {
        if (!response.ok){
            throw new Error("The network doesn't work")
        }
        return response.json()
    })
    .then(data => {
        // Mostrar respuesta del servidor
        console.log(data);

        // Obtener tabla del frontend
        const table = document.getElementById("table_books");

        // Limpiar tabla
        table.innerHTML= ""
        data.forEach((libro) => {
            item = `<tr class="fila">
                        <td>${libro[0]}</td>
                        <td>${libro[1]}</td>
                        <td>${libro[2]}</td>
                        <td>${libro[3]}</td>
                        <td>${libro[4]}</td>
                        <td>${libro[5]}</td>
                        <td>
                            <div>
                                <button type="button" class="btn btn-primary" id ="btn-${libro[0]}" onclick="editarLibro(${libro[0]})"><i class="fa-solid fa-pen-to-square icono"></i></button>
                                <button type="button" class="btn btn-danger" onclick="eliminarLibro(${libro[0]})"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                    `
            table.insertAdjacentHTML("beforeend",item);
        })
   })
    .catch(error => {
        console.error("Hubo un error: ", error);
    }) 
} 

async function cargarLibro(id_libro){
    try{
        // Hago solicitud al servidor
        const response = await fetch(`/api/libros/${id_libro}`)

        if (!response.ok){
            console.log(response);
            throw new Error("The network doesn't work")
        } 
        
        // Respuesta del servidor
        const result = await response.json()

        console.log(result)
        
        // Obtener inputs
        const titulo = document.querySelector(".titulo");
        const autor = document.querySelector(".autor");
        const fecha = document.querySelector(".fecha");
        const genero = document.querySelector(".genero");
        const score = document.querySelector(".calificacion");
        
        // Colocar datos de fila elegida en los inputs
        titulo.value = result.titulo;
        autor.value = result.autor;
        fecha.value = result.fecha;
        console.log(result.fecha)
        genero.value = result.genero;
        score.value = result.score;
    }
    catch(error){
        console.error("Hubo un error: ", error)
    }
}

// Función para editar libro
async function editarLibro(id_libro){
    // Obtener botón
    const btn = document.querySelector(`#btn-${id_libro}`);
    const icono = btn.querySelector(".icono");

    // Obtener todos los botones
    const allBtns = document.querySelectorAll(".btn-primary");

    // Itero cada botón - Evitar el cambio de ícono de muchos botones a la vez
    allBtns.forEach(boton => {
        const icon =  boton.querySelector(".icono");
            if (icon.classList.contains("fa-check")){
                icon.classList.remove("fa-check");
                icon.classList.add("fa-pen-to-square");
            }
    })

    if (icono.classList.contains("fa-pen-to-square")){    
        // Cargo primero el libro
        await cargarLibro(id_libro)
        
        // Cambio el ícono
        icono.classList.remove("fa-pen-to-square");
        icono.classList.add("fa-check");
        
        btn.removeEventListener("click", manejarClick)
        btn.addEventListener("click", manejarClick);

        async function manejarClick(){
            // Obtengo el valor de los inputs
            const titulo = document.querySelector(".titulo").value;
            const autor = document.querySelector(".autor").value;
            const fecha = document.querySelector(".fecha").value;
            const genero = document.querySelector(".genero").value;
            const score = document.querySelector(".calificacion").value;

            // Hago la solicitud PUT
            try{
                const response = await fetch(`/api/libros/${id_libro}`, {
                    method: "PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        titulo: titulo,
                        autor: autor,
                        fecha: fecha,
                        genero: genero,
                        score: score
                    })
                })

                if (!response.ok){
                    console.log(response)
                    throw new Error("Hubo un error en la respuesta del PUT")
                }

                // Respuesta del servidor
                const data = await response.json()
                console.log(data)
            }
            catch (error){
                console.error("Hubo un error: ", error);
            }

            // Cambio el ícono
            icono.classList.remove("fa-check");
            icono.classList.add("fa-pen-to-square");

            // Limpio los campos
            LimpiarCampos();
            // Actualizo la lista de libros después de confirmar cambios
            mostrarLibros();
        
        }
    }
}

function LimpiarCampos(){
    // Obtengo los inputs por medio del DOM
    const titulo = document.querySelector(".titulo");
    const autor = document.querySelector(".autor");
    const fecha = document.querySelector(".fecha");
    const genero = document.querySelector(".genero");
    const score = document.querySelector(".calificacion");

    // Establezco sus valores en vacío
    titulo.value = "";
    autor.value = "";
    fecha.value = "";
    genero.value = "";
    score.value = "";
}

// Eliminar registro
async function eliminarLibro(id_libro){
    Swal.fire({
        title: "¿Estás seguro de que quieres eliminarlo?",
        text: "No serás capaz de revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar"
      }).then(async (result) => {
        if (result.isConfirmed) {
            // Obtengo el contenido de los libros
            const data = await fetch(`/api/libros/${id_libro}`);
            // Si el libro existe
            if (data){
                try{
                    const response = await fetch(`/api/libros/${id_libro}`, {
                        method:"DELETE",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify(data)
                    })
                    if (!response.ok){
                        console.log(response);
                        throw new Error("Hubo un error en el DELETE");
                    }
            
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El libro ha sido eliminado",
                        icon: "success"
                    });
                    // Actualizo la tabla de libros
                    mostrarLibros();
                }
                catch{
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Algo salió mal",
                    });
                }
            }
        }
    });
}

function validarCampos(){
    const titulo = document.querySelector(".titulo");
    const autor = document.querySelector(".autor");
    const fecha = document.querySelector(".fecha");
    const genero = document.querySelector(".genero");
    const score = document.querySelector(".calificacion");

    if (!titulo.value || !autor.value || !genero.value || !fecha.value || !score.value){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Debes rellenar todos los campos",
          });
    }
}