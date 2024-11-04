const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

// Instancia del express
const app = express();

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Asegúrate de servir archivos estáticos

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "n0m310",
    database: "desesperaza"
});

db.connect(err => {
    if (err) {
        console.error("Error en la conexión a la base de datos:", err);
        return;
    } else {
        console.log("¡Conexión exitosa a la base de datos!");
    }
});

// Puerto de la aplicación
const port = 5000;

// Servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + './public/index.html'); // Cambia la ruta si es necesario
});

// Registrar pan en el inventario
app.post('/inventario', (req, res) => {
    const { Nombre, Descripcion, Precio, categoria, urlimage, cantidad } = req.body;
    const query = 'INSERT INTO inventario (Nombre, Descripcion, Precio, categoria, urlimage, cantidad) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [Nombre, Descripcion, Precio, categoria, urlimage, cantidad], (err, result) => {
        if (err) {
            console.error('Error al registrar pan:', err);
            res.status(500).json({ error: 'Error al registrar pan' });
        } else {
            res.status(201).json({ message: 'Pan registrado :D', id: result.insertId });
        }
    });
});

// Mostrar registro
app.get('/inventario', (req, res) => {
    const query = 'SELECT * FROM inventario';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener registro:', err);
            res.status(500).json({ error: 'Error al obtener registros' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Actualizar un producto por ID
app.put('/inventario/:PANID', (req, res) => {
    const { PANID } = req.params; // Cambia a PANID para consistencia
    const { Nombre, Descripcion, Precio, categoria, urlimage, cantidad } = req.body;
    const query = 'UPDATE inventario SET Nombre=?, Descripcion=?, Precio=?, categoria=?, urlimage=?, cantidad=? WHERE PANID=?';

    db.query(query, [Nombre, Descripcion, Precio, categoria, urlimage, cantidad, PANID], (err, result) => {
        if (err) {
            console.error('Error al actualizar el registro:', err);
            res.status(500).json({ error: 'Error al actualizar el registro' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Registro no encontrado' });
        } else {
            res.status(200).json({ message: 'Registro actualizado' });
        }
    });
});

// Eliminar un registro por ID
app.delete('/inventario/:PANID', (req, res) => {
    const { PANID } = req.params; // Cambia a PANID para consistencia
    const query = 'DELETE FROM inventario WHERE PANID = ?';

    db.query(query, [PANID], (err, result) => {
        if (err) {
            console.error('Error al eliminar el registro:', err);
            res.status(500).json({ error: 'Error al eliminar el registro' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Registro no encontrado' });
        } else {
            res.status(200).json({ message: 'Registro eliminado' });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});