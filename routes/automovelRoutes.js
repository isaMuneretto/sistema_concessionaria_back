const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../db");



router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO automoveis (nome, concessionarias_codigo) VALUES (?, ?)`;
        const replacements = [req.body.nome, req.body.concessionarias_codigo];

        const [results, metadata] = await sequelize.query(query, { replacements });

        res.status(201).json({
            success: true,
            message: "Automovel criado com sucesso",
            results: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// GET para listar todas as tarefas
router.get('/', async (req, res) => {
    try {
        const query = "SELECT * FROM automoveis";
        const results = await sequelize.query(query, { type: QueryTypes.SELECT });
        console.log(results);
        res.json({
            success: true,
            automoveis: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get("/filtro/:palavra", async (req, res) => {
    const palavra = req.params.palavra;
    try {
        const query = `SELECT * FROM automoveis WHERE nome LIKE :palavra;`;

        const automoveis = await sequelize.query(query, {
            replacements: { palavra: `%${palavra}%` },
            type: sequelize.QueryTypes.SELECT,
        });
        res.status(200).json(automoveis);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});


router.put('/:id', async(req, res) => {
    const id = req.params.id; //pega o id enviado pela requisição
    const { nome } = req.body; //campo a ser alterado
    try{
        //altera o campo nome no registro onde o id coincidir com o id enviado
        await sequelize.query("UPDATE automoveis SET nome = ? WHERE id = ?", { replacements: [nome, id], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Nome atualizado com sucesso.' }); //statusCode indica ok no update
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

//Deletar um automovel que deseja ser removido do banco de dados.
router.delete('/:id', async(req, res) => {
    const {id} = req.params; //pega o id enviado pela requisição para ser excluído
    try{
        await sequelize.query("DELETE FROM automoveis WHERE id = ?", { replacements: [id], type: QueryTypes.DELETE });
        res.status(200).json({ message: 'Automóvel deletado com sucesso.' }); //statusCode indica ok no delete
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

module.exports = router;