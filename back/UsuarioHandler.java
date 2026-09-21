package PO_Objetos.Libreria.back;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class UsuarioHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        // Peticion de control de seguridad
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(200, -1);
            exchange.close();
            return;
        }

        // Obtener la lista de los usuarios para la tabla del panel
        if (exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            try {
                UsuarioDAO dao = new UsuarioDAO();
                List<Usuario> listaUsuarios = dao.ObtenerTodosLosUsuarios();
                Gson gson = new Gson();
                String jsonRespuesta = gson.toJson(listaUsuarios);

                exchange.sendResponseHeaders(200, jsonRespuesta.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = exchange.getResponseBody();
                os.write(jsonRespuesta.getBytes(StandardCharsets.UTF_8));
                os.close();
            } catch (Throwable e) {
                System.out.println("Error crítico en UsuarioHandler GET: " + e.getMessage());
                e.printStackTrace();
                try {
                    exchange.sendResponseHeaders(500, -1);
                    exchange.close();
                } catch (Exception ex) {
                }
            }
        } else if (exchange.getRequestMethod().equalsIgnoreCase("PUT")) {
            try {
                // Lee el JSON
                java.io.InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                // JSON a objeto Java
                Gson gson = new Gson();
                Usuario usuarioEditado = gson.fromJson(body, Usuario.class);
                // Llamada a DAO para actualizar
                UsuarioDAO dao = new UsuarioDAO();
                boolean exito = dao.actualizarUsuario(usuarioEditado);
                if (exito) {
                    String respuesta = "{\"mensaje\": \"Usuario actualizado correctamente\"}";
                    exchange.sendResponseHeaders(200, respuesta.getBytes(StandardCharsets.UTF_8).length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                    os.close();
                } else {
                    // 500 = Error interno del servidor
                    exchange.sendResponseHeaders(500, -1);
                    exchange.close();
                }
            } catch (Exception e) {
                System.out.println("Error en UsuarioHandler PUT: " + e.getMessage());
                e.printStackTrace();
                exchange.sendResponseHeaders(400, -1);
                exchange.close();
            }
        } else if (exchange.getRequestMethod().equalsIgnoreCase("DELETE")) {
            try {
                // Captura el parametro de la URL
                String query = exchange.getRequestURI().getQuery();
                if (query != null && query.startsWith("id=")) {
                    // Extrael el numero cortando el string por "="
                    int idAEliminar = Integer.parseInt(query.split("=")[1]);

                    UsuarioDAO dao = new UsuarioDAO();
                    boolean exito = dao.eliminarUsuario(idAEliminar);

                    if (exito) {
                        String respuesta = "{\"mensaje\": \"Usuario eliminado\"}";
                        exchange.sendResponseHeaders(200, respuesta.getBytes(StandardCharsets.UTF_8).length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                        os.close();
                    } else {
                        // Si no lo encuentra, devolvemos un 404 (Not Found)
                        exchange.sendResponseHeaders(404, -1);
                        exchange.close();
                    }
                } else {
                    // Si mandan mal la URL, devolvemos un 400 (Bad Request)
                    exchange.sendResponseHeaders(400, -1);
                    exchange.close();
                }

            } catch (Exception e) {
                System.out.println("Error en UsuarioHandler DELETE: " + e.getMessage());
                exchange.sendResponseHeaders(500, -1);
                exchange.close();
            }
        } else {
            // Método no permitido para cualquier otra petición
            exchange.sendResponseHeaders(405, -1);
            exchange.close();
        }
    }
}
