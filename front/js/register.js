document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', () => {
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordVerification = document.getElementById('passwordVerification').value;

        // Validacion de contraseñas, que coincidan
        if (password !== passwordVerification) {
            alert("¡Las contraseñas no coinciden!")
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
                    alert("¡Cuenta creada con exito!")
                    // FALTA REDIRIGIR AL LOGIN
                } else {
                    alert("¡Hubo un problema al crear su cuenta!")
                }
            })
            .catch(error => {
                console.error("Error intentando conectar con Java", error)
                alert("¡El servidor esta apagado o no responde!")
            })
    })

});