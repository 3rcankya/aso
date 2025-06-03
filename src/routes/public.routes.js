const express = require('express');
const router = express.Router();
const PublicController = require('../controllers/public.controller');
const { validateAppointment } = require('../middleware/validation');
const SettingsController = require('../controllers/settings.controller');

// Randevu oluşturma
router.post('/appointments', validateAppointment, PublicController.createAppointment);

// Randevu sorgulama
router.get('/appointments/:trackingNumber', PublicController.getAppointmentByTrackingNumber);

// Servis listesi
router.get('/services', PublicController.getServices);

// Araç markaları
router.get('/vehicle-brands', PublicController.getVehicleBrands);

// Usta listesi
router.get('/mechanics', PublicController.getMechanics);

// Settings routes
router.get('/settings', SettingsController.getPublicSettings);

module.exports = router; 