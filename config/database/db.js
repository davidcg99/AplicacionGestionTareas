const mysql = require("mysql2");
require("dotenv").config(); // Cargar variables de entorno

// 🔹 Configuración del pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST, // Servidor de la base de datos
    user: process.env.DB_USER, // Usuario
    password: process.env.DB_PASSWORD, // Contraseña
    database: process.env.DB_NAME, // Nombre de la base de datos
    waitForConnections: true, // Esperar si no hay conexiones disponibles
    connectionLimit: Number(process.env.DB_CONN_LIMIT) || 100, // Límite de conexiones activas
    queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 5000, // Límite de solicitudes en espera
    charset: 'utf8mb4', // ← Añade esta línea
});

// 🔹 Manejo de eventos del pool de conexiones
pool.on("acquire", (connection) => {
    console.log(`🔹 Conexión adquirida: ID ${connection.threadId}`);
});

pool.on("release", (connection) => {
    console.log(`🔹 Conexión liberada: ID ${connection.threadId}`);
});

pool.on("enqueue", () => {
    console.warn("⚠️ Esperando una conexión disponible en el pool...");
});

pool.on("error", (err) => {
    console.error("❌ Error en la conexión a la base de datos:", err.message);
});

// 🔹 Convertir el pool en promesas y exportar
const promisePool = pool.promise();
module.exports = promisePool;
