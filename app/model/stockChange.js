import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("stockChange", {
        actualQuantity: Sequelize.INTEGER
    })
};
