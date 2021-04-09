const Sequelize = require('sequelize');

module.exports = class Script extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name:{
                type: Sequelize.STRING(50),
                allowNull: false,
                primaryKey: false,
            },
            //contents는 medium text type이다.
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'script',
                tableName: 'script',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        //foreign key 설정같은거 여기에다가 넣으면 된다.
        //EX) 유저 정보 백업 테이블
        db.Script.hasMany(db.Ranking, {foreignKey: 'script_id', sourceKey: 'id'});
    }
};
