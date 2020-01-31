import Sequelize from 'sequelize';
import { sequelize } from '../model';

export default async function up() {
    await sequelize.queryInterface.describeTable('Orders').then(tableDefinition => {
        if (tableDefinition['productId']) return Promise.resolve();

        return sequelize.queryInterface.addColumn(
            'Orders',
            'productId',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }
        );
    });
}
