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
        } else {
            // Método no permitido
            exchange.sendResponseHeaders(405, -1);
            exchange.close();
        }
    }
}
