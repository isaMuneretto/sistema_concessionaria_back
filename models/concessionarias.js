const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../db");

const Concessionaria = sequelize.define('concessionarias', {
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
    
});

Concessionaria.sync();

module.exports = Concessionaria;