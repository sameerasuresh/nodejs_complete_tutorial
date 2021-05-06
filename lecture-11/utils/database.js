const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'root', {
    dialect: 'mysql',
    port: 3306,
    host: 'localhost'
});

module.exports = sequelize;