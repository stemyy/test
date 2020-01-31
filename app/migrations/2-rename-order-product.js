import { sequelize } from '../model';

export default async function up() {

    await sequelize.queryInterface.describeTable('Orders').then(tableDefinition => {
        if (tableDefinition['productName']) return Promise.resolve();

        return sequelize.queryInterface.renameColumn('Orders', 'product', 'productName');
    });
}
