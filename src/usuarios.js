const express = require("express");
const bcrypt = require("bcrypt");
const route = express.Router();
const OpenAI = require('openai');
const { Pool } = require("pg");
require('dotenv').config();
const fs = require('fs');
const e = require("express");


const connectionString = process.env.POSTGRES_EXTRENAL_DB;
const apiKey = process.env.OPENAI_APIKEY;



const pool = new Pool({
    connectionString,
});

// CRUD Routes (implement these functions below)
route.get("/usuarios", getUsuarios); // GET all usuarios
route.post("/usuarios", createUsuarios); // POST a new usuarios
route.get("/usuarios/:id", getUsuariosById); // GET a usuarios by ID
route.put("/usuarios/:id", updateUsuarios); // PUT update a usuarios
route.delete("/usuarios/:id", deleteUsuarios); // DELETE delete a usuarios


// ☺ ♦
async function getUsuarios(req, res) {
    try {
        // Obtener usuarios los "usuarios" de la base de datos
        const client = await pool.connect();
        const results = await client.query("SELECT * FROM usuarios");
        const usuarios = results.rows;
        res.status(200).json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving usuarios");
    }
}


// ☺ ♦  
async function createUsuarios(req, res) {
    const { nombre, telefono, email, password, roles } = req.body;
    try {
        // Validar la entrada del body
        if (!nombre) {
            return res.status(400).send("No se encuentra el nombre");
        }
        if (!telefono) {
            return res.status(400).send("No se encuentra el telefono");
        }
        if (!email) {
            return res.status(400).send("No se encuentra el email");
        }
        if (!password) {
            return res.status(400).send("No se encuentra la contraseña");
        }
        if (!roles) {
            return res.status(400).send("No se encuentra el rol");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        
        // Crear un nuevo "usuarios" en la base de datos
        const client = await pool.connect();
        const result = await client.query(
            `INSERT INTO usuarios (nombre, telefono, email, password, roles) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombre, telefono, email, hashedPassword, roles]
        );
       
        const newTodo = result.rows[0];
        res.status(201).json({ result: 'ok', user: newTodo });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating usuarios");
    }
}

// ☺ ♦
async function getUsuariosById(req, res) {
    try {
        // Obtener un "usuarios" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("SELECT * FROM usuarios WHERE id = $1", [
            id,
        ]);
        const usuarios = result.rows[0];
        if (!usuarios) {
            return res.status(404).send("Usurio no encontrado");
        }
        res.status(200).json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving usuarios");
    }
}

// ☺ ♦
async function updateUsuarios(req, res) {
    try {
        // Actualizar un usuario por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const { nombre, telefono, email, password } = req.body;
        if (!nombre) {
            return res.status(400).send("No se encuentra el nombre");
        }
        if (!telefono) {
            return res.status(400).send("No se encuentra el telefono");
        }
        if (!email) {
            return res.status(400).send("No se encuentra el correo");
        }
        if (!password) {
            return res.status(400).send("No se encuentra la contraseña");
        }
     
        const hashedPassword = await bcrypt.hash(password, 10);

        const client = await pool.connect();
        const result = await client.query(
            "UPDATE usuarios SET nombre = $1, telefono = $2, email = $3, password = $4  WHERE id = $5 RETURNING *",
            [nombre, telefono, email, hashedPassword, id]
        );
        const usuarios = result.rows[0];
        if (!usuarios) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(200).json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating usuario");
    }
}

// ☺ ♦
async function deleteUsuarios(req, res) {
    try {
        // Eliminar un usuario por ID este entra por params no por body
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("DELETE FROM usuarios WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting usuarios");
    }
}

// ♦ ♣
// Registra los usuarioss
route.post('/register', async (req, res) => {
    try {
        const { nombre, telefono, email, password } = req.body;
        console.log(nombre, telefono, email, password);
        const hashedPassword = await bcrypt.hash(password, 10);


        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO usuarios (nombre, telefono, email, password, roles) VALUES ($1, $2, $3, $4, $5)",
            [nombre, telefono, email, hashedPassword, 'usera']
        );
        const newTodo = result.rows[0];
        res.status(201).json({ result: 'ok', user: newTodo });
    } catch (error) {
        res.status().json({ 'error': 'Ha ocurrido un error' })
    }

});


// login 

route.post('/forms', async (req, res) => {
    try {
        const { email, password } = req.body;

        const client = await pool.connect();
        //Buscar email en la bd
        const user = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ result: 'usuario y contraseña incorrectas' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isPasswordValid) {
            return res.status(404).json({ result: 'usuario y contraseña incorrectas' })
        }

        res.status(200).json({ result: 'ok', user: user.rows[0] })

    } catch (error) {
        console.log("🚀 ~ route.post ~ error:", error)

    }

});


// llamar la apikey
const openai = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY
});

// se llama el archivo data.json y se guarda en la funcion 
function readData() {
    const data = fs.readFileSync('./src/data.json', 'utf8');
    return JSON.parse(data);
}

// llamo la funcion sepOctavo
let sepOctavo = async (req, res) => {
    //  llamo el campo info rste recoje la pregunta
    const info = req.query.info;
    // activa el chat y crea la conversación
    const chatCompletion = await openai.chat.completions.create({
        messages: [{
            // en el campo content envio info y envio el entrenamiento
            role: 'user', content: `
            tast: eres un asesor en linea llamado "M-MagicChat" que trabaja con el spa "ManiMagic Oasis" debes obtener la respueta del usuario y hablar unicamente de informacion sobre el spa y los servicios que ofrecemos,  1. información propuesta por el usuario: ${info} 2. información a tener en cuenta ${JSON.stringify(readData())}
            Ejemplo de respuesta:
            Pregunta: Tengo la cara fea que hago?
            M-MagicChat: No estoy capacitado para responder este tipo de preguntas, sin embargo en nuestro spa tenemos varios tratamientos para dejar tu rostro limpio y más hermoso, te recomendamos... 
            `}],
        model: 'gpt-3.5-turbo',
    });
    // sale la respueta a la api
    res.status(201).json({ data: chatCompletion.choices[0].message });
}
route.get('/openai', sepOctavo);

module.exports = route;


