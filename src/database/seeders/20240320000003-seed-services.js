module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('services', [
      {
        name: 'Yağ Değişimi',
        description: 'Motor yağı ve filtre değişimi',
        category_id: 1,
        base_price: 500.00,
        estimated_duration: 60,
        required_parts: 'Motor yağı, yağ filtresi',
        notes: 'Her 5000 km\'de bir yapılması önerilir',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fren Balata Değişimi',
        description: 'Ön ve arka fren balatalarının değişimi',
        category_id: 2,
        base_price: 800.00,
        estimated_duration: 90,
        required_parts: 'Fren balataları, fren hidroliği',
        notes: 'Fren balatalarının aşınma durumuna göre yapılır',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Motor Bakımı',
        description: 'Kapsamlı motor bakımı ve kontrolü',
        category_id: 1,
        base_price: 1200.00,
        estimated_duration: 180,
        required_parts: 'Çeşitli motor parçaları',
        notes: 'Yıllık bakım kapsamında yapılması önerilir',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Elektronik Sistem Kontrolü',
        description: 'Araç elektronik sistemlerinin kontrolü ve bakımı',
        category_id: 5,
        base_price: 600.00,
        estimated_duration: 120,
        required_parts: 'Gerekli elektronik parçalar',
        notes: 'Elektronik arıza durumunda yapılır',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('services', null, {});
  }
}; 