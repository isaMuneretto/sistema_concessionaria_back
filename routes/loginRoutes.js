const express = require('express');
const router = express.Router();
const sequelize = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; 
const dotenv = require('dotenv');
dotenv.config();



// POST Login de usuário
router.post('/login', async (req, res) => {
  console.log("entrou");
  const { email, senha } = req.body;
  console.log(email, senha);
  const query = 'SELECT * FROM funcionarios WHERE email = :email'; // Utilizando :email como marcador de posição
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
      console.log("deu certo",user);

      try {
        console.log("senha",senha)
        console.log("user.senha",user.senha)
          const match = await bcrypt.compare(senha, user.senha);
          console.log("match",match)
          if (match) {
            const id = user.id;
            const nome = user.nome;
            const concessionarias_id = user.concessionarias_id;
            const token = jwt.sign({ id:id, nome:nome, concessionarias_id :concessionarias_id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            console.log("token",token)
            return res.json({ token, user:{id: id, nome: nome, concessionarias_id: concessionarias_id} });
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
  const hashSenha = (senha) => {
    return bcrypt.hashSync(senha, 10); // O segundo argumento é o número de rounds de salting
  };
  
  router.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
  console.log(nome, email, senha)
    try{
      const senhaHash = hashSenha(senha);
      /* const sql = `INSERT INTO usuarios (username, email, senha) VALUES (?, ?, ?)`;
      //console.log(senhaHash);
      const result = await sequelize.query(sql, [username, email, senhaHash]);
      res.send({ success: true, message: 'Usuário registrado com sucesso!' }); */
      const result = await sequelize.query('INSERT INTO funcionarios (nome, email, senha) VALUES (:nome, :email, :senhaHash)', {
        replacements: { nome, email, senhaHash },
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

