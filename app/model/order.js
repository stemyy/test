import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("order", {
        quantity: Sequelize.INTEGER,
        price: Sequelize.DECIMAL(6.2),
        product: Sequelize.STRING,
        provider: Sequelize.STRING,
        received: Sequelize.BOOLEAN,
        receivedAt: Sequelize.DATE
    })
};
