const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'asoservice',
    process.env.DB_USER || 'asoservice_user',
    process.env.DB_PASS || '123456',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

async function runMigrations() {
    try {
        // Create migrations table if it doesn't exist
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS SequelizeMeta (
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (name)
      );
    `);

        // Get all migration files
        const migrationsPath = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsPath)
            .filter(file => file.endsWith('.js') && file !== 'run.js')
            .sort();

        // Get executed migrations
        const [executedMigrations] = await sequelize.query('SELECT name FROM SequelizeMeta');
        const executedMigrationNames = executedMigrations.map(m => m.name);

        // Run pending migrations
        for (const file of migrationFiles) {
            if (!executedMigrationNames.includes(file)) {
                console.log(`Running migration: ${file}`);
                const migration = require(path.join(migrationsPath, file));
                await migration.up(sequelize.getQueryInterface(), Sequelize);
                await sequelize.query('INSERT INTO SequelizeMeta (name) VALUES (?)', {
                    replacements: [file]
                });
                console.log(`Completed migration: ${file}`);
            }
        }

        console.log('All migrations completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigrations(); 