const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    return queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '5551234567',
        role: 'admin',
        experience: null,
        speciality: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Master User',
        email: 'master@example.com',
        password: hashedPassword,
        phone: '5559876543',
        role: 'mechanic',
        experience: 5,
        speciality: 'Engine Repair',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Customer User',
        email: 'customer@example.com',
        password: hashedPassword,
        phone: '5554567890',
        role: 'customer',
        experience: null,
        speciality: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
}; 