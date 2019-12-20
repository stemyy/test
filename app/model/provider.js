import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("provider", {
        name: Sequelize.STRING,
    })
};
