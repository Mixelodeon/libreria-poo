package PO_Objetos.Libreria.back;

public class Libro {
    // Atributos: Al identico que en la base de datos
    private int id;
    private String titulo;
    private String autor;
    private String categoria;
    private String editorial;
    private double precio;
    private int numPaginas;
    private String portadaURL;
    private boolean destacado;

    // Constructor total del objeto
    public Libro(int id, String titulo, String autor, double precio, String categoria, String editorial, int numPaginas,
            String portadaURL, boolean destacado) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.precio = precio;
        this.categoria = categoria;
        this.editorial = editorial;
        this.numPaginas = numPaginas;
        this.portadaURL = portadaURL;
        this.destacado = destacado;
    }

    // Constructor sin el ID para usar en consultas SQL
    public Libro(String titulo, String autor, double precio, String categoria, String editorial, int numPaginas,
            String portadaURL, boolean destacado) {
        this.titulo = titulo;
        this.autor = autor;
        this.precio = precio;
        this.categoria = categoria;
        this.editorial = editorial;
        this.numPaginas = numPaginas;
        this.portadaURL = portadaURL;
        this.destacado = destacado;
    }

    // Constructor vacio
    public Libro() {

    }

    // GETERS Y SETERS

    public int getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getEditorial() {
        return editorial;
    }

    public void setEditorial(String editorial) {
        this.editorial = editorial;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getNumPaginas() {
        return numPaginas;
    }

    public void setNumPaginas(int numPaginas) {
        this.numPaginas = numPaginas;
    }

    public String getPortadaURL() {
        return portadaURL;
    }

    public void setPortadaURL(String portadaURL) {
        this.portadaURL = portadaURL;
    }

    public boolean getDestacado() {
        return destacado;
    }

    public void setDestacado(boolean destacado) {
        this.destacado = destacado;
    }
}
