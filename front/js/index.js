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
})