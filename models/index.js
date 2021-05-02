
const Sequelize = require('sequelize');
//추후 배포모드, 개발모드 계정 분기
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const Ranking = require('./ranking');
const Script = require('./script');
const Word = require('./words');

const db = {};

var sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;

db.Ranking = Ranking;
db.Script = Script;
db.Word = Word;

Ranking.init(sequelize);
Script.init(sequelize);
Word.init(sequelize);

Ranking.associate(db);
Script.associate(db);
//사실상 현재는 연관된 디비 없음
Word.associate(db);

module.exports = db;
