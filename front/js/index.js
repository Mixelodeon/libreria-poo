document.addEventListener('DOMContentLoaded', () => {
    const nombreUsuario = localStorage.getItem('usuarioNombre');
    const rolUsuario = localStorage.getItem('usuarioRol');

    console.log("Nombre encontrado:", nombreUsuario);

    // Comprobamiento de si existe un usuario logeado
    if (nombreUsuario !== null && nombreUsuario !== "undefined") {
        const textoBienvenida = document.getElementById('texto-bienvenida');
        const enlaceUsuario = document.getElementById('enlace-usuario');
        const menuPrincipal = document.querySelector('.menuPrincipal');

        textoBienvenida.textContent = nombreUsuario;
        enlaceUsuario.href = "#";
        enlaceUsuario.title = "Perfil";

        // Ocultar icono del usuario
        const iconoUsuario = enlaceUsuario.querySelector('.fa-user');
        if (iconoUsuario) {
            iconoUsuario.style.display = 'none';
        }
        // Convierte el String en int
        const rol = parseInt(rolUsuario);
        if (rol == 0) {
            const itemAdmin = document.getElementById('item-admin');
            if (itemAdmin) {
                // Mostrar la vuelta a su panel al admin
                itemAdmin.style.display = 'inline-block';
            }
        }


        // El logout del usuario, simplemente consta en limpiar el localStorage, no molestamos a la bd
        const liLogout = document.createElement('li');
        liLogout.innerHTML = '<a href="#" id="btn-logout" title="Salir"><i class="fas fa-sign-out-alt" style="color: #ff4757;"></i></a>';
        menuPrincipal.appendChild(liLogout);

        document.getElementById('btn-logout').addEventListener('click', (e) => {
            e.preventDefault();
            // Libera localStorege de los datos del usuario
            localStorage.clear();
            window.location.reload();
        })
    }

    // Carga los libros de la bd
    function cargarLibros() {
        // Peticion GET
        fetch('http://localhost:8081/api/libros')
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error("Error al obtener los libros del servidor.");
                }
                // Convierte el JSON de java en un array
                return respuesta.json()
            })
            .then(libros => {
                const contenedor = document.getElementById('contenedor-destacados');
                // Limpia por si acaso
                contenedor.innerHTML = '';
                // Si no se dispone de libros en la bd se muestra un mensaje
                if (libros.length === 0) {
                    contenedor.innerHTML = '<p>No hay libros disponibles en este momento.</p>';
                    return;
                }

                // Recorre cada libro y crea su respectiva tarjeta html
                libros.forEach(libro => {
                    const tarjeta = document.createElement('div');
                    tarjeta.className = 'tarjeta-libro';
                    // Une la carpeta ./img/ con el nombre que viene de la bd
                    const rutaImagen = `./img/${libro.portadaURL}`;
                    tarjeta.innerHTML = `
                        <div class="contenedor-portada" style="text-align: center; margin-bottom: 15px;">
                            <img src="${rutaImagen}" alt="Portada de ${libro.titulo}" style="max-width: 100%; height: 250px; object-fit: cover; border-radius: 8px;">
                        </div>
                        <h3 class="titulo">${libro.titulo}</h3>
                        <p class="autor">${libro.autor}</p>
                        <p class="precio">${libro.precio.toFixed(2)} €</p>
                        <button class="btn-agregar"><i class="fas fa-cart-plus"></i> Añadir</button>
                    `;
                    contenedor.appendChild(tarjeta);
                })
            })
            .catch((error => {
                console.error("Error cargando el catalogo: ", error);
                const contenedor = document.getElementById('contenedor-destacados');
                contenedor.innerHTML = '<p style="color: red;">Error al cargar el catálogo. Comprueba que el servidor está encendido.</p>';
            }))
    }
    // Llamamos a la funcion de cargar los libros nada mas se carga la pagina
    cargarLibros();
})