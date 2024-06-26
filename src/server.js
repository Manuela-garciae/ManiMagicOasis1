const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const migrationsRouter = require('./migrations');
const todosRouter = require('./usuarios');
const serviciosRouter = require('./servicios');
const cors = require('cors');

// conf dotenv
dotenv.config();
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000
app.use(cors());

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handler middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

app.use('/', migrationsRouter);
app.use('/', todosRouter);
app.use('/', serviciosRouter);

app.use(express.static('public'));



app.get('/', (req, res) => {
    res.status(200).send('Hola mundo ahora');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});