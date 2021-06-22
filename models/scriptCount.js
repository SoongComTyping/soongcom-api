const Sequelize = require('sequelize');

module.exports = class Script extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            alphabet:{
                type: Sequelize.STRING(1),
                allowNull: false,
                primaryKey: false,
            },
            //contents는 medium text type이다.
            count: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            
        },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'Script_count',
                tableName: 'Script_count',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        //foreign key 설정같은거 여기에다가 넣으면 된다.
        //EX) 유저 정보 백업 테이블
        db.ScriptCount.belongsTo(db.Script, {foreignKey: 'id', sourceKey: 'id'});
    }
};
