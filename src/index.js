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
    const { cpf, name, surname, birthDate, email, phone, password } = request.body;

    const birthYear = birthDate.substring(0, 4);
    const birthMonth = birthDate.substring(5, 7);
    const birthday = birthDate.substring(8, 10);

    const currentdate = new Date;
    const currentYear = currentdate.getFullYear();
    const currentMonth = currentdate.getMonth();
    const currentDay = currentdate.getDate();

    let age = currentYear - birthYear;

    if (currentMonth < birthMonth || currentMonth === birthMonth && currentDay < birthday) {
        age--;
    }

    const fullName = name.concat(' ' + surname);

    connection.query('SELECT EMAIL FROM CADASTRO WHERE EMAIL = ' + mysql.escape(email),
        (err, rows) => {

        if (err) throw err;
        console.log("/signUp/passenger - SELECT EMAIL ROWS: ", rows);

        // Se o e-mail fornecido pelo usuário ainda não existir no banco
        if (rows.length === 0) {

            connection.query('SELECT CPF FROM PASSAGEIRO WHERE CPF = ' + mysql.escape(cpf),
                (err, rows) => {

                    if (err) throw err;
                    console.log("/signUp/passenger - SELECT CPF ROWS: ", rows);

                    if (rows.length === 0) {

                        connection.query('SELECT TELEFONE FROM PASSAGEIRO WHERE TELEFONE = ' + mysql.escape(phone),
                            (err, rows) => {

                                if (err) throw err;
                                console.log("/signUp/passenger - SELECT TELEFONE ROWS: ", rows);

                                if (rows.length === 0) {

                                    connection.query('INSERT INTO PASSAGEIRO (CPF, NOME_COMPL, TELEFONE, IDADE)' +
                                        'VALUES (' + mysql.escape(cpf) + ', ' + mysql.escape(fullName) +
                                        ', ' + mysql.escape(phone) + ', ' + mysql.escape(age) + ");",
                                        (err, rows) => {

                                            if (err) throw err;
                                            console.log("/signUp/passenger - INSERT INTO PASSAGEIRO: ", rows);
                                        });

                                    connection.query('INSERT INTO CADASTRO (EMAIL, SENHA, FK_PASSAGEIRO, FK_MOTORISTA)' +
                                        'VALUES (' + mysql.escape(email) + ', ' + mysql.escape(password) + ', ' +
                                        mysql.escape(cpf) + ", " + null + ')', (err, rows) => {

                                        if (err) throw err;
                                        console.log("/signUp/passenger - INSERT INTO CADASTRO: ", rows);
                                    });
                                    return response.status(201).send("Usuário cadastrado com sucesso.");
                                } else {
                                    return response.status(400).send("TELEFONE já cadastrado.");
                                }
                            }
                        );
                    } else {
                        return response.status(400).send("CPF já cadastrado.");
                    }
                }
            );
        } else {
            return response.status(400).send("E-mail já cadastrado.");
        }
    });
});
