// Obtener elementos html
const libros = {
    "titulo": document.querySelector("titulo").value,
    "autor": document.querySelector("autor").value,
    "fecha": document.querySelector("fecha").value,
    "genero":document.querySelector("genero").value,
    "score":document.querySelector("score").value
}

function agregarLibro(){
    fetch("/", {
        method: "POST",
        headers:{
        "Content-Type":"application/json"
        },
        body: JSON.stringify(libros)
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error: ", error))
}

function mostrarLibros(){
    fetch("/", {
        "method":"GET"
    })
    .then(response => response.json())
    .then(libros => {
        const table = document.getElementById("table_books")
        table.innerHTML = "" // Antes de agregar libros la tabla se limpia

        libros.forEach(libro => {
            item = `
                <tr>
                    <th>${libro.id_libro}</th>
                    <td>${libro.titulo}</td>
                    <td>${libro.autor}</td>
                    <td>${libro.release_date}</td>
                    <td>${libro.genero}</td>
                    <td>${libro.score}</td>
                </tr>
                `
            table.insertAdjacentHTML("beforeend", item)
        })
    })
    .catch(error)

} 