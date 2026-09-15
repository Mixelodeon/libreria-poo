package PO_Objetos.Libreria.back;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class LibroDAO {
    // Constructor vscio
    public LibroDAO() {

    }

    // Metodo para guardar un libro en la BD
    public boolean insertarLibro(Libro libro) {
        String sql = "INSERT INTO libros (titulo, autor, precio, categoria, editorial, numPaginas, portada_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
        // Cierra la conexion al terminar
        try (Connection conn = ConexionBD.getConexion();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            // Rellena las interrogancias de la consulta insert SQL
            pstmt.setString(1, libro.getTitulo());
            pstmt.setString(2, libro.getAutor());
            pstmt.setDouble(3, libro.getPrecio());
            pstmt.setString(4, libro.getCategoria());
            pstmt.setString(5, libro.getEditorial());
            pstmt.setInt(6, libro.getNumPaginas());
            pstmt.setString(7, libro.getPortadaURL());
            // Ejecuta la sql
            int filasAfectadas = pstmt.executeUpdate();
            // Devuelve true si la consulta se ejecuta con exito
            return filasAfectadas > 0;
        } catch (SQLException e) {
            System.out.println("Error al insertar el libro en la BD: " + e.getMessage());
            return false;
        }
    }
}
