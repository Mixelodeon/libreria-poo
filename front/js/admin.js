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
            const nuevoLibro = {
                titulo: document.getElementById('titulo').value,
                autor: document.getElementById('autor').value,
                precio: parseFloat(document.getElementById('precio').value),
                categoria: document.getElementById('categoria').value,
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
                    tbody.appendChild(tr);
                })
            }).catch(error => {
                console.error("Error de conexión:", error);
                const tbody = document.getElementById('tabla-usuarios-body');
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar los usuarios. Comprueba el servidor.</td></tr>';
            });
    }

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

    cargarUsuarios();

    // Cerrar sesion
    document.getElementById('btn-logout-admin').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "../index.html";
    })
})