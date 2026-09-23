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
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
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
                // Pruebas en consola para comprobar el flujo mediante diferentes sysos
                System.out.println("Entrando al bloque GET");
                // Llama a DAO para que seleccione todos los libros de la bd
                LibroDAO dao = new LibroDAO();
                System.out.println("DAO instanciado, buscando los libros en BD.");
                List<Libro> listaLibros = dao.obtenerLibrosDestacados();
                System.out.println("Libros obtenidos: " + listaLibros.size());
                // Convertir esa lista a JSON usando Gson
                Gson gson = new Gson();
                System.out.println("GSON instanciado.");
                String jsonRespuesta = gson.toJson(listaLibros);
                System.out.println("JSON generado correctamente");
                // Enviar el JSON al frontend (index.js)
                exchange.sendResponseHeaders(200, jsonRespuesta.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = exchange.getResponseBody();
                os.write(jsonRespuesta.getBytes(StandardCharsets.UTF_8));
                os.close();
                System.out.println("Respuesta enviada al navegador.");
                // Throwable atrapa absolutamente todo, incluidos fallos criticos de librerias
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
        }

        else {
            // Si se intenta entrar por GET a la ruta de guardar libros, se le deniega
            exchange.sendResponseHeaders(405, -1);
            exchange.close();
        }
    }

}
