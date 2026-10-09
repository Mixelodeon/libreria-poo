document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const credenciales = {
            email: email,
            password: password
        }

        // console.log("Intentado iniciar sesion con: ", credenciales);

        // Envio de datos
        fetch('http://localhost:8081/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciales)
        })
            .then(async (respuesta) => {
                if (respuesta.ok) {
                    const datosJava = await respuesta.json()
                    localStorage.setItem('usuarioNombre', datosJava.nombre);
                    localStorage.setItem('usuarioEmail', datosJava.email);
                    localStorage.setItem('usuarioRol', datosJava.rol);
                    localStorage.setItem('usuarioId', datosJava.id);
                    Alertas.exito('¡Bienvenido!', `Hola ${datosJava.nombre}, has iniciado sesión.`)
                        .then(() => {
                            if (datosJava.rol == 1) {
                                window.location.href = "../index.html";
                            } else {
                                window.location.href = "../html/admin.html";
                            }
                        })
                } else {
                    Alertas.warning('¡Error de credenciales!', 'El correo y/o la contraseña no son correctos.')
                    // Vacia solo la contraseña
                    document.getElementById('password').value = '';
                }
            })
            .catch(error => {
                console.error("Error intentando conectar con Java: ", error);
                Alertas.error('¡Error de conexión!', '¡El servidor está apagado o no responde!');
            })

    })
})