module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [
      {
        name: 'Motor Bakımı',
        type: 'service',
        description: 'Motor ile ilgili tüm bakım ve onarım hizmetleri',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fren Sistemi',
        type: 'service',
        description: 'Fren sistemi bakım ve onarım hizmetleri',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Yağ ve Filtre',
        type: 'inventory',
        description: 'Motor yağları ve filtreler',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fren Parçaları',
        type: 'inventory',
        description: 'Fren sistemi parçaları',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Elektronik',
        type: 'service',
        description: 'Elektronik sistem bakım ve onarım hizmetleri',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Elektronik Parçalar',
        type: 'inventory',
        description: 'Elektronik sistem parçaları',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {});
  }
}; 