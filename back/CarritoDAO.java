package PO_Objetos.Libreria.back;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class CarritoDAO {
    public boolean agregarAlCarrito(int idUsuario, int idLibro) {
        String sqlCheck = "SELECT cantidad FROM carrito WHERE id_usuario = ? AND id_libro = ?";
        String sqlUpdate = "UPDATE carrito SET cantidad = cantidad + 1 WHERE id_usuario = ? AND id_libro = ?";
        String sqlInsert = "INSERT INTO carrito (id_usuario, id_libro, cantidad) VALUES (?, ?, 1)";
        try (Connection conn = ConexionBD.getConexion()) {
            // Busca si ya existe el registro
            try (PreparedStatement pstmtCheck = conn.prepareStatement(sqlCheck)) {
                pstmtCheck.setInt(1, idUsuario);
                pstmtCheck.setInt(2, idLibro);

                try (ResultSet rs = pstmtCheck.executeQuery()) {
                    if (rs.next()) {
                        // Ya esta en el carrito, lanza la consulta UPDATE SQL
                        try (PreparedStatement pstmtUpdate = conn.prepareStatement(sqlUpdate)) {
                            pstmtUpdate.setInt(1, idUsuario);
                            pstmtUpdate.setInt(2, idLibro);
                            return pstmtUpdate.executeUpdate() > 0;
                        }
                    } else {
                        // La primera vez que se añade al carrito, se lanza el insert
                        try (PreparedStatement pstmtInsert = conn.prepareStatement(sqlInsert)) {
                            pstmtInsert.setInt(1, idUsuario);
                            pstmtInsert.setInt(2, idLibro);
                            return pstmtInsert.executeUpdate() > 0;
                        }
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Error en la Base de Datos al modificar carrito: " + e.getMessage());
            return false;
        }
    }

    public java.util.List<ItemCarrito> obtenerCarrito(int idUsuario) {
        java.util.List<ItemCarrito> lista = new java.util.ArrayList<>();
        String sql = "SELECT c.id AS id_carrito, c.id_libro, c.cantidad, " +
                "l.titulo, l.precio, l.portada_url " +
                "FROM carrito c " +
                "INNER JOIN libros l ON c.id_libro = l.id " +
                "WHERE c.id_usuario = ?";

        try (java.sql.Connection conn = ConexionBD.getConexion();
                java.sql.PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, idUsuario);
            try (java.sql.ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    ItemCarrito item = new ItemCarrito();
                    item.setId(rs.getInt("id_carrito"));
                    item.setIdLibro(rs.getInt("id_libro"));
                    item.setCantidad(rs.getInt("cantidad"));
                    item.setIdUsuario(idUsuario);
                    item.setTitulo(rs.getString("titulo"));
                    item.setPrecio(rs.getDouble("precio"));
                    item.setPortadaUrl(rs.getString("portada_url"));
                    lista.add(item);
                }
            }
        } catch (java.sql.SQLException e) {
            System.out.println("Error al obtener carrito: " + e.getMessage());
        }
        return lista;
    }

    // Borrar libro del carrito
    public boolean eliminarItemCarrito(int idCarrito) {
        String sql = "DELETE FROM carrito WHERE id = ?";
        try (java.sql.Connection conn = ConexionBD.getConexion();
                java.sql.PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, idCarrito);
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (java.sql.SQLException e) {
            System.out.println("Error al borrar el carrito: " + e.getMessage());
            return false;
        }
    }
}
