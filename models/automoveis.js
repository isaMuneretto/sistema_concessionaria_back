const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../db");
const concessionarias = require  ('./concessionarias')

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
    concessionarias_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    }
    
});

Automovel.sync();
Automovel.belongsTo(concessionarias, { foreignKey: 'concessionarias_id' });

module.exports = Automovel;