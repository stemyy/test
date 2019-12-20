import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("category", {
        name: Sequelize.STRING,
    })
};
