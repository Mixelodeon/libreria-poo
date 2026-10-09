document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    const submitButton = document.getElementById('submitButton');
    // Comprueba que el formulario existe antes de añadirle el evento
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const passwordVerification = document.getElementById('passwordVerification').value.trim();
            // Campos vacios
            if (!nombre || !apellidos || !email || !password || !passwordVerification) {
                Alertas.warning('¡Campos vacíos!', 'Asegurese de no dejar ningun campo incompleto')
                return;
            }
            // Validacion que el nombre no sean menos de 3 letras
            if (nombre.length < 3 || apellidos.length < 3) {
                Alertas.warning('¡Campo incompleto!', 'El nombre y los apellidos deben contener al menos 3 caracteres.')
                return;
            }
            // Validar que el nombre y apellido solo contenga letras
            // Expresion regular
            const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if (!soloLetras.test(nombre) || !soloLetras.test(apellidos)) {
                Alertas.warning('¡Datos inválidos!', 'El nombre y los apellidos solo pueden contener letras y espacios.')
                return;
            }
            // Validacion para una direccion de correo electronico real
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                Alertas.warning('¡Email inválido!', 'Por favor, introduzca una dirección de correo electrónico válida (ejemplo: usuario@correo.com).')
                return;
            }
            // Contraseña con al menos 8 caracteres
            if (password.length < 8) {
                Alertas.warning('¡Contraseña inválida!', 'La contraseña debe contener al menos 8 caracteres')
                return;
            }
            // Validacion de contraseñas, que coincidan
            if (password !== passwordVerification) {
                Alertas.warning('¡Error!', '¡Las contraseñas no coinciden!')
                return;
            }

            // Creamos el objeto
            const paqueteUsuario = {
                nombre: nombre,
                apellidos: apellidos,
                email: email,
                password: password
            };

            // 3. Imprimimos el paquete entero para ver si tiene buena pinta
            console.log("Paquete listo para enviar a Java: ", paqueteUsuario);

            // Envio del objeto usuario a java mediante fetch
            fetch('http://localhost:8081/api/registro', {
                method: 'POST',
                headers: {
                    // Enviamos en formato JSON
                    'Content-Type': 'application/json'
                },
                // Convertimos el objeto a texto
                body: JSON.stringify(paqueteUsuario)
            })
                .then(respuesta => {
                    if (respuesta.ok) {
                        Alertas.exito('¡Cuenta creada!', 'Su cuenta a sido creada exitosamente.')
                            .then(() => {
                                // Redirige al cliente al login
                                window.location.href = './login.html';
                            })
                    } else {
                        Alertas.error('¡Error!', '¡Hubo un problema al crear su cuenta! El email podría estar ya en uso.');
                    }
                })
                .catch(error => {
                    console.error("Error intentando conectar con Java", error)
                    Alertas.error('¡Error de conexión!', '¡El servidor está apagado o no responde!');
                })
        })

    }
});