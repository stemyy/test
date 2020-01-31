/**
 * Migrate SQLite database and manage Migrations table.
 * Eventually this probably should run in a separate process.
 *
 * For now we run migraitons from the renderer process since we show a static
 * migration screen with no buttons to click anyways.
 */
import log from 'electron-log';
import ensureMigrationsTable from './ensureMigrationsTable';
import { Migration } from '../model';
import migration1 from "./1-add-order-delay";
import migration2 from "./2-rename-order-product";
import migration3 from "./3-add-order-productId";
import migration4 from "./4-rename-order-provider";
import migration5 from "./5-add-order-providerId";

// Migrations (`up`) should be functions that return a Promise.
const migrations = {
    1: migration1,
    2: migration2,
    3: migration3,
    4: migration4,
    5: migration5,
};

export async function pendingMigrations() {
    await ensureMigrationsTable();

    const maxMigration = await Migration.findOne({ order: [['id', 'DESC']] });
    const maxMigrationNumber = maxMigration ? maxMigration.id : 0;
    log.info(`SQLite - Max migration is ${maxMigrationNumber}`);
    return Object.keys(migrations).filter(migrationNumber => migrationNumber > maxMigrationNumber);
}

export async function migrateDatabase() {
    await ensureMigrationsTable();

    const pendingMigrationNumbers = await pendingMigrations();
    if (pendingMigrationNumbers.length === 0) {
        log.info(`SQLite - No migrations to run, all up to date`);
        return;
    }

    // Use for-of loop to await in sequence
    // https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795
    // https://codeburst.io/foreach-vs-for-of-vs-for-in-tug-of-for-d8f93539664
    for (const migrationNumber of pendingMigrationNumbers) {
        log.info(`SQLite - Running migration ${migrationNumber}`);
        const up = migrations[migrationNumber];
        await up();
        await Migration.create({ id: migrationNumber, executedAt: new Date() });
        log.info(`SQLite - Migration ${migrationNumber} succeeded`);
    }
}
