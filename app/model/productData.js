import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("productData", {
        name: Sequelize.STRING,
        value: Sequelize.STRING,
    })
};
