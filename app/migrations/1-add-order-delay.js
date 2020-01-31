import Sequelize from 'sequelize';

import { sequelize } from '../model';

export default async function up() {
    await sequelize.queryInterface.describeTable('Orders').then(tableDefinition => {
        if (tableDefinition['delay']) return Promise.resolve();

        return sequelize.queryInterface.addColumn('Orders', 'delay', {
            type: Sequelize.INTEGER,
        });
    });
}
