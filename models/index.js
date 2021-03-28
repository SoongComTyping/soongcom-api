
const Sequelize = require('sequelize');
//추후 배포모드, 개발모드 계정 분기
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const Ranking = require('./ranking');

const db = {};

var sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;

db.Ranking = Ranking;

Ranking.init(sequelize);

Ranking.associate(db);

module.exports = db;
