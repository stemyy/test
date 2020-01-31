import Sequelize from 'sequelize';

import { sequelize } from '../model';

export default async function up() {
    await sequelize.queryInterface.addColumn('Orders', 'delay', {
        type: Sequelize.INTEGER,
    });
}
