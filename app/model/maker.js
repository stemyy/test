import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("maker", {
        name: Sequelize.STRING,
    })
};
