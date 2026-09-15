package PO_Objetos.Libreria.back;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class LibroHandler implements HttpHandler {
    // Procesa las peticiones de insertar libnros en la bd
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Permisos CORS, necesario para que el navegador no bloquee la peticion
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        // Si es una peticion de control (Options), responde ok
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Solo es aceptado el metodo POST
        if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            try {
                // Lee el JSON
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                // Convierte el texto JSON al objeto Libro usando GSON
                Gson gson = new Gson();
                Libro nuevoLibro = gson.fromJson(body, Libro.class);
                // Llama a la clase LibroDAO
                LibroDAO dao = new LibroDAO();
                boolean exito = dao.insertarLibro(nuevoLibro);

                if (exito) {
                    String respuesta = "{\"mensaje\": \"Libro guardado correctamente\"}";
                    exchange.sendResponseHeaders(200, respuesta.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes());
                    os.close();
                } else {
                    exchange.sendResponseHeaders(500, -1);
                }
            } catch (Exception e) {
                System.out.println("Error en LibroHandler: " + e.getMessage());
                exchange.sendResponseHeaders(400, -1);
            }
        }
    }

}
