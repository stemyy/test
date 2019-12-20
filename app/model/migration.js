import Sequelize from 'sequelize';

export default function (sequelize) {
    return sequelize.define('Migration', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        executedAt: Sequelize.DATE,
    });
}
