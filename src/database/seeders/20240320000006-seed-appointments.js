module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('appointments', [
      {
        tracking_number: 'APT-001',
        customer_id: 3,
        vehicle_id: 1,
        mechanic_id: 2,
        appointment_date: new Date('2024-03-25 10:00:00'),
        status: 'confirmed',
        description: 'Yağ değişimi ve genel kontrol',
        total_amount: 450.00,
        payment_status: 'pending',
        notes: 'Yağ değişimi ve genel kontrol',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tracking_number: 'APT-002',
        customer_id: 3,
        vehicle_id: 2,
        mechanic_id: 2,
        appointment_date: new Date('2024-03-26 14:00:00'),
        status: 'confirmed',
        description: 'Fren balatası değişimi',
        total_amount: 850.00,
        payment_status: 'pending',
        notes: 'Fren balatası değişimi',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tracking_number: 'APT-003',
        customer_id: 3,
        vehicle_id: 3,
        mechanic_id: 2,
        appointment_date: new Date('2024-03-27 11:00:00'),
        status: 'confirmed',
        description: 'Motor bakımı ve kontrol',
        total_amount: 1200.00,
        payment_status: 'pending',
        notes: 'Motor bakımı ve kontrol',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('appointments', null, {});
  }
}; 