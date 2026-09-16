package PO_Objetos.Libreria.back;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

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

    // Metodo que obtiene todos los libros de la bd y los mete en un array
    public List<Libro> obtenerTodosLosLibros() {
        List<Libro> listaLibros = new ArrayList<>();
        String sql = "Select * FROM libros";

        try (Connection conn = ConexionBD.getConexion();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet resultados = pstmt.executeQuery()) {
            // Mientras haya filas en el resultado de la bd
            while (resultados.next()) {
                // Se hace uso del cosntructor vacio, para ir metiendo datos de la bd en el
                // objeto
                Libro libro = new Libro();

                // Rellenamos el objeto leyendo las columnas exactas de MySQL
                libro.setTitulo(resultados.getString("titulo"));
                libro.setAutor(resultados.getString("autor"));
                libro.setPrecio(resultados.getDouble("precio"));
                libro.setCategoria(resultados.getString("categoria"));
                libro.setEditorial(resultados.getString("editorial"));
                libro.setNumPaginas(resultados.getInt("numPaginas"));
                libro.setPortadaURL(resultados.getString("portada_url"));

                // Metemos el libro terminado en nuestra lista
                listaLibros.add(libro);
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener el catálogo: " + e.getMessage());
        }
        // Devuelve la lista llena (o vacía si ha habido un error o no hay libros)
        return listaLibros;
    }
}
