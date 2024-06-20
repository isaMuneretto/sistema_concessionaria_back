const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../db");

const Funcionario = sequelize.define('funcionarios', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    celular: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data_nascimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    concessionarias_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    }     
 
});

Funcionario.sync();
Automovel.belongsTo(concessionarias, { foreignKey: 'concessionarias_codigo' });

module.exports = Funcionario;