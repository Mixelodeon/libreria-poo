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
                            <img src="${rutaImagen}" alt="Portada de ${libro.titulo}" style="max-width: 100%; height: 250px; object-fit: cover; border-radius: 8px; cursor: pointer;"
                              onclick="verDetalleLibro(${libro.id})">
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
                            <img src="${rutaImagen}" alt="Portada de ${libro.titulo}" style="max-width: 100%; height: 250px; object-fit: cover; border-radius: 8px; cursor: pointer;"
                            onclick="verDetalleLibro(${libro.id})">
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

    // Funcion para añadir un libro a la lista de deseo 
    window.agregarDeseo = function (idLibro) {
        const idUsuario = localStorage.getItem("usuarioId");
        if (!idUsuario) {
            alert("Debes iniciar sesión para guardar libros en tu lista de deseos.");
            window.location.href = "./html/login.html";
            return;
        }

        fetch(`http://localhost:8081/api/deseos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUsuario: parseInt(idUsuario), idLibro: parseInt(idLibro) })
        })
            .then(respuesta => {
                if (respuesta.ok) {
                    alert("¡Añadido a tu lista de deseis!")
                } else if (respuesta.status === 409) {
                    alert("¡Este libro ya se encuentra en tu lista de deseos!");
                } else {
                    alert("¡Error al guardar el libro en tu lista de deseos!")
                }
            }).catch(error => console.error("Error:", error));
    };

    // Funcion para cargar al cliente su lista de deseos
    function cargarDeseos() {
        const idUsuario = localStorage.getItem('usuarioId');
        if (!idUsuario) {
            alert("Debes iniciar sesión para consultar tu lista de deseos.");
            window.location.href = "./html/login.html";
            return;
        }
        fetch(`http://localhost:8081/api/deseos?usuario=${idUsuario}`)
            .then(respuesta => respuesta.json())
            .then(deseos => {
                const grid = document.getElementById('grid-deseos');
                grid.innerHTML = '';

                if (deseos.length === 0) {
                    grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Aún no tienes libros en tu lista de deseos.</p>';
                    return;
                }

                deseos.forEach(item => {
                    const div = document.createElement('div');
                    div.style = "border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; background: #fff;";
                    div.innerHTML = `
                    <img src="./img/${item.portadaUrl}" alt="${item.titulo}" style="width: 100px; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">
                    <h4 style="margin: 5px 0;">${item.titulo}</h4>
                    <p style="color: #27ae60; font-weight: bold; margin: 10px 0;">${item.precio.toFixed(2)} €</p>
                    
                    <button onclick="agregarCarrito(${item.idLibro})" style="background: #f39c12; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px; font-weight: bold;">
                        <i class="fas fa-cart-plus"></i> Al carrito
                    </button>
                    <button onclick="eliminarDeseo(${item.id})" style="background: #c0392b; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 100%;">
                        <i class="fas fa-trash"></i> Quitar
                    </button>
                `;
                    grid.appendChild(div);
                });
            }).catch(error => console.error("Error al cargar deseos:", error));
    }

    // Eliminar un libro de la lista de deseos
    window.eliminarDeseo = function (idDeseo) {
        if (!confirm("¿Seguro que quieres quitar este libro de tus deseos?")) {
            return;
        }

        fetch(`http://localhost:8081/api/deseos?id=${idDeseo}`, {
            method: 'DELETE'
        })
            .then(respuesta => {
                if (respuesta.ok) cargarDeseos();
            }).catch(error => console.error("Error al borrar el libro de la lista de deseos: ", error))
    }

    // Panel de navegacion de la lista de deseos
    document.getElementById('nav-deseos').addEventListener('click', (e) => {
        e.preventDefault();
        if (!localStorage.getItem('usuarioId')) {
            alert("Inicia sesión para ver tu lista de deseos");
            window.location.href = "./html/login.html";
            return;
        }

        // Desaparecer paneles principales y carrito
        document.getElementById('destacados').style.display = 'none';
        document.getElementById('sagas').style.display = 'none';
        document.getElementById('autores').style.display = 'none';
        document.getElementById('tecnicos').style.display = 'none';
        document.getElementById('panel-carrito').style.display = 'none';

        // Mostrar panel de deseos
        document.getElementById('panel-deseos').style.display = 'block';
        cargarDeseos();
    })

    // Boton de volver a la tienda
    document.getElementById('btn-volver-tienda-deseos').addEventListener('click', () => {
        document.getElementById('panel-deseos').style.display = 'none';
        document.getElementById('destacados').style.display = 'block';
        document.getElementById('sagas').style.display = 'block';
        document.getElementById('autores').style.display = 'block';
        document.getElementById('tecnicos').style.display = 'block';
    });

    // Mostrar libro detalladamente
    window.verDetalleLibro = function (idLibro) {
        // Manejamos la interfaz
        document.getElementById('destacados').style.display = 'none';
        document.getElementById('sagas').style.display = 'none';
        document.getElementById('autores').style.display = 'none';
        document.getElementById('tecnicos').style.display = 'none';
        document.getElementById('panel-carrito').style.display = 'none';
        document.getElementById('panel-deseos').style.display = 'none';

        // Mostrar el panel que dara la informacion del libro
        const panelDetalle = document.getElementById('panel-detalle-libro');
        panelDetalle.style.display = 'block';

        // Obtenemos el libro que va a ser mostrado
        fetch('http://localhost:8081/api/libros')
            .then(res => res.json())
            .then(libros => {
                // Fuerza a que ambos sean numeros
                const libro = libros.find(l => parseInt(l.id) === parseInt(idLibro));
                // Si el libro no existe vuelve
                if (!libro) return;

                // Dibuja el diseño de la interfaz detallada del libro
                panelDetalle.innerHTML = `
                <button onclick="cerrarDetalleLibro()" style="margin-bottom: 20px; background: none; border: none; color: #2980b9; cursor: pointer; font-size: 16px; font-weight: bold;">
                    <i class="fas fa-arrow-left"></i> Volver a la tienda
                </button>
                
                <div style="display: flex; gap: 40px; background: #fff; padding: 30px; border-radius: 8px; border: 1px solid #ddd;">
                    <!-- Columna Izquierda: Portada -->
                    <div style="flex: 1; max-width: 300px;">
                        <img src="./img/${libro.portadaURL}" alt="${libro.titulo}" style="width: 100%; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    </div>
                    
                    <!-- Columna Derecha: Info y Botones de Compra -->
                    <div style="flex: 2;">
                        <h2 style="font-size: 28px; margin-bottom: 10px;">${libro.titulo}</h2>
                        
                        <div style="margin: 30px 0; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 350px;">
                            <p style="font-size: 24px; color: #c0392b; font-weight: bold; margin: 0 0 20px 0;">${libro.precio.toFixed(2)} €</p>
                            
                            <!-- Botón principal de añadir a la cesta -->
                            <button onclick="agregarAlCarrito(${libro.id})" style="background: #e91e63; color: white; border: none; padding: 15px; width: 100%; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; margin-bottom: 15px;">
                                <i class="fas fa-shopping-basket"></i> Añadir a la cesta
                            </button>
                            
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
                            
                            <!-- Opciones secundarias -->
                            <button onclick="agregarDeseo(${libro.id})" style="background: none; border: none; color: #34495e; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                                <i class="far fa-heart"></i> Añadir a mis listas
                            </button>
                        </div>
                    </div>
                </div>
            `;
            }).catch(error => console.error("Error al cargar el detalle del libro:", error));
    }
    // Funcion para volver al index
    window.cerrarDetalleLibro = function () {
        if (document.getElementById('panel-detalle-libro')) {
            document.getElementById('panel-detalle-libro').style.display = 'none';
        }
        // Encendemos de nuevo los escaparates de la tienda
        document.getElementById('destacados').style.display = 'block';
        document.getElementById('sagas').style.display = 'block';
        document.getElementById('autores').style.display = 'block';
        document.getElementById('tecnicos').style.display = 'block';
    };
})