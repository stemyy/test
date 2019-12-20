import Sequelize from 'sequelize';
import log from 'electron-log';

import { sequelize } from '../model';

export default async function ensureMigrationsTable() {
    log.info('Ensuring migrations table exists');
    await sequelize.queryInterface.createTable('Migrations', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        executedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });
}
