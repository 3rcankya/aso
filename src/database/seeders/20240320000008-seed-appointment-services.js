module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('appointment_services', [
      {
        appointment_id: 1,
        service_id: 1,
        quantity: 1,
        price: 450.00,
        notes: 'Yağ değişimi ve genel kontrol',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        appointment_id: 2,
        service_id: 2,
        quantity: 1,
        price: 850.00,
        notes: 'Fren balatası değişimi',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        appointment_id: 3,
        service_id: 3,
        quantity: 1,
        price: 1200.00,
        notes: 'Motor bakımı ve kontrol',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('appointment_services', null, {});
  }
}; 