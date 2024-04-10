const express = require("express");
const route = express.Router();
const OpenAI = require('openai');
const { Pool } = require("pg");
require('dotenv').config();
const fs = require('fs');


const connectionString = process.env.POSTGRES_EXTRENAL_DB;
const apiKey = process.env.OPENAI_APIKEY;



const pool = new Pool({
    connectionString,
});

// CRUD Routes (implement these functions below)
route.get("/servicios", getServicios); // GET all servicios
route.post("/servicios", createServicios); // POST a new servicios
route.get("/servicios/:id", getServiciosById); // GET a servicios by ID
route.put("/servicios/:id", updateServicios); // PUT update a servicios
route.delete("/servicios/:id", deleteServicios); // DELETE delete a servicios


// ☺ ♦
async function getServicios(req, res) {
    try {
        // Obtener servicios los "servicios" de la base de datos
        const client = await pool.connect();
        const results = await client.query("SELECT * FROM servicios");
        const servicios = results.rows;
        res.status(200).json(servicios);
    } catch (err) {
        res.status(500).send("Error Recibiendo los  servicios");
    }
}

// ☺ ♦  
async function createServicios(req, res) {
    try {
        // Validar la entrada del body
        const { nombre, descripcion, imagen, precio } = req.body;
        if (!nombre) {
            return res.status(400).send("No se encuentra el nombre");
        }
        if (!descripcion) {
            return res.status(400).send("No se encuentra la descripcion");
        }
        if (!imagen) {
            return res.status(400).send("No se encuentra la imagen");
        }
        if (!precio) {
            return res.status(400).send("No se encuentra el precio");
        }
        

        // Crear un nuevo "servicios" en la base de datos
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO servicios (nombre, descripcion, imagen, precio ) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre, descripcion, imagen, precio ],
        );
        const newServicios = result.rows[0];
        res.status(201).json(newServicios);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating servicios");
    }
}

// ☺ ♦
async function getServiciosById(req, res) {
    try {
        // Obtener un "servicios" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("SELECT * FROM servicios WHERE id = $1", [
            id,
        ]);
        const servicios = result.rows[0];
        if (!servicios) {
            return res.status(404).send("Servicio no encontrado");
        }
        res.status(200).json(servicios);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving servicios");
    }
}

// ☺ ♦
async function updateServicios(req, res) {
    try {
        // Actualizar un "servicios" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const { nombre, descripcion, imagen, precio } = req.body;
        if (!nombre) {
            return res.status(400).send("No se encuentra el nombre");
        }
        if (!descripcion) {
            return res.status(400).send("No se encuentra la descripcion");
        }
        if (!imagen) {
            return res.status(400).send("No se encuentra la imagen");
        }
        if (!precio) {
            return res.status(400).send("No se encuentra el precio");
        }

        const client = await pool.connect();
        const result = await client.query(
            "UPDATE servicios SET nombre = $1, descripcion = $2, imagen = $3, precio = $4 WHERE id = $5 RETURNING *",
            [nombre, descripcion, imagen, precio, id],
        );
        const servicios = result.rows[0];
        if (!servicios) {
            return res.status(404).send("Servicio no encontrado");
        }
        res.status(200).json(servicios);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating servicios");
    }
}

// ☺ ♦
async function deleteServicios(req, res) {
    try {
        // Eliminar un servicio por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("DELETE FROM servicios WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).send("Servicios not found");
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting servicios");
    }
}




module.exports = route; 