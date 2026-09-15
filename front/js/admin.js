document.addEventListener('DOMContentLoaded', () => {
    // Comprobacion de que es el usuario administrador
    // Se obtienen variables y si se comprueba mediante un if el rol
    const rolUsuario = localStorage.getItem('usuarioRol');
    const nombreUsuario = localStorage.getItem('usuarioNombre');
    // Convierte el dato en un numero entero
    const rol = parseInt(rolUsuario);
    if (rol !== 0) {
        alert("Acceso denegado. No tienes los permisos necesarios.");
        window.location.href = "../index.html";
        return;
    }

    document.getElementById('nombre-admin').textContent = nombreUsuario;

    const navLibros = document.getElementById('nav-libros');
    const panelBienvenida = document.getElementById('panel-bienvenida');
    const panelLibros = document.getElementById('panel-libros');
    const tituloSeccion = document.getElementById('titulo-seccion');

    // Logica de la navegacion por el menu de la interfaz
    navLibros.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Pulsado")
        // Oculta la bienvenida al admin y muestra el form 
        panelBienvenida.style.display = 'none';
        panelLibros.style.display = 'block';
        // Actualizamos el titulo
        tituloSeccion.textContent = "Añadir Nuevo Libro";
        navLibros.classList.add('activo');
    })

    const formNuevoLibro = document.getElementById('form-nuevo-libro');
    if (formNuevoLibro) {
        formNuevoLibro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nuevoLibro = {
                titulo: document.getElementById('titulo').value,
                autor: document.getElementById('autor').value,
                precio: parseFloat(document.getElementById('precio').value),
                categoria: document.getElementById('categoria').value,
                editorial: document.getElementById('editorial').value,
                numPaginas: parseInt(document.getElementById('numPaginas').value),
                portadaURL: document.getElementById('portadaURL').value
            };
            console.log("Enviando libro a Java:", nuevoLibro);
            fetch('http://localhost:8081/api/libros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoLibro)
            })
                .then(respuesta => {
                    if (respuesta.ok) {
                        alert("¡Éxito! Libro añadido al catálogo.");
                        formNuevoLibro.reset(); // Limpia los campos del formulario automáticamente
                    } else {
                        alert("Hubo un error al guardar el libro en la base de datos.");
                    }
                })
                .catch(error => {
                    console.error("Error de conexión:", error);
                    alert("El servidor está apagado o no responde.");
                });
        })
    }


    // Cerrar sesion
    document.getElementById('btn-logout-admin').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "../index.html";
    })
})