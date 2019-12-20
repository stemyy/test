import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define("rows", {
        name: Sequelize.STRING,
        label: Sequelize.STRING,
        displayTable: Sequelize.BOOLEAN,
    })
};
