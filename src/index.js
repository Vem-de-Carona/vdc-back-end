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
    const { email, password } = request.body;

    connection.query('SELECT EMAIL, SENHA FROM CADASTRO' + ' WHERE EMAIL = ' + mysql.escape(email) +
        ' AND SENHA = ' + mysql.escape(password), (err, rows) => {

        if (err) throw err;
        console.log(rows);

        if(rows.length > 0) {
            return response.status(200).send('Logar');
        } else {
            return response.status(404).send('Não encontrado');
        }
    });
});

app.post('/signUp/passenger', (request, response) => {
    const { name, surname, birthDate, email, phone, cpf, password } = request.body;

    const birthday = birthDate.substring(0, 2);
    const birthMonth = birthDate.substring(3, 5);
    const birthYear = birthDate.substring(6, 10);

    const currentdate = new Date;
    const currentYear = currentdate.getFullYear();
    const currentMonth = currentdate.getMonth();
    const currentDay = currentdate.getDate();

    let age = currentYear - birthYear;

    if (currentMonth < birthMonth || currentMonth === birthMonth && currentDay < birthday) {
        age--;
    }

    connection.query('INSERT INTO PASSAGEIRO (CPF, NOME_COMPL, TELEFONE, IDADE) ' +
        'VALUES (' + mysql.escape(cpf) + ', ' + mysql.escape(name) + ' ' + mysql.escape(surname) + ', ' +
        mysql.escape(phone) + ', ' + mysql.escape(age) + ')', (err, rows) => {

        if (err) throw err;
        console.log(rows);
        return response.status(200);
    });
});
