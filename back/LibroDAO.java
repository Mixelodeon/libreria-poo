package PO_Objetos.Libreria.back;

import java.sql.Statement;
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

    // Metodo para guardar un libro en la BD y enlazar sus categorias
    public boolean insertarLibro(Libro libro) {
        String sqlLibro = "INSERT INTO libros (titulo, autor, precio, editorial, numPaginas, portada_url, destacado) VALUES (?, ?, ?, ?, ?, ?, ?)";
        String sqlCategoria = "INSERT INTO libros_categorias (libro_id, categoria_id) VALUES (?, ?)";

        Connection conn = null;
        try {
            conn = ConexionBD.getConexion();

            // Inicia la transiccion, desactiva el autoguardado de MySQL
            conn.setAutoCommit(false);

            // Inserta el libro pidiendo a MySQL que devuelva el ID generado
            try (PreparedStatement pstmtLibro = conn.prepareStatement(sqlLibro, Statement.RETURN_GENERATED_KEYS)) {
                pstmtLibro.setString(1, libro.getTitulo());
                pstmtLibro.setString(2, libro.getAutor());
                pstmtLibro.setDouble(3, libro.getPrecio());
                pstmtLibro.setString(4, libro.getEditorial());
                pstmtLibro.setInt(5, libro.getNumPaginas());
                pstmtLibro.setString(6, libro.getPortadaURL());
                pstmtLibro.setBoolean(7, libro.isDestacado());

                int filasAfectadas = pstmtLibro.executeUpdate();

                if (filasAfectadas > 0) {
                    // Captura el nuevo ID que MySQL le da al libhro
                    try (ResultSet rs = pstmtLibro.getGeneratedKeys()) {
                        if (rs.next()) {
                            int nuevoLibroId = rs.getInt(1);

                            // Bucle para insertar todas las categorías asociadas en la tabla puente
                            if (libro.getCategoriasIds() != null && !libro.getCategoriasIds().isEmpty()) {
                                try (PreparedStatement pstmtCat = conn.prepareStatement(sqlCategoria)) {
                                    for (Integer categoriaId : libro.getCategoriasIds()) {
                                        pstmtCat.setInt(1, nuevoLibroId); // El ID del libro nuevo
                                        pstmtCat.setInt(2, categoriaId); // El ID de la categoría del for
                                        pstmtCat.executeUpdate();
                                    }
                                }
                            }
                        }
                    }
                    // Si todo va bien se confirma los datos de golpe
                    conn.commit();
                    return true;
                }
            }
        } catch (SQLException e) {
            System.out.println("Error al insertar el libro en la BD: " + e.getMessage());
            try {
                // 6. Si algo falló a medias, deshacemos todos los cambios
                if (conn != null) {
                    conn.rollback();
                    System.out.println("Se ha hecho ROLLBACK de la transacción.");
                }
            } catch (SQLException ex) {
                System.out.println("Error al deshacer la transacción: " + ex.getMessage());
            }
        } finally {
            // 7. Limpiamos y cerramos la conexión de forma segura
            try {
                if (conn != null) {
                    conn.setAutoCommit(true); // Restauramos el comportamiento normal
                    conn.close();
                }
            } catch (SQLException e) {
                System.out.println("Error al cerrar conexión: " + e.getMessage());
            }
        }
        return false;
    }

    // Metodo que obtiene todos los libros de la bd y los mete en un array
    public List<Libro> obtenerTodosLosLibros() {
        List<Libro> listaLibros = new ArrayList<>();

        // Consulta con JOIN y GROUP_CONCAT para agrupar categorias
        String sql = "SELECT l.*, " +
                "GROUP_CONCAT(c.id) AS ids_categorias, " +
                "GROUP_CONCAT(c.nombre SEPARATOR ', ') AS nombres_categorias " +
                "FROM libros l " +
                "LEFT JOIN libros_categorias lc ON l.id = lc.libro_id " +
                "LEFT JOIN categorias c ON lc.categoria_id = c.id " +
                "GROUP BY l.id";

        try (Connection conn = ConexionBD.getConexion();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet resultados = pstmt.executeQuery()) {

            // Mientras haya filas en el resultado de la bd
            while (resultados.next()) {
                // Se hace uso del cosntructor vacio, para ir metiendo datos de la bd en
                // el objeto
                Libro libro = new Libro();

                // Rellenamos el objeto leyendo las columnas exactas de MySQL
                libro.setId(resultados.getInt("id"));
                libro.setTitulo(resultados.getString("titulo"));
                libro.setAutor(resultados.getString("autor"));
                libro.setPrecio(resultados.getDouble("precio"));
                libro.setEditorial(resultados.getString("editorial"));
                libro.setNumPaginas(resultados.getInt("numPaginas"));
                libro.setPortadaURL(resultados.getString("portada_url"));
                libro.setDestacado(resultados.getBoolean("destacado"));

                String idsString = resultados.getString("ids_categorias");
                String nombresString = resultados.getString("nombres_categorias");

                List<Integer> idsLista = new ArrayList<>();
                List<String> nombresLista = new ArrayList<>();

                // Si el libro tiene categorias (no viene null), corta el string y llena las
                // listas
                if (idsString != null && !idsString.isEmpty()) {
                    // Corta el texto "1,4" por las comas
                    String[] idsArray = idsString.split(",");
                    for (String idStr : idsArray) {
                        idsLista.add(Integer.parseInt(idStr.trim()));
                    }
                    // Corta el texto "Fantasia, Romance"
                    String[] nombreArray = nombresString.split(", ");
                    for (String nombre : nombreArray) {
                        nombresLista.add(nombre.trim());
                    }
                }
                // Introduce las listas terminadas en el objeto Libro
                libro.setCategoriasIds(idsLista);
                libro.setCategoriasNombres(nombresLista);
                listaLibros.add(libro);
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener el catálogo: " + e.getMessage());
        }
        // Devuelve la lista llena (o vacía si ha habido un error o no hay libros)
        return listaLibros;
    }

    // Metodo para obtener los libros destacados de la tienda
    public List<Libro> obtenerLibrosDestacados() {
        List<Libro> listaLibros = new ArrayList<>();

        String sql = "SELECT l.*, " +
                "GROUP_CONCAT(c.id) AS ids_categorias, " +
                "GROUP_CONCAT(c.nombre SEPARATOR ', ') AS nombres_categorias " +
                "FROM libros l " +
                "LEFT JOIN libros_categorias lc ON l.id = lc.libro_id " +
                "LEFT JOIN categorias c ON lc.categoria_id = c.id " +
                "WHERE l.destacado = true " +
                "GROUP BY l.id";

        try (Connection conn = ConexionBD.getConexion();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet resultados = pstmt.executeQuery()) {
            // Mientras haya filas en el resultado de la bd
            while (resultados.next()) {
                // Se hace uso del cosntructor vacio, para ir metiendo datos de la bd en el
                // objeto
                Libro libro = new Libro();

                // Rellenamos el objeto leyendo las columnas exactas de MySQL
                libro.setId(resultados.getInt("id"));
                libro.setTitulo(resultados.getString("titulo"));
                libro.setAutor(resultados.getString("autor"));
                libro.setPrecio(resultados.getDouble("precio"));
                libro.setEditorial(resultados.getString("editorial"));
                libro.setNumPaginas(resultados.getInt("numPaginas"));
                libro.setPortadaURL(resultados.getString("portada_url"));
                libro.setDestacado(resultados.getBoolean("destacado"));

                String idsString = resultados.getString("ids_categorias");
                String nombresString = resultados.getString("nombres_categorias");

                List<Integer> idsLista = new ArrayList<>();
                List<String> nombresLista = new ArrayList<>();

                // Si hay categorias se corta el String y llena la lista
                if (idsString != null && !idsString.isEmpty()) {
                    String[] idsArray = idsString.split(",");
                    for (String idStr : idsArray) {
                        idsLista.add(Integer.parseInt(idStr.trim()));
                    }
                    String[] nombresArray = nombresString.split(", ");
                    for (String nombre : nombresArray) {
                        nombresLista.add(nombre.trim());
                    }
                }

                // Introduce las listas terminadas en el objeto Libro
                libro.setCategoriasIds(idsLista);
                libro.setCategoriasNombres(nombresLista);
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
