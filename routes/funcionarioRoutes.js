const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../db");
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const senhaEncriptada = await bcrypt.hash(req.body.senha, 10);
        const query = `INSERT INTO funcionarios (nome, cpf, celular, dataNascimento, email, senha) VALUES (?, ?, ?, ?, ?, ?)`;
        const replacements = [req.body.nome, req.body.cpf, req.body.celular, req.body.dataNascimento, req.body.email, senhaEncriptada];

        const [results, metadata] = await sequelize.query(query, { replacements });

        res.status(201).json({
            success: true,
            message: "Funcionário criado com sucesso",
            results: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// GET para listar todas os funcionarios
router.get('/', async (req, res) => {
    try {
        const query = "SELECT * FROM funcionarios";
        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.json({
            success: true,
            funcionarios: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.put('/:id', async(req, res) => {
    const id = req.params.id; //pega o id enviado pela requisição
    const { senha } = req.body; //campo a ser alterado
    try{
        
        await sequelize.query("UPDATE usuarios SET senha = ? WHERE id = ?", { replacements: [senha, id], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Senha alterada com sucesso.' }); //statusCode indica ok no update
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

//Deletar um funcionario que deseja ser removido do banco de dados.
router.delete('/:id', async(req, res) => {
    const {id} = req.params; //pega o id enviado pela requisição para ser excluído
    try{
        await sequelize.query("DELETE FROM funcionarios WHERE id = ?", { replacements: [id], type: QueryTypes.DELETE });
        res.status(200).json({ message: 'Funcionário deletado com sucesso.' }); //statusCode indica ok no delete
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

module.exports = router;