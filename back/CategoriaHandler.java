package PO_Objetos.Libreria.back;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class CategoriaHandler implements HttpHandler {
    private CategoriaDAO categoriaDAO = new CategoriaDAO();
    private Gson gson = new Gson();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        // Respuesta rapida para la peticion de pre-vuelo de CORS
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Logica para procesar la peticon
        if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            try {
                // Categorias de la bd
                List<Categoria> categorias = categoriaDAO.obtenerTodasCategorias();
                // Convertimos la lista de Java a un String JSON
                String jsonResponse = gson.toJson(categorias);
                // Prepara y envia la respuesta al frontend
                exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
                byte[] bytes = jsonResponse.getBytes("UTF-8");
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } catch (Exception e) {
                e.printStackTrace();
                exchange.sendResponseHeaders(500, -1);
            }
        } else {
            // Si intentan hacer POST o DELETE a esta ruta, devolvemos error 405 (Método no
            // permitido)
            exchange.sendResponseHeaders(405, -1);
        }
    }
}
