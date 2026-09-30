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
                        <button class="btn-agregar" onclick="agregarAlCarrito(${libro.id})"><i class="fas fa-cart-plus"></i> Añadir</button>
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

    function cargarLibrosDestacados() {
        // Peticion GET
        fetch('http://localhost:8081/api/libros?filtro=destacados')
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
                        <button class="btn-agregar" onclick="agregarCarrito(${libro.id})"><i class="fas fa-cart-plus"></i> Añadir</button>                    `;
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
    cargarLibrosDestacados();

    // Logica carrito
    // Mostrar carrito y ocultar la tienda
    document.getElementById('nav-carrito').addEventListener('click', (e) => {
        e.preventDefault();
        // Comprueba si el usuario esta logueado en la web 
        if (!localStorage.getItem('usuarioId')) {
            alert("Debes iniciar sesión para ver tu carrito:");
            window.location.href = "./html/login.html";
            return;
        }

        // Oculta las secciones de la tienda
        document.getElementById('destacados').style.display = 'none';
        document.getElementById('sagas').style.display = 'none';
        document.getElementById('autores').style.display = 'none';
        document.getElementById('tecnicos').style.display = 'none';
        //Muestra el carrito
        document.getElementById('panel-carrito').style.display = 'block';

        // Llamamos a la funcion cargarCarrito()
        cargarCarrito();
    })

    // Permite volver a la tienda haciendo click en el logo
    document.querySelector('.logo').addEventListener('click', (e) => {
        // Si se encuentra en el index, restaura la vista
        document.getElementById('panel-carrito').style.display = 'none';
        document.getElementById('destacados').style.display = 'block';
        document.getElementById('sagas').style.display = 'block';
        document.getElementById('autores').style.display = 'block';
        document.getElementById('tecnicos').style.display = 'block';
    })

    // Funcion global para enviar un libro al backend
    window.agregarCarrito = function (idLibro) {
        const idUsuario = localStorage.getItem('usuarioId');
        if (!idUsuario) {
            alert("Debes iniciar sesión para añadir libros al carrito.");
            window.location.href = "./html/login.html";
            return;
        }
        const datosPeticion = {
            idUsuario: parseInt(idUsuario),
            idLibro: parseInt(idLibro)
        };
        fetch('http://localhost:8081/api/carrito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPeticion)
        })
            .then(respuesta => {
                if (respuesta.ok) {
                    alert("¡Libro añadido a tu carrito!");
                } else {
                    alert("Error al añadir el libro al carrito.");
                }
            })
            .catch(error => console.error("Error de conexión:", error));
    }

    window.eliminarDelCarrito = function (idCarrito) {
        if (!confirm("¿Seguro que quieres quitar este libro de la cesta?")) {
            return;
        }

        fetch(`http://localhost:8081/api/carrito?id=${idCarrito}`, {
            method: 'DELETE'
        })
            .then(respuesta => {
                if (respuesta.ok) {
                    // Si se borra bien en Java recargamos la tabla visual
                    cargarCarrito();
                } else {
                    alert("Hubo un problema al eliminar el libro.");
                }
            })
            .catch(error => console.error("Error al borrar el libro:", error));
    };

    // Mostrar tabla con los libros en el carrito
    function cargarCarrito() {
        const idUsuario = localStorage.getItem('usuarioId');
        if (!idUsuario) {
            return;
        }
        fetch(`http://localhost:8081/api/carrito?usuario=${idUsuario}`)
            .then(respuesta => {
                if (!respuesta.ok) throw new Error("Error al obtener el carrito");
                return respuesta.json();
            })
            .then(items => {
                const tbody = document.getElementById('tabla-carrito-body');
                const totalSpan = document.getElementById('precio-total-carrito');
                // Limpia la tabla antes de rellenarla
                tbody.innerHTML = '';
                let total = 0;
                // Si el carrito está vacío
                if (items.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Tu carrito está vacío.</td></tr>';
                    totalSpan.textContent = '0.00';
                    return;
                }
                // Recorre los libros y crea las filas
                items.forEach(item => {
                    const subtotal = item.precio * item.cantidad;
                    total += subtotal;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                        <img src="./img/${item.portadaUrl}" alt="${item.titulo}" style="width: 50px; height: 75px; object-fit: cover; border-radius: 4px;">
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">${item.titulo}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.precio.toFixed(2)} €</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.cantidad}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                        <button onclick="eliminarDelCarrito(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;" title="Eliminar un libro">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                    tbody.appendChild(tr);
                })
                // Actualiza el precio final
                totalSpan.textContent = total.toFixed(2);
            }).catch(error => console.error("Error al cargar el carrito:", error));
    }

    // Volver al index desde el carrito
    document.getElementById('btn-volver-tienda').addEventListener('click', () => {
        document.getElementById('panel-carrito').style.display = 'none';
        document.getElementById('destacados').style.display = 'block';
        document.getElementById('sagas').style.display = 'block';
        document.getElementById('autores').style.display = 'block';
        document.getElementById('tecnicos').style.display = 'block';
    });
})