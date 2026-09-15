CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    apellidos VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

ALTER TABLE usuarios 
ADD COLUMN rol TINYINT DEFAULT 1 NOT NULL; -- 1 = cliente, 0 = admin

CREATE TABLE libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    autor VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(25) NOT NULL,
    editorial VARCHAR(25) NOT NULL,
    numPaginas INT(4) NOT NULL,
    portada_url VARCHAR(40) DEFAULT 'placeholder.jpg'
);

CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_libro INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1, -- Tu atributo "Cantidad" (circulito)
    -- Definición de las Foreign Keys para enlazar
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_libro) REFERENCES libros(id) ON DELETE CASCADE
);

CREATE TABLE lista_deseos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_libro INT NOT NULL,
    -- Definición de las Foreign Keys para enlazar
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_libro) REFERENCES libros(id) ON DELETE CASCADE
);

-- --- DATOS DE PRUEBA (Opcional, para tener algo con lo que jugar en Java) ---

-- Creamos tu usuario
-- INSERT INTO usuarios (nombre, email, password) 
-- VALUES ('Asier', 'asier@ejemplo.com', 'password123');

-- Metemos los libros de ejemplo que pediste al principio
-- INSERT INTO libros (titulo, autor, precio, categoria) VALUES 
-- ('Alas de hierro', 'Rebecca Yarros', 22.90, 'Fantasía'),
-- ('El Imperio Final', 'Brandon Sanderson', 20.50, 'Fantasía'),
-- ('El resplandor', 'Stephen King', 18.90, 'Terror y Suspense'),
-- ('Hábitos Atómicos', 'James Clear', 19.90, 'Desarrollo Personal');