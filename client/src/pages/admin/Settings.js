import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  EventNote as EventNoteIcon,
  Notifications as NotificationsIcon,
  Sms as SmsIcon,
  Home as HomeIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { adminService } from '../../services/api';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imageLoading, setImageLoading] = useState({
    logo: false,
    favicon: false
  });
  const [imageError, setImageError] = useState({
    logo: false,
    favicon: false
  });
  const [settings, setSettings] = useState({
    business: {
      name: '',
      slogan: '',
      code: '',
      address: '',
      phone: '',
      email: '',
      taxOffice: '',
      taxNumber: '',
      website: ''
    },
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    appointmentSettings: {
      interval: 30,
      maxAppointmentsPerDay: 20,
      allowSameDayAppointments: true,
      requireConfirmation: true
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: true,
      reminderBeforeHours: 24
    },
    smsPackage: {
      name: '',
      quota: 0,
      expiry: ''
    },
    homepage: {
      title: '',
      description: '',
      keywords: '',
      logo: '',
      favicon: ''
    },
    homepageStats: {
      customers: 0,
      services: 0,
      experience: 0,
      mechanics: 0
    },
    homepageFeatures: {
      title: '',
      expert: {
        title: '',
        description: ''
      },
      speed: {
        title: '',
        description: ''
      },
      quality: {
        title: '',
        description: ''
      },
      price: {
        title: '',
        description: ''
      }
    },
    homepageCta: {
      title: '',
      description: ''
    },
    homepageFooter: {
      description: '',
      copyright: ''
    }
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSettings();

      // API yanıtını dönüştür
      const formattedSettings = {
        business: {
          name: response.data.business_name?.value || '',
          slogan: response.data.business_slogan?.value || '',
          code: response.data.business_code?.value || '',
          address: response.data.business_address?.value || '',
          phone: response.data.business_phone?.value || '',
          email: response.data.business_email?.value || '',
          taxOffice: response.data.business_tax_office?.value || '',
          taxNumber: response.data.business_tax_number?.value || '',
          website: response.data.business_website?.value || ''
        },
        workingHours: {
          start: response.data.working_hours_start?.value || '09:00',
          end: response.data.working_hours_end?.value || '18:00'
        },
        appointmentSettings: {
          interval: parseInt(response.data.appointment_interval?.value) || 30,
          maxAppointmentsPerDay: parseInt(response.data.max_daily_appointments?.value) || 20,
          allowSameDayAppointments: response.data.allow_same_day_appointments?.value === 'true',
          requireConfirmation: response.data.require_appointment_confirmation?.value === 'true'
        },
        notificationSettings: {
          emailNotifications: response.data.enable_email_notifications?.value === 'true',
          smsNotifications: response.data.enable_sms_notifications?.value === 'true',
          reminderBeforeHours: parseInt(response.data.reminder_hours?.value) || 24
        },
        smsPackage: {
          name: response.data.sms_package_name?.value || '',
          quota: parseInt(response.data.sms_package_quota?.value) || 0,
          expiry: response.data.sms_package_expiry?.value || ''
        },
        homepage: {
          title: response.data.homepage_title?.value || '',
          description: response.data.homepage_description?.value || '',
          keywords: response.data.homepage_keywords?.value || '',
          logo: response.data.homepage_logo?.value || '',
          favicon: response.data.homepage_favicon?.value || ''
        },
        homepageStats: {
          customers: parseInt(response.data.homepage_stats_customers?.value) || 0,
          services: parseInt(response.data.homepage_stats_services?.value) || 0,
          experience: parseInt(response.data.homepage_stats_experience?.value) || 0,
          mechanics: parseInt(response.data.homepage_stats_mechanics?.value) || 0
        },
        homepageFeatures: {
          title: response.data.homepage_feature_title?.value || '',
          expert: {
            title: response.data.homepage_feature_expert?.value || '',
            description: response.data.homepage_feature_expert_desc?.value || ''
          },
          speed: {
            title: response.data.homepage_feature_speed?.value || '',
            description: response.data.homepage_feature_speed_desc?.value || ''
          },
          quality: {
            title: response.data.homepage_feature_quality?.value || '',
            description: response.data.homepage_feature_quality_desc?.value || ''
          },
          price: {
            title: response.data.homepage_feature_price?.value || '',
            description: response.data.homepage_feature_price_desc?.value || ''
          }
        },
        homepageCta: {
          title: response.data.homepage_cta_title?.value || '',
          description: response.data.homepage_cta_description?.value || ''
        },
        homepageFooter: {
          description: response.data.homepage_footer_description?.value || '',
          copyright: response.data.homepage_footer_copyright?.value || ''
        }
      };

      setSettings(formattedSettings);
      setError(null);
    } catch (err) {
      setError('Ayarlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Ayarları API formatına dönüştür
      const apiSettings = {
        business_name: { value: settings.business.name, category: 'business', description: 'İşletme adı' },
        business_slogan: { value: settings.business.slogan, category: 'business', description: 'İşletme sloganı' },
        business_code: { value: settings.business.code, category: 'business', description: 'İşletme kodu' },
        business_address: { value: settings.business.address, category: 'business', description: 'İşletme adresi' },
        business_phone: { value: settings.business.phone, category: 'business', description: 'İşletme telefon numarası' },
        business_email: { value: settings.business.email, category: 'business', description: 'İşletme e-posta adresi' },
        business_tax_office: { value: settings.business.taxOffice, category: 'business', description: 'Vergi dairesi' },
        business_tax_number: { value: settings.business.taxNumber, category: 'business', description: 'Vergi numarası' },
        business_website: { value: settings.business.website, category: 'business', description: 'İşletme web sitesi' },
        working_hours_start: { value: settings.workingHours.start, category: 'working_hours', description: 'Çalışma saati başlangıcı' },
        working_hours_end: { value: settings.workingHours.end, category: 'working_hours', description: 'Çalışma saati bitişi' },
        appointment_interval: { value: settings.appointmentSettings.interval.toString(), category: 'appointment', description: 'Randevu aralığı (dakika)' },
        max_daily_appointments: { value: settings.appointmentSettings.maxAppointmentsPerDay.toString(), category: 'appointment', description: 'Günlük maksimum randevu' },
        allow_same_day_appointments: { value: settings.appointmentSettings.allowSameDayAppointments.toString(), category: 'appointment', description: 'Aynı gün randevu izni' },
        require_appointment_confirmation: { value: settings.appointmentSettings.requireConfirmation.toString(), category: 'appointment', description: 'Randevu onayı gerekli' },
        enable_email_notifications: { value: settings.notificationSettings.emailNotifications.toString(), category: 'notifications', description: 'E-posta bildirimleri' },
        enable_sms_notifications: { value: settings.notificationSettings.smsNotifications.toString(), category: 'notifications', description: 'SMS bildirimleri' },
        reminder_hours: { value: settings.notificationSettings.reminderBeforeHours.toString(), category: 'notifications', description: 'Hatırlatma süresi (saat)' },
        sms_package_name: { value: settings.smsPackage.name, category: 'sms', description: 'SMS paket adı' },
        sms_package_quota: { value: settings.smsPackage.quota.toString(), category: 'sms', description: 'SMS paket kotası' },
        sms_package_expiry: { value: settings.smsPackage.expiry, category: 'sms', description: 'SMS paket bitiş tarihi' },
        homepage_title: { value: settings.homepage.title, category: 'homepage', description: 'Anasayfa başlığı' },
        homepage_description: { value: settings.homepage.description, category: 'homepage', description: 'Anasayfa açıklaması' },
        homepage_keywords: { value: settings.homepage.keywords, category: 'homepage', description: 'Anahtar kelimeler' },
        homepage_logo: { value: settings.homepage.logo, category: 'homepage', description: 'Logo URL' },
        homepage_favicon: { value: settings.homepage.favicon, category: 'homepage', description: 'Favicon URL' },
        homepage_stats_customers: { value: settings.homepageStats.customers.toString(), category: 'homepage_stats', description: 'Mutlu müşteri sayısı' },
        homepage_stats_services: { value: settings.homepageStats.services.toString(), category: 'homepage_stats', description: 'Tamamlanan servis sayısı' },
        homepage_stats_experience: { value: settings.homepageStats.experience.toString(), category: 'homepage_stats', description: 'Yıllık deneyim' },
        homepage_stats_mechanics: { value: settings.homepageStats.mechanics.toString(), category: 'homepage_stats', description: 'Uzman mekanik sayısı' },
        homepage_feature_title: { value: settings.homepageFeatures.title, category: 'homepage_features', description: 'Özellikler başlığı' },
        homepage_feature_expert: { value: settings.homepageFeatures.expert.title, category: 'homepage_features', description: 'Uzman ekip başlığı' },
        homepage_feature_expert_desc: { value: settings.homepageFeatures.expert.description, category: 'homepage_features', description: 'Uzman ekip açıklaması' },
        homepage_feature_speed: { value: settings.homepageFeatures.speed.title, category: 'homepage_features', description: 'Hızlı servis başlığı' },
        homepage_feature_speed_desc: { value: settings.homepageFeatures.speed.description, category: 'homepage_features', description: 'Hızlı servis açıklaması' },
        homepage_feature_quality: { value: settings.homepageFeatures.quality.title, category: 'homepage_features', description: 'Kalite garantisi başlığı' },
        homepage_feature_quality_desc: { value: settings.homepageFeatures.quality.description, category: 'homepage_features', description: 'Kalite garantisi açıklaması' },
        homepage_feature_price: { value: settings.homepageFeatures.price.title, category: 'homepage_features', description: 'Uygun fiyatlar başlığı' },
        homepage_feature_price_desc: { value: settings.homepageFeatures.price.description, category: 'homepage_features', description: 'Uygun fiyatlar açıklaması' },
        homepage_cta_title: { value: settings.homepageCta.title, category: 'homepage_cta', description: 'CTA başlığı' },
        homepage_cta_description: { value: settings.homepageCta.description, category: 'homepage_cta', description: 'CTA açıklaması' },
        homepage_footer_description: { value: settings.homepageFooter.description, category: 'homepage_footer', description: 'Footer açıklaması' },
        homepage_footer_copyright: { value: settings.homepageFooter.copyright, category: 'homepage_footer', description: 'Telif hakkı metni' }
      };

      const response = await adminService.updateSettings(apiSettings);

      if (response.data.success) {
        setSuccess('Ayarlar başarıyla kaydedildi.');
        setError(null);
      } else {
        setError('Ayarlar kaydedilirken bir hata oluştu.');
        setSuccess(null);
      }
    } catch (err) {
      setError('Ayarlar kaydedilirken bir hata oluştu.');
      setSuccess(null);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: value
        }
      });

      // Favicon güncellendiğinde
      if (section === 'homepage' && field === 'favicon' && value) {
        // Global updateFavicon fonksiyonunu çağır
        if (window.updateFavicon) {
          // Önbelleği temizlemek için timestamp ekle
          const timestamp = new Date().getTime();
          const faviconUrl = value.includes('?') ? `${value}&t=${timestamp}` : `${value}?t=${timestamp}`;
          window.updateFavicon(faviconUrl);
        }
      }
    } else {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = async (type) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = type === 'logo' ? 'image/*' : '.ico,.png';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type); // Dosya tipini belirt

        try {
          const response = await adminService.uploadFile(formData);
          if (response.data.success) {
            const fileUrl = response.data.data.url;
            if (type === 'logo') {
              handleChange('homepage', 'logo', fileUrl);
            } else {
              handleChange('homepage', 'favicon', fileUrl);
              // Favicon yüklendiğinde hemen güncelle
              if (window.updateFavicon) {
                window.updateFavicon(fileUrl);
              }
            }
          }
        } catch (error) {
          setUploadError(error.response?.data?.message || 'Dosya yüklenirken bir hata oluştu');
        } finally {
          setUploading(false);
        }
      };

      input.click();
    } catch (error) {
      setUploadError('Dosya yüklenirken bir hata oluştu');
      setUploading(false);
    }
  };

  const handleRemoveFile = (type) => {
    if (type === 'logo') {
      handleChange('homepage', 'logo', '');
    } else {
      handleChange('homepage', 'favicon', '');
    }
  };

  const handleImageLoad = (type) => {
    setImageLoading(prev => ({ ...prev, [type]: false }));
    setImageError(prev => ({ ...prev, [type]: false }));
  };

  const handleImageError = (type) => {
    setImageLoading(prev => ({ ...prev, [type]: false }));
    setImageError(prev => ({ ...prev, [type]: true }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Sistem Ayarları
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<BusinessIcon />} label="İşletme Bilgileri" />
            <Tab icon={<AccessTimeIcon />} label="Çalışma Saatleri" />
            <Tab icon={<EventNoteIcon />} label="Randevu Ayarları" />
            <Tab icon={<NotificationsIcon />} label="Bildirim Ayarları" />
            <Tab icon={<SmsIcon />} label="SMS Paket Bilgileri" />
            <Tab icon={<HomeIcon />} label="Anasayfa Ayarları" />
            <Tab icon={<HomeIcon />} label="Anasayfa İstatistikleri" />
            <Tab icon={<HomeIcon />} label="Anasayfa Özellikleri" />
            <Tab icon={<HomeIcon />} label="Anasayfa CTA" />
            <Tab icon={<HomeIcon />} label="Footer Ayarları" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* İşletme Bilgileri */}
            {activeTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="İşletme Adı"
                    value={settings.business.name}
                    onChange={(e) => handleChange('business', 'name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="İşletme Sloganı"
                    value={settings.business.slogan}
                    onChange={(e) => handleChange('business', 'slogan', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="İşletme Kodu"
                    value={settings.business.code}
                    onChange={(e) => handleChange('business', 'code', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={settings.business.phone}
                    onChange={(e) => handleChange('business', 'phone', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="E-posta"
                    type="email"
                    value={settings.business.email}
                    onChange={(e) => handleChange('business', 'email', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Web Sitesi"
                    value={settings.business.website}
                    onChange={(e) => handleChange('business', 'website', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vergi Dairesi"
                    value={settings.business.taxOffice}
                    onChange={(e) => handleChange('business', 'taxOffice', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vergi Numarası"
                    value={settings.business.taxNumber}
                    onChange={(e) => handleChange('business', 'taxNumber', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adres"
                    multiline
                    rows={3}
                    value={settings.business.address}
                    onChange={(e) => handleChange('business', 'address', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            )}

            {/* Çalışma Saatleri */}
            {activeTab === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Başlangıç Saati"
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => handleChange('workingHours', 'start', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bitiş Saati"
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => handleChange('workingHours', 'end', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            )}

            {/* Randevu Ayarları */}
            {activeTab === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Randevu Aralığı (dk)"
                    type="number"
                    value={settings.appointmentSettings.interval}
                    onChange={(e) => handleChange('appointmentSettings', 'interval', parseInt(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Günlük Maksimum Randevu"
                    type="number"
                    value={settings.appointmentSettings.maxAppointmentsPerDay}
                    onChange={(e) => handleChange('appointmentSettings', 'maxAppointmentsPerDay', parseInt(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.appointmentSettings.allowSameDayAppointments}
                        onChange={(e) => handleChange('appointmentSettings', 'allowSameDayAppointments', e.target.checked)}
                      />
                    }
                    label="Aynı Gün Randevu İzni"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.appointmentSettings.requireConfirmation}
                        onChange={(e) => handleChange('appointmentSettings', 'requireConfirmation', e.target.checked)}
                      />
                    }
                    label="Randevu Onayı Gerekli"
                  />
                </Grid>
              </Grid>
            )}

            {/* Bildirim Ayarları */}
            {activeTab === 3 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notificationSettings.emailNotifications}
                        onChange={(e) => handleChange('notificationSettings', 'emailNotifications', e.target.checked)}
                      />
                    }
                    label="E-posta Bildirimleri"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notificationSettings.smsNotifications}
                        onChange={(e) => handleChange('notificationSettings', 'smsNotifications', e.target.checked)}
                      />
                    }
                    label="SMS Bildirimleri"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Hatırlatma Süresi (saat)"
                    type="number"
                    value={settings.notificationSettings.reminderBeforeHours}
                    onChange={(e) => handleChange('notificationSettings', 'reminderBeforeHours', parseInt(e.target.value))}
                    required
                  />
                </Grid>
              </Grid>
            )}

            {/* SMS Paket Bilgileri */}
            {activeTab === 4 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="SMS Paket Adı"
                    value={settings.smsPackage.name}
                    onChange={(e) => handleChange('smsPackage', 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="SMS Paket Kotası"
                    type="number"
                    value={settings.smsPackage.quota}
                    onChange={(e) => handleChange('smsPackage', 'quota', parseInt(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">SMS</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Paket Bitiş Tarihi"
                    type="date"
                    value={settings.smsPackage.expiry}
                    onChange={(e) => handleChange('smsPackage', 'expiry', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            )}

            {/* Anasayfa Ayarları */}
            {activeTab === 5 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Anasayfa Başlığı"
                    value={settings.homepage.title}
                    onChange={(e) => handleChange('homepage', 'title', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Anasayfa Açıklaması"
                    multiline
                    rows={3}
                    value={settings.homepage.description}
                    onChange={(e) => handleChange('homepage', 'description', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Anahtar Kelimeler"
                    value={settings.homepage.keywords}
                    onChange={(e) => handleChange('homepage', 'keywords', e.target.value)}
                    helperText="Virgülle ayırarak yazın"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Logo
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Logo URL"
                        value={settings.homepage.logo}
                        onChange={(e) => handleChange('homepage', 'logo', e.target.value)}
                        helperText="Logo dosyasının URL'sini girin veya yükleyin"
                        disabled={uploading}
                      />
                      <IconButton
                        color="primary"
                        onClick={() => handleFileUpload('logo')}
                        disabled={uploading}
                        title="Logo Yükle"
                      >
                        <UploadIcon />
                      </IconButton>
                      {settings.homepage.logo && (
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveFile('logo')}
                          disabled={uploading}
                          title="Logoyu Kaldır"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    {settings.homepage.logo && (
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Typography variant="caption" color="textSecondary" gutterBottom>
                          Logo Önizleme
                        </Typography>
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 120, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            borderRadius: 1,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          {imageLoading.logo && (
                            <CircularProgress size={24} />
                          )}
                          {!imageLoading.logo && (
                            <img
                              src={settings.homepage.logo}
                              alt="Logo Preview"
                              style={{ 
                                maxHeight: '100%', 
                                maxWidth: '100%', 
                                objectFit: 'contain',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                display: imageError.logo ? 'none' : 'block'
                              }}
                              onLoad={() => handleImageLoad('logo')}
                              onError={() => handleImageError('logo')}
                            />
                          )}
                          {imageError.logo && (
                            <Typography variant="caption" color="error">
                              Görüntü yüklenemedi
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Favicon
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Favicon URL"
                        value={settings.homepage.favicon}
                        onChange={(e) => handleChange('homepage', 'favicon', e.target.value)}
                        helperText="Favicon dosyasının URL'sini girin veya yükleyin"
                        disabled={uploading}
                      />
                      <IconButton
                        color="primary"
                        onClick={() => handleFileUpload('favicon')}
                        disabled={uploading}
                        title="Favicon Yükle"
                      >
                        <UploadIcon />
                      </IconButton>
                      {settings.homepage.favicon && (
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveFile('favicon')}
                          disabled={uploading}
                          title="Favicon'u Kaldır"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    {settings.homepage.favicon && (
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Typography variant="caption" color="textSecondary" gutterBottom>
                          Favicon Önizleme
                        </Typography>
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 120, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            borderRadius: 1,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          {imageLoading.favicon && (
                            <CircularProgress size={24} />
                          )}
                          {!imageLoading.favicon && (
                            <img
                              src={settings.homepage.favicon}
                              alt="Favicon Preview"
                              style={{ 
                                maxHeight: '100%', 
                                maxWidth: '100%', 
                                objectFit: 'contain',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                display: imageError.favicon ? 'none' : 'block'
                              }}
                              onLoad={() => handleImageLoad('favicon')}
                              onError={() => handleImageError('favicon')}
                            />
                          )}
                          {imageError.favicon && (
                            <Typography variant="caption" color="error">
                              Görüntü yüklenemedi
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Anasayfa İstatistikleri */}
            {activeTab === 6 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mutlu Müşteri Sayısı"
                    type="number"
                    value={settings.homepageStats.customers}
                    onChange={(e) => handleChange('homepageStats', 'customers', parseInt(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tamamlanan Servis Sayısı"
                    type="number"
                    value={settings.homepageStats.services}
                    onChange={(e) => handleChange('homepageStats', 'services', parseInt(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Yıllık Deneyim"
                    type="number"
                    value={settings.homepageStats.experience}
                    onChange={(e) => handleChange('homepageStats', 'experience', parseInt(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Uzman Mekanik Sayısı"
                    type="number"
                    value={settings.homepageStats.mechanics}
                    onChange={(e) => handleChange('homepageStats', 'mechanics', parseInt(e.target.value))}
                    required
                  />
                </Grid>
              </Grid>
            )}

            {/* Anasayfa Özellikleri */}
            {activeTab === 7 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Özellikler Başlığı"
                    value={settings.homepageFeatures.title}
                    onChange={(e) => handleChange('homepageFeatures', 'title', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Uzman Ekip
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Başlık"
                        value={settings.homepageFeatures.expert.title}
                        onChange={(e) => handleChange('homepageFeatures', 'expert', { ...settings.homepageFeatures.expert, title: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Açıklama"
                        multiline
                        rows={2}
                        value={settings.homepageFeatures.expert.description}
                        onChange={(e) => handleChange('homepageFeatures', 'expert', { ...settings.homepageFeatures.expert, description: e.target.value })}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Hızlı Servis
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Başlık"
                        value={settings.homepageFeatures.speed.title}
                        onChange={(e) => handleChange('homepageFeatures', 'speed', { ...settings.homepageFeatures.speed, title: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Açıklama"
                        multiline
                        rows={2}
                        value={settings.homepageFeatures.speed.description}
                        onChange={(e) => handleChange('homepageFeatures', 'speed', { ...settings.homepageFeatures.speed, description: e.target.value })}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Kalite Garantisi
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Başlık"
                        value={settings.homepageFeatures.quality.title}
                        onChange={(e) => handleChange('homepageFeatures', 'quality', { ...settings.homepageFeatures.quality, title: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Açıklama"
                        multiline
                        rows={2}
                        value={settings.homepageFeatures.quality.description}
                        onChange={(e) => handleChange('homepageFeatures', 'quality', { ...settings.homepageFeatures.quality, description: e.target.value })}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Uygun Fiyatlar
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Başlık"
                        value={settings.homepageFeatures.price.title}
                        onChange={(e) => handleChange('homepageFeatures', 'price', { ...settings.homepageFeatures.price, title: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Açıklama"
                        multiline
                        rows={2}
                        value={settings.homepageFeatures.price.description}
                        onChange={(e) => handleChange('homepageFeatures', 'price', { ...settings.homepageFeatures.price, description: e.target.value })}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {/* Anasayfa CTA */}
            {activeTab === 8 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CTA Başlığı"
                    value={settings.homepageCta.title}
                    onChange={(e) => handleChange('homepageCta', 'title', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CTA Açıklaması"
                    multiline
                    rows={2}
                    value={settings.homepageCta.description}
                    onChange={(e) => handleChange('homepageCta', 'description', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            )}

            {/* Footer Ayarları */}
            {activeTab === 9 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Footer Açıklaması"
                    multiline
                    rows={3}
                    value={settings.homepageFooter.description}
                    onChange={(e) => handleChange('homepageFooter', 'description', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telif Hakkı Metni"
                    value={settings.homepageFooter.copyright}
                    onChange={(e) => handleChange('homepageFooter', 'copyright', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </form>
    </Box>
  );
};

export default Settings; 