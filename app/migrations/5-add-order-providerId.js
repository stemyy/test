import Sequelize from 'sequelize';
import { sequelize } from '../model';

export default async function up() {
    await sequelize.queryInterface.describeTable('Orders').then(tableDefinition => {
        if (tableDefinition['providerId']) return Promise.resolve();

        return sequelize.queryInterface.addColumn(
            'Orders',
            'providerId',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'providers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }
        );
    });
}
