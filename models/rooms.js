const Sequelize = require('sequelize');

module.exports = class Rooms extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            room_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            room_title: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            room_capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 4,
                validate:{
                    max: 6,
                    min: 2,
                },
            },
            room_owner: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            room_password: {
                type: Sequelize.STRING,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Rooms',
            tableName: 'Rooms',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        //
    }
}