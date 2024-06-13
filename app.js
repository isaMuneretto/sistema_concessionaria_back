const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = "3001";

//cria uma instância do Express e define a porta em que o servidor irá escutar
const app = express();

app.use(cors());
// Configurando o express para aceitar JSON
bodyParser.urlencoded //analisa corpos de solicitação HTTP
//extended: true analisa dados codificados de forms que possuem estrutura aninhada (array e obj)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//importação das rotas
const automoveis = require('./routes/automovelRoutes');
const funcionarios = require('./routes/funcionarioRoutes');
const login = require('./routes/loginRoutes');

//definição das rotas
app.use('/automoveis',automoveis);
app.use('/funcionarios',funcionarios);
app.use('/login', login);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;