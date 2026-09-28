package PO_Objetos.Libreria.back;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class LibroHandler implements HttpHandler {
    // Procesa las peticiones de insertar libnros en la bd
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Comprobar siempre que no de error por el PROCESO FANTASMA, que el navegador
        // no habla con una versión antigua.
        // Si este siso entra en consola, es que el proceso fantasma a muerto
        System.out.println(">>> [LibroHandler] Ha entrado una petición: " + exchange.getRequestMethod());

        // Permisos CORS, necesario para que el navegador no bloquee la peticion
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        // Si es una peticion de control (Options), responde ok
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(200, -1);
            exchange.close();
            return;
        }

        // Solo es aceptado el metodo POST
        if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            try {
                // Lee el JSON
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                System.out.println("JSON recibido en Java: " + body);

                // Convierte el texto JSON al objeto Libro usando GSON
                Gson gson = new Gson();
                Libro nuevoLibro = gson.fromJson(body, Libro.class);
                System.out.println("IDs de categorías detectados por Java: " + nuevoLibro.getCategoriasIds());
                // Llama a la clase LibroDAO
                LibroDAO dao = new LibroDAO();
                boolean exito = dao.insertarLibro(nuevoLibro);

                if (exito) {
                    String respuesta = "{\"mensaje\": \"Libro guardado correctamente\"}";
                    exchange.sendResponseHeaders(200, respuesta.getBytes(StandardCharsets.UTF_8).length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                    os.close();
                    System.out.println("Libro guardado correctamente.");
                } else {
                    exchange.sendResponseHeaders(500, -1);
                    System.out.println("Error en el DAO al guardar el libro.");
                }
            } catch (Exception e) {
                System.out.println("Error en LibroHandler: " + e.getMessage());
                e.printStackTrace();
                exchange.sendResponseHeaders(400, -1);
            }
        }
        // Añadiimos el else if para aceptar peticiones get, la cual mostrara los libros
        // de la bd en la pagina
        else if (exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            try {
                // Extrae parametros de la URL
                String query = exchange.getRequestURI().getQuery();
                LibroDAO dao = new LibroDAO();
                List<Libro> listaLibros;
                // Condicion para sacar todos los libros o solo los destacados mediante GET
                if (query != null && query.contains("filtro=destacados")) {
                    // Solo paso los libros destacados
                    listaLibros = dao.obtenerLibrosDestacados();
                } else {
                    // Se pasan todos los libros
                    listaLibros = dao.obtenerTodosLosLibros();
                }
                // Conversion a JSON y se envia
                Gson gson = new Gson();
                String jsonRespuesta = gson.toJson(listaLibros);

                exchange.sendResponseHeaders(200, jsonRespuesta.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = exchange.getResponseBody();
                os.write(jsonRespuesta.getBytes(StandardCharsets.UTF_8));
                os.close();
            } catch (Throwable e) {
                // System.out.println("Error al enviar los libros: " + e.getMessage());
                // exchange.sendResponseHeaders(500, -1);
                // exchange.close();
                System.out.println("¡ERROR FATAL CAPTURADO!: " + e.toString());
                e.printStackTrace();
                try {
                    exchange.sendResponseHeaders(500, -1);
                    exchange.close();
                } catch (Exception ex) {
                }
            }
        } else if (exchange.getRequestMethod().equalsIgnoreCase("PUT")) {
            try {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                System.out.println("Peticion PUT recibida");
                System.out.println("JSON: " + body);

                Gson gson = new Gson();
                Libro libroEditado = gson.fromJson(body, Libro.class);

                System.out.println("ID reconocido por Java: " + libroEditado.getId());

                LibroDAO dao = new LibroDAO();
                boolean exito = dao.actualizarLibro(libroEditado);

                System.out.println("¿Éxito en el DAO?: " + exito);

                if (exito) {
                    String respuesta = "{\"mensaje\": \"Libro actualizado correctamente\"}";
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
        } else if (exchange.getRequestMethod().equalsIgnoreCase("DELETE")) {
            try {
                // Leer la URL para extraer el ID del libro
                String query = exchange.getRequestURI().getQuery();
                if (query != null && query.startsWith("id=")) {
                    int id = Integer.parseInt(query.split("=")[1]);

                    LibroDAO dao = new LibroDAO();
                    boolean exito = dao.eliminarLibro(id);

                    if (exito) {
                        String respuesta = "{\"mensaje\": \"Libro eliminado correctamente\"}";
                        exchange.sendResponseHeaders(200, respuesta.getBytes(StandardCharsets.UTF_8).length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(respuesta.getBytes(StandardCharsets.UTF_8));
                        os.close();
                    } else {
                        // Si el id no existe en la bd
                        exchange.sendResponseHeaders(404, -1);
                    }
                } else {
                    // Si mandan la URL sin el id
                    exchange.sendResponseHeaders(400, -1);
                }
            } catch (Exception e) {
                e.printStackTrace();
                exchange.sendResponseHeaders(500, -1);
            }
        } else

        {
            // Si se intenta entrar por GET a la ruta de guardar libros, se le deniega
            exchange.sendResponseHeaders(405, -1);
            exchange.close();
        }
    }

}
