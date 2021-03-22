const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            script: {
                type: Sequelize.STRING(50),
                allowNull: false,
                primaryKey: true,
            },
            nickname:{
                type: Sequelize.STRING(20),
                allowNull: false,
                primaryKey: true,
            },
            score: {
                type: Sequelize.INTEGER.UNSIGNED,
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
                modelName: 'ranking',
                tableName: 'ranking',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        //foreign key 설정같은거 여기에다가 넣으면 된다.
        //EX) 유저 정보 백업 테이블
    }
}
