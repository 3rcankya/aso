const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'asoservice',
  process.env.DB_USER || 'asoservice_user',
  process.env.DB_PASS || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

// Veritabanı bağlantısını test et
sequelize.authenticate()
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı.');
  })
  .catch(err => {
    console.error('Veritabanına bağlanılamadı:', err);
  });

module.exports = sequelize; 