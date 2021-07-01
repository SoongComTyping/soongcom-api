const Sequelize = require('sequelize');

module.exports = class WordEng extends Sequelize.Model {
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
        },{
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'Words_eng',
                tableName: 'Words_eng',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        
    }
};
