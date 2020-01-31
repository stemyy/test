import { sequelize } from '../model';

export default async function up() {
    await sequelize.queryInterface.renameColumn('Orders', 'product', 'productName');
}
