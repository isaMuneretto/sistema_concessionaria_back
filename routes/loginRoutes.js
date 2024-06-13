const express = require('express');
const router = express.Router();
const sequelize = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; 
require('dotenv').config();



// POST Login de usuário
router.post('/login', async (req, res) => {
  console.log("entrou");
  const { email, senha } = req.body;
  console.log(email, senha);
  const query = 'SELECT * FROM usuarios WHERE email = :email'; // Utilizando :email como marcador de posição
  try {
      // Usando await para resolver a promessa retornada por db.query
      const results = await sequelize.query(query, {
          replacements: { email }, // Passando os parâmetros como um objeto
          type: sequelize.QueryTypes.SELECT
      });

      if (results.length === 0) {
          console.log("não encontrou");
          return res.status(401).send('Usuário não encontrado.');
      }

      const user = results[0];
      console.log("deu certo");

      try {
          const match = await bcrypt.compare(senha, user.senha);
          if (match) {
              const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
              return res.json({ token });
          } else {
              return res.status(401).send('Senha incorreta.');
          }
      } catch (error) {
          console.error(error);
          return res.status(500).send('Erro ao verificar senha');
      }
  } catch (error) {
      console.error("Erro antes do if", error);
      return res.status(500).send('Erro no servidor');
  }
})


  
  // Middleware para verificar o token
  function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Acesso negado.');
  
    try {
        const verificado = jwt.verify(token, SECRET_KEY);
        req.usuario = verificado;
        next();
    } catch (erro) {
        res.status(400).send('Token inválido.');
    }
  }
  
  //// Rota para registrar um usuário
  const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10); // O segundo argumento é o número de rounds de salting
  };
  
  router.post('/register', async (req, res) => {
    const { username, email, senha } = req.body;
  console.log(username, email, senha)
    try{
      const senhaHash = hashPassword(senha);
      /* const sql = `INSERT INTO usuarios (username, email, senha) VALUES (?, ?, ?)`;
      //console.log(senhaHash);
      const result = await sequelize.query(sql, [username, email, senhaHash]);
      res.send({ success: true, message: 'Usuário registrado com sucesso!' }); */
      const result = await sequelize.query('INSERT INTO usuarios (username, email, senha) VALUES (:username, :email, :senhaHash)', {
        replacements: { username, email, senhaHash },
        type: sequelize.QueryTypes.INSERT,
      
      });
      
      res.status(201).json({
        success: true,
        message: "Usuário registrado com sucesso!",
        results: result,
    });

    }catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: 'Erro ao registrar usuário.' });
    }
        
  });

module.exports = router;

