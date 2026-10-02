package PO_Objetos.Libreria.back;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class DeseoHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

        if (exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            try {
                String query = exchange.getRequestURI().getQuery();
                if (query != null && query.contains("usuario=")) {
                    int idUsuario = Integer.parseInt(query.split("usuario=")[1]);

                    DeseoDAO dao = new DeseoDAO();
                    java.util.List<ItemDeseo> deseos = dao.obtenerDeseos(idUsuario);

                    Gson gson = new Gson();
                    String jsonRespuesta = gson.toJson(deseos);

                    // Calcula los bytes para evitar el error de JSON cortado
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
        } else if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            try {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                Gson gson = new Gson();
                ItemDeseo peticion = gson.fromJson(body, ItemDeseo.class);

                DeseoDAO dao = new DeseoDAO();
                boolean exito = dao.agregarADeseos(peticion.getIdUsuario(), peticion.GetIdLibro());

                if (exito) {
                    String respuesta = "{\"mensaje\": \"Añadido a tu lista de deseos\"}";
                    exchange.sendResponseHeaders(200, respuesta.getBytes(StandardCharsets.UTF_8).length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                    os.close();
                } else {
                    // Si falla (probablemente porque ya estaba en la lista gracias al UNIQUE)
                    String respuesta = "{\"error\": \"El libro ya está en tu lista\"}";
                    exchange.sendResponseHeaders(409, respuesta.getBytes(StandardCharsets.UTF_8).length); // 409
                                                                                                          // Conflict
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                    os.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
                exchange.sendResponseHeaders(400, -1);
            }
        } else if (exchange.getRequestMethod().equalsIgnoreCase("DELETE")) {
            try {
                String query = exchange.getRequestURI().getQuery();
                if (query != null && query.contains("id=")) {
                    int idDeseo = Integer.parseInt(query.split("id=")[1]);

                    DeseoDAO dao = new DeseoDAO();
                    boolean exito = dao.eliminarDeseo(idDeseo);

                    if (exito) {
                        String respuesta = "{\"mensaje\": \"Eliminado de deseos\"}";
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
        } else {
            exchange.sendResponseHeaders(405, -1);
        }
    }
}
