const express = require("express");
const route = express.Router();
require('dotenv').config(); 
const { Pool } = require("pg");

const connectionString = process.env.POSTGRES_EXTRENAL_DB;

const pool = new Pool({
    connectionString,
});

// el create type es el codigo necesario para postgresql donde incluimos el enum
const queries = [
    `CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`, `CREATE TABLE servicios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        imagen VARCHAR(255),
        precio DECIMAL(10,2) NOT NULL,
        create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      `, `CREATE TYPE rol AS ENUM ('user', 'admin');
      ALTER TABLE usuarios ADD COLUMN rol rol NOT NULL;`
]

// ☺ ♦ Reemplaza las funciones vacías con tu lógica específica:
async function createDatabase(req, res) {
    try {
        const client = await pool.connect();
        // Obtener todos los "todos" de la base de datos
        let results = null;
        for (al in queries) {
            results = await client.query(queries[al]);
        }
        const todos = results.rows;
        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving todos");
    }
}

route.get("/create", createDatabase);

module.exports = route; 