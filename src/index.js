const mysql = require('mysql2');
const express = require('express');
const config = require('config');

const app = express();
app.use(express.json());
app.listen(config.get('express.port'));

const connection = mysql.createConnection({
    host: config.get('database.host'),
    user: config.get('database.user'),
    password: config.get('database.password'),
    database: config.get('database.databaseName')
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("MYSQL connected!");
});

app.get('/login', (request, response) => {
    const { email, password } = request.body;

    connection.query('SELECT EMAIL, SENHA FROM CADASTRO' + ' WHERE EMAIL = ' + mysql.escape(email) +
        ' AND SENHA = ' + mysql.escape(password), (err, rows) => {

        if (err) {
            throw err;
        } else if(rows.length > 0) {
            return response.status(200);
        } else {
            return response.status(404);
        }
    });
});

function calculateUserAge(birthDate) {
    const birthMonth = birthDate.substring(0, 2);
    const birthday = birthDate.substring(3, 5);
    const birthYear = birthDate.substring(6, 12);

    const currentDate = new Date;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    let age = currentYear - birthYear;

    if (currentMonth < birthMonth || currentMonth === birthMonth && currentDay < birthday) {
        age--;
    }
    return age;
}

function verifyUserEmail(request, response, next) {
    const { email } = request.body;

    connection.query('SELECT EMAIL FROM CADASTRO WHERE EMAIL = ' + mysql.escape(email),
        (err, rows) => {

        if (err) {
            throw err;
        } else if (rows.length === 0) {
            return next();
        } else {
            return response.status(400).send("E-mail já cadastrado.")
        }
    });
}

function verifyUserCPF(request, response, next) {
    const { cpf } = request.body;

    connection.query('SELECT CPF FROM USUARIO WHERE CPF = ' + mysql.escape(cpf),
        (err, rows) => {

        if (err) {
            throw err;
        } else if (rows.length === 0) {
            return next();
        } else {
            return response.status(400).send("CPF já cadastrado.");
        }
    });
}

function verifyUserPhone(request, response, next) {
    const { phone } = request.body;

    connection.query('SELECT TELEFONE FROM USUARIO WHERE TELEFONE = ' + mysql.escape(phone),
        (err, rows) => {

        if (err) {
            throw err;
        } else if (rows.length === 0) {
            return next();
        } else {
            return response.status(400).send("Telefone já cadastrado.");
        }
    });
}

app.post('/signUp/user', verifyUserEmail, verifyUserCPF, verifyUserPhone, (request, response) => {
    const { cpf, name, surname, birthDate, email, phone, password } = request.body;

    const age = calculateUserAge(birthDate);
    const fullName = name.concat(' ' + surname);

    connection.query('INSERT INTO USUARIO (CPF, NOME_COMPL, TELEFONE, IDADE, IS_MOTORISTA)' +
    'VALUES (' + mysql.escape(cpf) + ', ' + mysql.escape(fullName) +
        ', ' + mysql.escape(phone) + ', ' + mysql.escape(age) + ", 0);",
        (err, rows) => {

        if (err) throw err;
        console.log("/signUp/user - INSERT INTO USUARIO: ", rows);

            connection.query('INSERT INTO CADASTRO (EMAIL, SENHA, FK_USUARIO)' +
                'VALUES (' + mysql.escape(email) + ', ' + mysql.escape(password) + ', ' +
                mysql.escape(cpf) + ')', (err, rows) => {

                if (err) throw err;
                console.log("/signUp/user - INSERT INTO CADASTRO: ", rows);
            });
            return response.status(201).send("Usuário cadastrado com sucesso.");
    });
});
