package PO_Objetos.Libreria.back;

public class Usuario {
    // El usuario debe tener id, nombre, apellidos, email y password
    private int id;
    private String nombre;
    private String apellidos;
    private String email;
    private String password;
    private int rol;

    // Constructor de objeto

    // Constructor 1 para leer de la base de datos
    public Usuario(int id, String nombre, String apellidos, String email, String password, int rol) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

    // Constructor 2 para registrar nuevos usuarios (sin ID ni ROL)
    public Usuario(String nombre, String apellidos, String email, String password) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.password = password;
    }

    // Constructor 3 para que el administrador pueda editar usuarios (vacio)
    public Usuario() {

    }

    // Metodos getters y setters

    public int getID() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public int getRol() {
        return rol;
    }

    public void setRol(int rol) {
        this.rol = rol;
    }

    // Pruebas con los objetos usuarios:
    // Java lee la base de datos y usa tu constructor para crear el objeto
    // Usuario usuarioActivo = new Usuario(1, "Carlos", "López",
    // "carlos@ejemplo.com", "secreta123");

    // System.out.println("Inicio de sesión válido para: " +
    // usuarioActivo.getEmail());
    // System.out.println("Mostrando perfil de: " + usuarioActivo.getNombre() + " "
    // + usuarioActivo.getApellidos());
}
