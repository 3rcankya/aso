const sequelize = require('../../config/database');
const seedUsers = require('./20240320000001-seed-users');
const seedCategories = require('./20240320000002-seed-categories');
const seedServices = require('./20240320000003-seed-services');
const seedInventories = require('./20240320000004-seed-inventories');
const seedVehicles = require('./20240320000005-seed-vehicles');
const seedAppointments = require('./20240320000006-seed-appointments');
const seedSettings = require('./20240320000007-seed-settings');
const seedAppointmentServices = require('./20240320000008-seed-appointment-services');

const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Test database connection
    await sequelize.authenticate();
    console.log('📡 Database connection established successfully.');

    // Run seeders in order
    console.log('👥 Seeding users...');
    await seedUsers.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('📑 Seeding categories...');
    await seedCategories.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('🔧 Seeding services...');
    await seedServices.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('📦 Seeding inventories...');
    await seedInventories.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('🚗 Seeding vehicles...');
    await seedVehicles.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('📅 Seeding appointments...');
    await seedAppointments.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('🔗 Seeding appointment services...');
    await seedAppointmentServices.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('⚙️ Seeding settings...');
    await seedSettings.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('✅ Database seeding completed successfully!');

    // Close database connection
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeders
runSeeders(); 