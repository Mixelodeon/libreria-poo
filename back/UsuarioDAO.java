package PO_Objetos.Libreria.back;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

// import com.mysql.cj.util.StringUtils;

public class UsuarioDAO {
    // Esta clase se usa
    // Este metodo recibe el objeto usuario recien creado sin id ni rol
    public boolean registrarUsuario(Usuario nuevoUsuario) {
        String sql = "INSERT INTO usuarios (nombre, apellidos, email, password) VALUE (?, ?, ?, ?)";

        try {
            // Pide conexion a la clase conexionBD
            Connection con = ConexionBD.getConexion();
            PreparedStatement pstmt = con.prepareStatement(sql);

            // Se sustituyen las interrogantes '?' por los datos reales del objeto usando
            // getters
            pstmt.setString(1, nuevoUsuario.getNombre());
            pstmt.setString(2, nuevoUsuario.getApellidos());
            pstmt.setString(3, nuevoUsuario.getEmail());
            pstmt.setString(4, nuevoUsuario.getPassword());

            // Ejecuta la consulta en la bd
            int filasAfectadas = pstmt.executeUpdate();
            // Si filasAfectadas es mayor que 0 es que inserto bien
            return filasAfectadas > 0;
        } catch (SQLException e) {
            System.out.println("Error al intentar registrar el usuario en BD:" + e.getMessage());
            return false;
        }
    }

    // Metodo de inicio de sesion
    public Usuario iniciarSesion(String email, String password) {
        String sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

        try {
            Connection con = ConexionBD.getConexion();
            PreparedStatement pstmt = con.prepareStatement(sql);
            pstmt.setString(1, email);
            pstmt.setString(2, password);
            // Ejecuta la consulta con executeQuery, ya que esperamos recibir datos, no
            // enviar ni insertarlos
            java.sql.ResultSet rs = pstmt.executeQuery();
            // Si rs.next() es true, es que ha encontrado al menos una fila que coincida
            if (rs.next()) {
                // Hacemos uso del constructor completo para resucitar al usuario
                return new Usuario(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("apellidos"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getInt("rol"));
            }
        } catch (SQLException e) {
            System.out.println("Error al intentar iniciar sesión: " + e.getMessage());
        }

        // Si no lo encuentra o hay un error, devuelve un null
        return null;
    }

    // Metodo para obtener todos los usuarios registrados en la bd
    public java.util.List<Usuario> ObtenerTodosLosUsuarios() {
        java.util.List<Usuario> listaUsuarios = new java.util.ArrayList<>();
        String sql = "SELECT id, nombre, apellidos, email, rol FROM usuarios";

        try {
            Connection con = ConexionBD.getConexion();
            PreparedStatement pstmt = con.prepareStatement(sql);
            java.sql.ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                Usuario user = new Usuario();
                user.setId(rs.getInt("id"));
                user.setNombre(rs.getString("nombre"));
                user.setApellidos(rs.getString("apellidos"));
                user.setEmail(rs.getString("email"));
                user.setRol(rs.getInt("rol"));
                listaUsuarios.add(user);
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener la lista de usuarios: " + e.getMessage());
        }
        return listaUsuarios;
    }

    // Metodo para edtiar datos de usuario desde el panel del admin
    public boolean actualizarUsuario(Usuario usuarioEditado) {
        String sql = "UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, rol = ? WHERE id = ?";

        try {
            Connection con = ConexionBD.getConexion();
            PreparedStatement pstmt = con.prepareStatement(sql);

            pstmt.setString(1, usuarioEditado.getNombre());
            pstmt.setString(2, usuarioEditado.getApellidos());
            pstmt.setString(3, usuarioEditado.getEmail());
            pstmt.setInt(4, usuarioEditado.getRol());
            // El ID va al final para el WHERE, no se edita
            pstmt.setInt(5, usuarioEditado.getID());

            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException e) {
            System.out.println("Error al intentar actualizar el usuario: " + e.getMessage());
            return false;
        }
    }

    // Metodo para que el admin elimine usuarios.
    public boolean eliminarUsuario(int id) {
        String sql = "DELETE FROM usuarios WHERE id  = ?";

        try {
            Connection con = ConexionBD.getConexion();
            PreparedStatement pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, id);
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException e) {
            System.out.println("Error al intentar eliminar el usuario: " + e.getMessage());
            return false;
        }
    }
}