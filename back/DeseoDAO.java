package PO_Objetos.Libreria.back;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DeseoDAO {
    // Metodo para añadir a la lista de Deseo
    public boolean agregarADeseos(int idUsuario, int idLibro) {
        String sql = "INSERT INTO lista_deseos (id_usuario, id_libro) VALUES (?, ?)";

        try (Connection conn = ConexionBD.getConexion();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, idUsuario);
            pstmt.setInt(2, idLibro);

            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException e) {
            // Si salta la excepción por el UNIQUE KEY (libro ya en deseos), entrará aquí
            System.out.println("No se pudo añadir (quizá ya estaba en la lista): " + e.getMessage());
            return false;
        }
    }

    // Metodo para leer la lista de deseos
    public List<ItemDeseo> obtenerDeseos(int idUsuario) {
        List<ItemDeseo> lista = new ArrayList<>();

        String sql = "SELECT d.id AS id_deseo, d.id_libro, l.titulo, l.precio, l.portada_url " +
                "FROM lista_deseos d " +
                "INNER JOIN libros l ON d.id_libro = l.id " +
                "WHERE d.id_usuario = ?";
        try (Connection conn = ConexionBD.getConexion();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idUsuario);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    ItemDeseo item = new ItemDeseo();
                    item.setId(rs.getInt("id_deseo"));
                    item.setIdLibro(rs.getInt("id_libro"));
                    item.setIdUsuario(idUsuario);
                    item.setTitulo(rs.getString("titulo"));
                    item.setPrecio(rs.getDouble("precio"));
                    item.setPortadaUrl(rs.getString("portada_url"));

                    lista.add(item);
                }
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener lista de deseos: " + e.getMessage());
        }
        return lista;
    }

    // Metodo para eliminar un libro de la lista de deseo
    public boolean eliminarDeseo(int idDeseo) {
        String sql = "DELETE FROM lista_deseos WHERE id = ?";

        try (Connection conn = ConexionBD.getConexion();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idDeseo);
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;

        } catch (SQLException e) {
            System.out.println("Error al borrar el deseo: " + e.getMessage());
            return false;
        }
    }

}
