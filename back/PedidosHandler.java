package PO_Objetos.Libreria.back;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import com.google.gson.Gson;

public class PedidosHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        // Maneja la peticion pre-flight de CORS options
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        // Maneja la peticion GET
        if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            try {
                CarritoDAO carritoDAO = new CarritoDAO();
                List<PedidoAdminDTO> pedidos = carritoDAO.obtenerPedidosClientes();
                // Convierte la lista de pedidos en JSON
                Gson gson = new Gson();
                String jsonResponse = gson.toJson(pedidos);
                // Prepara la respuesta HTTP (Cabecera y codigo 200 ok)
                byte[] bytes = jsonResponse.getBytes("UTF-8");
                exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
                exchange.sendResponseHeaders(200, bytes.length);
                // Envia el JSON al frontend
                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            } catch (Exception e) {
                e.printStackTrace();
                // En caso de fallo en Java/MySQL, devolvemos un error 500
                String errorResponse = "{\"error\": \"Error interno al obtener los pedidos.\"}";
                exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
                exchange.sendResponseHeaders(500, errorResponse.getBytes("UTF-8").length);

                OutputStream os = exchange.getResponseBody();
                os.write(errorResponse.getBytes("UTF-8"));
                os.close();
            }
        } else {
            // Si intentan hacer un POST, PUT, etc., devolvemos "Method Not Allowed" (405)
            exchange.sendResponseHeaders(405, -1);
        }
    }
}
