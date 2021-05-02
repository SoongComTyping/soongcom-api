const Sequelize = require('sequelize');

module.exports = class Words extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            word:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            //contents는 medium text type이다.
            type: {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
        },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'Words',
                tableName: 'Words',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        
    }
};
