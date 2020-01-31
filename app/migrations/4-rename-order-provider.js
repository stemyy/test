import { sequelize } from '../model';

export default async function up() {

    await sequelize.queryInterface.describeTable('Orders').then(tableDefinition => {
        if (tableDefinition['providerName']) return Promise.resolve();

        return sequelize.queryInterface.renameColumn('Orders', 'provider', 'providerName');
    });
}
