document.addEventListener('DOMContentLoaded', () => {
    window.Alertas = {
        // Alerta que desaparece sola, succes
        exito: function (titulo, texto) {
            return Swal.fire({
                icon: 'success',
                title: titulo,
                text: texto,
                showConfirmButton: false,
                timer: 2000
            })
        },

        // Alerta para fallos, error
        error: function (titulo, texto) {
            return Swal.fire({
                icon: 'error',
                title: titulo,
                text: texto,
                confirmButtonColor: '#e74c3c'
            })
        },

        // Alerta para validaciones, warning
        warning: function (titulo, texto) {
            return Swal.fire({
                icon: 'warning',
                title: titulo,
                text: texto,
                confirmButtonColor: '#ccda11ff'
            });
        },

        // Alerta de decisión 
        // Devuelve una Promesa para poder usar .then() después
        decision: function (titulo, texto, textoBoton = 'Sí, continuar') {
            return Swal.fire({
                title: titulo,
                text: texto,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7f8c8d',
                cancelButtonColor: '#e74c3c',
                confirmButtonText: textoBoton,
                cancelButtonText: 'Cancelar'
            });
        }
    }
})