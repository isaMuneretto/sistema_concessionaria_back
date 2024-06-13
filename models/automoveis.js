const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../db");

const Automovel = sequelize.define('automoveis', {

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
    
});

Automovel.sync();

module.exports = Automovel;