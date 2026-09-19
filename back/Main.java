package PO_Objetos.Libreria.back;

// Importa la herramiente la cual permite mantener comunicación abierta con MySQL
// import java.sql.Connection;

// Clase para probar el funcionamiento de la conexión con la base de datos funciona
public class Main {
    // Metodo para arrancar la prueba de conexion con la base de datos
    // public static void main(String[] args) {
    // System.out.println("Iniciando prueba de conexión...");

    // // Llamamos a la clase y a su metodo para obtener la conexion
    // Connection con = ConexionBD.getConexion();

    // // Si la conexión no es nula, es que hemos entrado a la base de datos
    // if (con != null) {
    // System.out.println("¡Prueba superada! El driver funciona y Docker
    // responde.");

    // // Cerramos la conexion antes de finalizar la prueba
    // ConexionBD.cerrarConexion();
    // } else {
    // System.out.println("Algo ha fallado. Revisa los mensajes de error de
    // arriba.");
    // }
    // }

    public static void main(String[] args) {
        System.out.println("Iniciando prueba del DAO...");

        // Simulamos una prueba de crear un usuario
        // Usuario usuarioPrueba = new Usuario("Asier", "Ruiz Moreno",
        // "asier@ejemplo.com", "miPasswordSegura");
        // UsuarioDAO dao = new UsuarioDAO();
        // Se le pasa el objeto para que lo guarde en MySQL
        // boolean exito = dao.registrarUsuario(usuarioPrueba);
        // Comprobacion del funcionamiento
        // if (exito) {
        // System.out.println("¡ÉXITO! El usuario se ha guardado correctamente en
        // Docker.");
        // System.out.println("Ve a phpMyAdmin y comprueba la tabla 'usuarios'.");
        // } else {
        // System.out.println("Ha fallado la inserción en la base de datos.");
        // }

        // Simulamos la inserccion de un libro en la bd, mediante el uso de la clase
        // LibroDAO
        // LibroDAO dao = new LibroDAO();
        // Llamamamos al constructor del libro sin el ID
        // Libro libroPrueba = new Libro("Alas de ónix", "Rebecca Yarros", 23.90,
        // "Fantasía", "Planeta", 896,
        // "onix_portada.jpg");
        // boolean exito = dao.insertarLibro(libroPrueba);
        // if (exito) {
        // System.out.println("Libro guardado correctamente en la BD");
        // } else {
        // System.out.println("Hubo un fallo al guardar el libro");
        // }

    }
}