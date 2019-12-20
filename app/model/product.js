import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("product", {
        drawer: Sequelize.STRING,
        row: Sequelize.STRING,
        name: Sequelize.STRING,
        reference: Sequelize.STRING,
    })
};
