module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('inventory', [
      {
        name: 'Motor Yağı 5W-30',
        description: 'Sentetik motor yağı 5W-30',
        category_id: 3,
        quantity: 50,
        unit: 'Litre',
        price: 150.00,
        supplier: 'Castrol',
        minimum_stock: 10,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Yağ Filtresi',
        description: 'Standart yağ filtresi',
        category_id: 3,
        quantity: 30,
        unit: 'Adet',
        price: 80.00,
        supplier: 'Bosch',
        minimum_stock: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fren Balatası',
        description: 'Ön fren balatası seti',
        category_id: 4,
        quantity: 20,
        unit: 'Set',
        price: 250.00,
        supplier: 'Brembo',
        minimum_stock: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fren Hidroliği',
        description: 'DOT 4 fren hidroliği',
        category_id: 4,
        quantity: 25,
        unit: 'Litre',
        price: 120.00,
        supplier: 'Castrol',
        minimum_stock: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hava Filtresi',
        description: 'Standart hava filtresi',
        category_id: 3,
        quantity: 15,
        unit: 'Adet',
        price: 90.00,
        supplier: 'Mann-Filter',
        minimum_stock: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('inventory', null, {});
  }
}; 