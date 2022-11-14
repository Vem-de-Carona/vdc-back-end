const mysql = require('mysql2');
const express = require('express');

const app = express();
app.use(express.json());
app.listen("3333");

const connection = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "VEMDECARONA"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("MYSQL connected!");
});

/**
 * GET - Buscar uma informação dentro do servidor
 * POST - Inserir uma informação dentro do servidor
 * PUT - Alterar uma informação dentro do servidor
 * PATCH - Alterar uma informação específica dentro do servidor
 * DELETE - Deletar uma informação dentro do servidor
 */

/**
 *  TIPOS DE PARÂMETROS
 *
 *  Route Params => Identificar um recurso para buscar/editar/deletar
 *  Query Params => Paginação / Filtro
 *  Body Params => Os objetos para inserção/alteração (JSON)
 */

app.get('/login', (request, response) => {
    const { username, password } = request.body;

    connection.query('SELECT USUARIO, SENHA FROM CADASTRO' +
        ' WHERE USUARIO = ' + mysql.escape(username) +
        ' AND SENHA = ' + mysql.escape(password), (err, rows) => {
        console.log(rows);

        if (err) {
            throw err;
        } else if(rows.length > 0) {
            return response.status(200).send('Logar');
        } else {
            return response.status(404).send('Não encontrado');
        }
    });
});
