package PO_Objetos.Libreria.back;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;

public class ServidorWEB {
    // Boton de encendido
    public static void main(String[] args) throws Exception {
        // Crea el servidor en el puerto 8081
        HttpServer server = HttpServer.create(new InetSocketAddress(8081), 0);
        // Dos puertas: De inicio y registro
        // Puerta: /api/registro
        server.createContext("/api/registro", new RegistroHandLer());
        // Puerta: /api/login
        server.createContext("/api/login", new LoginHandler());
        // Puerta: /api/liberos
        server.createContext("/api/libros", new LibroHandler());
        // Puerta: /api/usuarios
        server.createContext("/api/usuarios", new UsuarioHandler());
        // Enciende el servidor para que escuche infinitamente
        server.setExecutor(null);
        server.start();
        System.out.println("¡El servidor web esta encendido y escuchando en el puerto 8081!");
    }

    // Manejador del login: Traductor manual de JSON a mano mediante metodos.
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String metodo = exchange.getRequestMethod();

            // Cors
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            if (metodo.equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                exchange.close();
                return;
            }

            if ("POST".equalsIgnoreCase(metodo)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes());
                System.out.println("¡Intento de Login!: " + body);

                String email = extraerValor(body, "email");
                String password = extraerValor(body, "password");

                UsuarioDAO dao = new UsuarioDAO();
                Usuario usuarioLogueado = dao.iniciarSesion(email, password);

                if (usuarioLogueado != null) {
                    // ¡Éxito!
                    // Mediante los metodos get de la clase usuario paso aqui la informacion del
                    // usuario que necesite
                    String nombreUsuario = usuarioLogueado.getNombre();
                    String emailUsuario = usuarioLogueado.getEmail();
                    int rolUsuario = usuarioLogueado.getRol();
                    // Prepara el JSON
                    String respuesta = "{\"mensaje\": \"ok\", \"nombre\": \"" + nombreUsuario + "\", \"email\": \""
                            + emailUsuario + "\", \"rol\": " + rolUsuario + "}";
                    exchange.sendResponseHeaders(200, respuesta.length());
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes());
                    os.close();
                } else {
                    // Error: Credenciales inválidas (401 Unauthorized)
                    String respuesta = "Email o contraseña incorrectos";
                    exchange.sendResponseHeaders(401, respuesta.length());
                    OutputStream os = exchange.getResponseBody();
                    os.write(respuesta.getBytes());
                    os.close();
                }
            } else {
                exchange.sendResponseHeaders(405, -1);
                exchange.close();
            }

        }
    }

    // Una clase interna que atiende las peticiones del JS
    static class RegistroHandLer implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Chivato, imprime que esta enviando exactamente el navegador
            String metodo = exchange.getRequestMethod();
            System.out.println("Metodo usado" + metodo);

            // Configuración de CORS
            // Da permiso a Live Server (HTML) para comunicarse con Java sin ser bloqueado
            // por seguridad
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            // Si es una petición de seguridad previa (OPTIONS), todo OK y sale
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            // Si es el POST del formulario con los datos
            if ("POST".equals(exchange.getRequestMethod())) {
                // Lee el paquete JSON que nos ha enviado el fetc en el register.js
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes());
                System.out.println("¡Ha llegado una paquete desde la web!" + body);
                // Extrae los datos del JSON
                String nombre = extraerValor(body, "nombre");
                String apellidos = extraerValor(body, "apellidos");
                String email = extraerValor(body, "email");
                String password = extraerValor(body, "password");
                // Creae el objeto usuario con los datos del form
                Usuario nuevoUsuario = new Usuario(nombre, apellidos, email, password);
                // Lo pasamos al UsuarioDAO para que sea enviado a la bd
                UsuarioDAO dao = new UsuarioDAO();
                boolean exito = dao.registrarUsuario(nuevoUsuario);
                // Prepara la respuesta que JS esta esperando
                String respuestas = exito ? "Registro completado" : "Error al registrar al usuario";
                // 200 exito - 400 eror
                int codigoEstado = exito ? 200 : 400;
                // Envia de vuelta al navegador
                exchange.sendResponseHeaders(codigoEstado, respuestas.length());
                OutputStream os = exchange.getResponseBody();
                os.write(respuestas.getBytes());
                os.close();
            } else {
                // Si llega otra cosa (el 405)
                System.out.println("Error 405: Esperaba POST pero recibí " + metodo);
                exchange.sendResponseHeaders(405, -1);
                exchange.close();
            }
        }
    }

    // Metodo para extraer los textos del JSON
    private static String extraerValor(String json, String clave) {
        String claveBuscada = "\"" + clave + "\":\"";
        int inicio = json.indexOf(claveBuscada) + claveBuscada.length();
        int fin = json.indexOf("\"", inicio);
        return json.substring(inicio, fin);
    }
}
