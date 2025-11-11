require('dotenv').config();
const { Pool } = require('pg');

// Debug: mostrar variables de entorno
console.log("=== DEBUG PostgreSQL CONFIG ===");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD existe:", !!process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("===============================");

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rendimiento_academico',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

async function getConnection() {
    try {
        console.log("Intentando conectar a PostgreSQL...");
        const client = await pool.connect();
        console.log("✅ Conectado a la base de datos PostgreSQL.");
        return client;
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
        console.error("Detalles de conexión:", {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            database: process.env.DB_NAME || 'rendimiento_academico',
            port: process.env.DB_PORT || 5432
        });
        
        if (error.code === 'ECONNREFUSED') {
            console.error("Posible causa: PostgreSQL no está ejecutándose");
        } else if (error.code === '28P01') {
            console.error("Posible causa: Credenciales incorrectas");
        } else if (error.code === '3D000') {
            console.error("Posible causa: La base de datos no existe");
        }
        
        throw error;
    }
}

// Función para probar la conexión directamente
async function testConnection() {
    try {
        const client = await getConnection();
        console.log("🟢 Test de conexión exitoso");
        client.release();
        return true;
    } catch (error) {
        console.error("🔴 Test de conexión fallido:", error.message);
        return false;
    }
}

module.exports = {
    getConnection,
    testConnection
};