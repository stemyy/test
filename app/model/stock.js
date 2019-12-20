import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("stock", {
        quantity: Sequelize.INTEGER,
        pricePerUnit: Sequelize.DECIMAL(6.2),
    })
};
