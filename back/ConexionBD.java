package PO_Objetos.Libreria.back;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionBD {

    // Tus credenciales de Docker (las que pusimos en el docker-compose)
    private static final String URL = "jdbc:mysql://localhost:3306/libreria_poo";
    private static final String USER = "root";
    private static final String PASSWORD = "root"; // La contraseña sencilla que configuraste

    // La conexión en sí misma
    private static Connection conexion = null;

    // Método estático para obtener la conexión
    public static Connection getConexion() {
        try {
            // Comprobamos también si está cerrada (.isClosed()).
            // Solucion de problemas con el f5 y libros
            if (conexion == null || conexion.isClosed()) {
                // Carga el driver de MYSQL
                Class.forName("com.mysql.cj.jdbc.Driver");
                conexion = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("¡Conexión exitosa a la base de datos libreria_poo en Docker!");
            }

            // // Paso 1: "Cargar" el driver de MySQL (el traductor)
            // Class.forName("com.mysql.cj.jdbc.Driver");

            // // Paso 2: Intentar abrir la puerta
            // conexion = DriverManager.getConnection(URL, USER, PASSWORD);
            // System.out.println("¡Conexión exitosa a la base de datos libreria_poo en
            // Docker!");

        } catch (ClassNotFoundException e) {
            System.out.println("Error: No se ha encontrado el driver de MySQL (¿Falta el .jar?)");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("Error: No se pudo conectar a la base de datos.");
            e.printStackTrace();
        }
        return conexion;
    }

    // Método para cerrar la conexión cuando terminemos
    public static void cerrarConexion() {
        if (conexion != null) {
            try {
                conexion.close();

                conexion = null;
                System.out.println("Conexión cerrada.");
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}