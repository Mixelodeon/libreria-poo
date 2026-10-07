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
    const navUsuarios = document.getElementById('nav-usuarios');
    const navPedidos = document.getElementById('nav-pedidos');
    const panelBienvenida = document.getElementById('panel-bienvenida');
    const panelLibros = document.getElementById('panel-libros');
    const panelUsuarios = document.getElementById('panel-usuarios');
    const tituloSeccion = document.getElementById('titulo-seccion');
    const contenedorTablaLibros = document.getElementById('contenedor-tabla-libros');
    const panelNuevoLibro = document.getElementById('panel-nuevo-libro');
    const panelEditarLibro = document.getElementById('panel-editar-libro');
    const panelPedidos = document.getElementById('panel-pedidos');

    // Logica de la navegacion por el menu de la interfaz
    navLibros.addEventListener('click', (e) => {
        e.preventDefault();
        // Oculta la bienvenida al admin y muestra el form 
        panelBienvenida.style.display = 'none';
        panelUsuarios.style.display = 'none';
        panelPedidos.style.display = 'none';
        panelLibros.style.display = 'block';

        // Actualizamos el titulo
        tituloSeccion.textContent = "Panel De Inventario";
        navUsuarios.classList.remove('activo');
        navPedidos.classList.remove('activo');
        navLibros.classList.add('activo');
    })

    navUsuarios.addEventListener('click', (e) => {
        e.preventDefault();
        panelBienvenida.style.display = 'none';
        panelLibros.style.display = 'none';
        panelPedidos.style.display = 'none';
        panelUsuarios.style.display = 'block';
        tituloSeccion.textContent = "Panel De Usuarios";
        navLibros.classList.remove('activo');
        navPedidos.classList.remove('activo');
        navUsuarios.classList.add('activo');
    })

    navPedidos.addEventListener('click', (e) => {
        e.preventDefault();
        panelBienvenida.style.display = 'none';
        panelLibros.style.display = 'none';
        panelUsuarios.style.display = 'none';
        panelPedidos.style.display = 'block';

        tituloSeccion.textContent = "Panel De Pedidos";
        navLibros.classList.remove('activo');
        navUsuarios.classList.remove('activo');
        navPedidos.classList.add('activo');

        cargarPedidosClientes();
    })

    // Control del panel añadir/editar/borrar libros
    // Boton abrir form de añadir libro
    document.getElementById('btn-mostrar-nuevo-libro').addEventListener('click', () => {
        contenedorTablaLibros.style.display = 'none';
        panelNuevoLibro.style.display = 'block';
        tituloSeccion.textContent = "Añadir Nuevo Libro";
    })
    // Boton cancelar añadir libro y volver a la tabla
    document.getElementById('btn-cancelar-nuevo-libro').addEventListener('click', (e) => {
        e.preventDefault();
        panelNuevoLibro.style.display = 'none';
        contenedorTablaLibros.style.display = 'block';
        tituloSeccion.textContent = "Gestion de libros";
    })
    // Boton cancelar edicion de libro y volver a la tabla
    document.getElementById('btn-cancelar-edicion-libro').addEventListener('click', (e) => {
        e.preventDefault();
        panelEditarLibro.style.display = 'none';
        contenedorTablaLibros.style.display = 'block';
        tituloSeccion.textContent = "Gestión de Libros";
    });


    const formNuevoLibro = document.getElementById('form-nuevo-libro');
    if (formNuevoLibro) {
        formNuevoLibro.addEventListener('submit', (e) => {
            e.preventDefault();
            // Busca los checkbox que el usuario haya seleccionado
            const checkboxMarcados = document.querySelectorAll('input[name="categoriaCheckbox"]:checked');
            // Extraemos el valor de cada uno y lo convertimos en numero entero
            const categoriasSeleccionadas = Array.from(checkboxMarcados).map(checkbox => parseInt(checkbox.value));
            // Validacion rapida para que no mande un libro sin categoria
            if (categoriasSeleccionadas.length === 0) {
                alert("Por favor, selecione una categoría.")
                return;
            }
            const nuevoLibro = {
                titulo: document.getElementById('titulo').value,
                autor: document.getElementById('autor').value,
                precio: parseFloat(document.getElementById('precio').value),
                categoriasIds: categoriasSeleccionadas,
                editorial: document.getElementById('editorial').value,
                numPaginas: parseInt(document.getElementById('numPaginas').value),
                portadaURL: document.getElementById('portadaURL').value,
                destacado: document.getElementById('destacado').checked
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
                        // Ocultar formulario y recargar la tabla
                        document.getElementById('panel-nuevo-libro').style.display = 'none';
                        document.getElementById('contenedor-tabla-libros').style.display = 'block';
                        document.getElementById('titulo-seccion').textContent = "Gestión de Libros";
                        // Vuelve a pedir los libros a la bd
                        cargarLibros();
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

    // Funcion para descargar e imprimir la tabla con usuarios
    function cargarUsuarios() {
        fetch('http://localhost:8081/api/usuarios')
            .then(respuesta => {
                if (!respuesta.ok) throw new Error("Error al obtener los usuarios");
                return respuesta.json();
            })
            .then(usuarios => {
                const tbody = document.getElementById('tabla-usuarios-body');
                tbody.innerHTML = '';

                if (usuarios.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay usuarios registrados.</td></tr>';
                    return;
                }
                usuarios.forEach(usuario => {
                    let badgeHTML = '';
                    if (usuario.rol === 0) {
                        badgeHTML = '<span class="badge badge-admin">Admin</span>'
                    } else {
                        badgeHTML = '<span class="badge badge-usuario">Usuario</span>';
                    }
                    // Crear la fila (tr) de la tabla
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${usuario.id}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellidos}</td>
                        <td>${usuario.email}</td>
                        <td>${badgeHTML}</td>
                        <td class="acciones-td">
                            <button class="btn-icono btn-editar" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="btn-icono btn-eliminar" title="Eliminar"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    // Funcionamiento del boton editar usuario de la fila
                    const btnEditar = tr.querySelector('.btn-editar');
                    btnEditar.addEventListener('click', () => {
                        prepararEdicion(usuario);
                    })
                    const btnEliminarUsuario = tr.querySelector('.btn-eliminar');
                    // Se llama a la funcion externa de eliminar usuario
                    btnEliminarUsuario.addEventListener('click', () => {
                        eliminarUsuario(usuario.id, usuario.nombre);
                    })
                    tbody.appendChild(tr);
                })
            }).catch(error => {
                console.error("Error de conexión:", error);
                const tbody = document.getElementById('tabla-usuarios-body');
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar los usuarios. Comprueba el servidor.</td></tr>';
            });
    }

    // Funcion para descargar e imprimir la tabla con los libros
    function cargarLibros() {
        fetch('http://localhost:8081/api/libros')
            .then(respuesta => {
                if (!respuesta.ok) throw new Error("Error al obtener los libros");
                return respuesta.json();
            })
            .then(libros => {
                const tbody = document.getElementById('tabla-libros-body');
                tbody.innerHTML = '';

                if (libros.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay libros registrados.</td></tr>';
                    return;
                }
                libros.forEach(libro => {
                    let nombresCategorias = "Sin categoría";
                    if (libro.categoriasNombres && libro.categoriasNombres.length > 0) {
                        nombresCategorias = libro.categoriasNombres.join(', ');
                    }
                    // Crea la fila (tr) de la tabla
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${libro.id}</td>
                        <td><img src="../img/${libro.portadaURL}" alt="${libro.titulo}" style="width: 50px; height: auto; border-radius: 4px;"></td>
                        <td>${libro.titulo}</td>
                        <td>${libro.autor}</td>
                        <td>${libro.precio} €</td>
                        <td>${nombresCategorias}</td>
                        <td class="acciones-td">
                            <button class="btn-icono btn-editar btn-editar-libro" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="btn-icono btn-eliminar btn-eliminar-libro" title="Eliminar"><i class="fas fa-trash"></i></button>
                        </td>
                    `;

                    const btnEditar = tr.querySelector('.btn-editar-libro');
                    btnEditar.addEventListener('click', () => {
                        console.log("Entra en editar libro ID: " + libro.id);
                        prepararEdicionLibro(libro);
                    })

                    const btnEliminar = tr.querySelector('.btn-eliminar-libro');
                    btnEliminar.addEventListener('click', () => {
                        console.log("Entra en eliminar libro ID: " + libro.id);
                        eliminarLibro(libro.id, libro.titulo);
                    })
                    tbody.appendChild(tr);
                })
            }).catch(error => {
                console.error("Error de conexión:", error);
                const tbody = document.getElementById('tabla-usuarios-body');
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar los usuarios. Comprueba el servidor.</td></tr>';
            });
    }

    // Funcion que consulta las categorias de los libros y las muestra en el html
    function cargarCategorias() {
        fetch('http://localhost:8081/api/categorias')
            .then(respuesta => {
                if (!respuesta.ok) throw new Error("Error al obtener las categorías.");
                return respuesta.json();
            })
            .then(categorias => {
                const contenedor = document.getElementById('grupo-categorias');
                contenedor.innerHTML = '';
                // Crea un checkbox por cada categoria que tenga en la bd 
                categorias.forEach(categoria => {
                    const label = document.createElement('label');
                    label.innerHTML = `<input type="checkbox" name="categoriaCheckbox" value="${categoria.id}"> ${categoria.nombre}`;
                    contenedor.appendChild(label);
                })
            }).catch(error => {
                console.error("Error al cargar categorías:", error);
                document.getElementById('grupo-categorias').innerHTML = '<span style="color: red;">Error al cargar las categorías.</span>';
            });
    }

    cargarCategorias();

    // Funcion para el formulario de editar usuario
    function prepararEdicion(usuario) {
        // Apaga la tabla y enciende el panel de edicion
        document.getElementById('contenedor-tabla-usuarios').style.display = 'none';
        document.getElementById('panel-editar-usuario').style.display = 'block';

        // Modifica el titulo dinamico
        document.getElementById('nombre-usuario-editar').textContent = usuario.nombre;

        // Rellena los inputs del formulario automaticamente
        document.getElementById('edit-id').value = usuario.id;
        document.getElementById('edit-nombre').value = usuario.nombre;
        document.getElementById('edit-apellidos').value = usuario.apellidos;
        document.getElementById('edit-email').value = usuario.email;
        document.getElementById('edit-rol').value = usuario.rol;
    }

    // Logica para enviar formulario con los cambios del usuario
    const formEditarUsuario = document.getElementById('form-editar-usuario');
    if (formEditarUsuario) {
        formEditarUsuario.addEventListener('submit', (e) => {
            e.preventDefault();
            // Recoleta los datos, convirtiendo a numeros el id y el Rol
            const usuarioEditado = {
                id: parseInt(document.getElementById('edit-id').value),
                nombre: document.getElementById('edit-nombre').value,
                apellidos: document.getElementById('edit-apellidos').value,
                email: document.getElementById('edit-email').value,
                rol: parseInt(document.getElementById('edit-rol').value)
            };
            // Envia con metodo PUT
            fetch('http://localhost:8081/api/usuarios', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioEditado)
            })
                .then(respuesta => {
                    if (respuesta.ok) {
                        alert("¡Usuario actualizado con éxito!");

                        // 1. Ocultar formulario y mostrar tabla
                        document.getElementById('panel-editar-usuario').style.display = 'none';
                        document.getElementById('contenedor-tabla-usuarios').style.display = 'block';

                        // 2. Refrescar la tabla mágicamente para ver los cambios al instante
                        cargarUsuarios();
                    } else {
                        alert("Error al guardar los cambios en la base de datos.");
                    }
                })
                .catch(error => {
                    console.error("Error de conexión:", error);
                    alert("El servidor no responde.");
                });
        })
    }

    // Logica del boton cancelar para volver a la tabla sin guardar
    const cancelarEdicion = document.getElementById('btn-cancelar-edicion');
    cancelarEdicion.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('panel-editar-usuario').style.display = 'none';
        document.getElementById('contenedor-tabla-usuarios').style.display = 'block';
    })

    // Funcion eliminar usuario
    function eliminarUsuario(idUsuario, nombreUsuario) {
        const confirmar = confirm(`¿Estás seguro que deseas eliminar ${nombreUsuario} de la Base De Datos?`)
        if (confirmar) {
            // Mandamos la orden con el id mediante la URL
            fetch(`http://localhost:8081/api/usuarios?id=${idUsuario}`, {
                method: 'DELETE'
            })
                .then(respuesta => {
                    if (respuesta.ok) {
                        alert("Usuario eliminado correctamente.");
                        // Recarga la tabla para que desaparezca visualmente
                        cargarUsuarios();
                    } else {
                        alert("Hubo un error y no se pudo eliminar el usuario.");
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar:", error);
                    alert("El servidor no responde.");
                });
        }
    }

    function prepararEdicionLibro(libro) {
        document.getElementById('contenedor-tabla-libros').style.display = 'none';
        document.getElementById('panel-editar-libro').style.display = 'block';
        document.getElementById('titulo-seccion').textContent = "Editar Libro: " + libro.titulo;

        document.getElementById('edit-libro-id').value = libro.id;
        document.getElementById('edit-titulo').value = libro.titulo;
        document.getElementById('edit-autor').value = libro.autor;
        document.getElementById('edit-precio').value = libro.precio;
        document.getElementById('edit-editorial').value = libro.editorial;
        document.getElementById('edit-numPaginas').value = libro.numPaginas;
        document.getElementById('edit-portadaURL').value = libro.portadaURL;
        document.getElementById('edit-destacado').checked = libro.destacado;

        fetch('http://localhost:8081/api/categorias')
            .then(res => res.json())
            .then(categorias => {
                const contenedor = document.getElementById('edit-grupo-categorias');
                contenedor.innerHTML = '';

                categorias.forEach(categoria => {
                    // Comprueba si el libro ya tenía esta categoria  para dejarla marcada
                    const estaMarcado = libro.categoriasIds.includes(categoria.id) ? 'checked' : '';

                    const label = document.createElement('label');
                    label.innerHTML = `<input type="checkbox" name="editCategoriaCheckbox" value="${categoria.id}" ${estaMarcado}> ${categoria.nombre}`;
                    contenedor.appendChild(label);
                })
            })
    }

    // Evento para enviar el form de edicion PUT
    const formEditarLibro = document.getElementById('form-editar-libro');
    if (formEditarLibro) {
        formEditarLibro.addEventListener('submit', (e) => {
            e.preventDefault();
            const checkboxMarcados = document.querySelectorAll('input[name="editCategoriaCheckbox"]:checked');
            const categoriasSeleccionadas = Array.from(checkboxMarcados).map(cb => parseInt(cb.value));

            if (categoriasSeleccionadas.length === 0) {
                alert("Por favor, seleccione al menos una categoría.")
                return;
            }
            const libroEditado = {
                id: parseInt(document.getElementById('edit-libro-id').value),
                titulo: document.getElementById('edit-titulo').value,
                autor: document.getElementById('edit-autor').value,
                precio: parseFloat(document.getElementById('edit-precio').value),
                categoriasIds: categoriasSeleccionadas,
                editorial: document.getElementById('edit-editorial').value,
                numPaginas: parseInt(document.getElementById('edit-numPaginas').value),
                portadaURL: document.getElementById('edit-portadaURL').value,
                destacado: document.getElementById('edit-destacado').checked
            };

            fetch('http://localhost:8081/api/libros', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(libroEditado)
            })
                .then(respuesta => {
                    if (respuesta.ok) {
                        alert("¡Libro actualizado correctamente!");
                        document.getElementById('panel-editar-libro').style.display = 'none';
                        document.getElementById('contenedor-tabla-libros').style.display = 'block';
                        document.getElementById('titulo-seccion').textContent = "Gestión de Libros";
                        cargarLibros(); // Recarga la tabla para ver los cambios
                    } else {
                        alert("Hubo un error al actualizar el libro.");
                    }
                })
                .catch(error => console.error("Error:", error));
        })
    }

    // Funcion para eliminar libros
    function eliminarLibro(idLibro, tituloLibro) {
        const confirmar = confirm(`¿Seguro que desea eliminar "${tituloLibro}"?`)
        if (confirmar) {
            fetch(`http://localhost:8081/api/libros?id=${idLibro}`, {
                method: 'DELETE'
            })
                .then(respuesta => {
                    if (respuesta.ok) {
                        alert('Libro eliminado con exito.')
                        // Recargar la tabla para que se vea que a sido eliminado
                        cargarLibros();
                    } else {
                        alert("Hubo un error al eliminar el libro en la base de datos.");
                    }
                }).catch(error => {
                    console.error("Error al eliminar:", error);
                    alert("El servidor no responde.");
                });
        }
    }

    cargarUsuarios();
    cargarLibros();

    // Obtener los pedidos de los clientes
    function cargarPedidosClientes() {
        fetch('http://localhost:8081/api/pedidos')
            .then(respuesta => {
                if (!respuesta.ok) throw new Error("Error al obtener los pedidos del servidor");
                return respuesta.json();
            })
            .then(pedidos => {
                const tbody = document.getElementById('tabla-pedidos-body');
                tbody.innerHTML = '';
                if (pedidos.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay carritos activos ni pedidos en curso.</td></tr>';
                    return;
                }
                pedidos.forEach(pedido => {
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = "1px solid #eee";
                    tr.innerHTML = `
                    <td style="padding: 12px;">#${pedido.idLinea}</td>
                    <td style="padding: 12px; font-weight: bold;">${pedido.nombreUsuario}</td>
                    <td style="padding: 12px; color: #7f8c8d;">${pedido.emailUsuario}</td>
                    <td style="padding: 12px; color: #2980b9;">${pedido.tituloLibro}</td>
                    <td style="padding: 12px; text-align: center; font-weight: bold;">${pedido.cantidad}</td>
                    <td style="padding: 12px;">${pedido.precioUnitario.toFixed(2)} €</td>
                    <td style="padding: 12px; color: #27ae60; font-weight: bold;">${pedido.totalLinea.toFixed(2)} €</td>
                `;
                    tbody.appendChild(tr);
                })
            }).catch(error => {
                console.error("Error al cargar pedidos: ", error);
                document.getElementById('tabla-pedidos-body').innerHTML =
                    '<tr><td colspan="7" style="text-align: center; color: red; padding: 20px;">Error de conexión. Comprueba que el servidor Java está encendido.</td></tr>';
            });
    }

    // Cerrar sesion
    document.getElementById('btn-logout-admin').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "../index.html";
    })
})