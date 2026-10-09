package PO_Objetos.Libreria.back;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class CarritoHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Permisos CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Logica para añadir al carrito (POST)
        if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            try {
                // Leer JSON que manda JS
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                // Convierte el JSON al Objeto Java ItemCarrito
                Gson gson = new Gson();
                ItemCarrito peticion = gson.fromJson(body, ItemCarrito.class);
                // Llama al DAO para lanzar consultas y guardar en la bd
                CarritoDAO dao = new CarritoDAO();
                boolean exito = dao.agregarAlCarrito(peticion.getIdUsuario(), peticion.getIdLibro());
                if (exito) {
                    String respuesta = "{\"mensaje\": \"Libro añadido al carrito correctamente\"}";
                    exchange.sendResponseHeaders(200, respuesta.getBytes(StandardCharsets.UTF_8).length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                    os.close();
                } else {
                    // Si falla la SQL
                    exchange.sendResponseHeaders(500, -1);
                }
            } catch (Exception e) {
                e.printStackTrace();
                // Error leyendo los datos
                exchange.sendResponseHeaders(400, -1);
            }
        } else if (exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            try {
                // Saca el ID del usuario de la URL
                String query = exchange.getRequestURI().getQuery();
                if (query != null && query.contains("usuario=")) {
                    int idUsuario = Integer.parseInt(query.split("usuario=")[1]);
                    CarritoDAO dao = new CarritoDAO();
                    java.util.List<ItemCarrito> carrito = dao.obtenerCarrito(idUsuario);
                    Gson gson = new Gson();
                    String jsonRespuesta = gson.toJson(carrito);
                    exchange.sendResponseHeaders(200, jsonRespuesta.getBytes(StandardCharsets.UTF_8).length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonRespuesta.getBytes(StandardCharsets.UTF_8));
                    os.close();
                } else {
                    exchange.sendResponseHeaders(400, -1);
                }
            } catch (Exception e) {
                e.printStackTrace();
                exchange.sendResponseHeaders(500, -1);
            }
        } else if (exchange.getRequestMethod().equalsIgnoreCase("DELETE")) {
            try {
                String query = exchange.getRequestURI().getQuery();
                if (query != null && query.contains("id=")) {
                    int idCarrito = Integer.parseInt(query.split("id=")[1]);

                    CarritoDAO dao = new CarritoDAO();
                    boolean exito = dao.eliminarItemCarrito(idCarrito);

                    if (exito) {
                        String respuesta = "{\"mensaje\": \"Eliminado correctamente\"}";
                        exchange.sendResponseHeaders(200, respuesta.getBytes(StandardCharsets.UTF_8).length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                        os.close();
                    } else {
                        exchange.sendResponseHeaders(404, -1);
                    }
                } else {
                    exchange.sendResponseHeaders(400, -1);
                }
            } catch (Exception e) {
                e.printStackTrace();
                exchange.sendResponseHeaders(500, -1);
            }
        } else if ("PUT".equalsIgnoreCase(exchange.getRequestMethod())) {
            try {
                InputStream is = exchange.getRequestBody();
                String cuerpo = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                // Extraer los datos del JSON
                JsonObject json = JsonParser.parseString(cuerpo).getAsJsonObject();

                int idCarrito = json.get("id").getAsInt();
                int nuevaCantidad = json.get("cantidad").getAsInt();

                CarritoDAO carritoDAO = new CarritoDAO();
                boolean exito = carritoDAO.actualizarCantidad(idCarrito, nuevaCantidad);

                if (exito) {
                    String respuesta = "{\"mensaje\": \"Cantidad actualizada con éxito\"}";
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, respuesta.getBytes(StandardCharsets.UTF_8).length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                    os.close();
                } else {
                    exchange.sendResponseHeaders(500, -1);
                }
            } catch (Exception e) {
                e.printStackTrace();
                exchange.sendResponseHeaders(400, -1);
            }
        } else {
            exchange.sendResponseHeaders(405, -1);
        }
    }
}
