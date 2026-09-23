package PO_Objetos.Libreria.back;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CategoriaDAO {
    public CategoriaDAO() {

    }

    public List<Categoria> obtenerTodasCategorias() {
        List<Categoria> listaCategorias = new ArrayList<>();
        String sql = "SELECT * FROM categorias";

        try (Connection conn = ConexionBD.getConexion();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                Categoria categoria = new Categoria();
                categoria.setId(rs.getInt("id"));
                categoria.setNombre(rs.getString("nombre"));
                listaCategorias.add(categoria);
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener las categorías: " + e.getMessage());
        }
        return listaCategorias;
    }
}
