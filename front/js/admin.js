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
    const panelBienvenida = document.getElementById('panel-bienvenida');
    const panelLibros = document.getElementById('panel-libros');
    const panelUsuarios = document.getElementById('panel-usuarios');
    const tituloSeccion = document.getElementById('titulo-seccion');

    // Logica de la navegacion por el menu de la interfaz
    navLibros.addEventListener('click', (e) => {
        e.preventDefault();
        // Oculta la bienvenida al admin y muestra el form 
        panelBienvenida.style.display = 'none';
        panelUsuarios.style.display = 'none';
        panelLibros.style.display = 'block';
        // Actualizamos el titulo
        tituloSeccion.textContent = "Añadir Nuevo Libro";
        navUsuarios.classList.remove('activo');
        navLibros.classList.add('activo');
    })

    navUsuarios.addEventListener('click', (e) => {
        e.preventDefault();
        panelBienvenida.style.display = 'none';
        panelLibros.style.display = 'none';
        panelUsuarios.style.display = 'block';
        tituloSeccion.textContent = "Panel De Usuarios";
        navLibros.classList.remove('activo');
        navUsuarios.classList.add('activo');
    })

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

    cargarUsuarios();

    // Cerrar sesion
    document.getElementById('btn-logout-admin').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "../index.html";
    })
})