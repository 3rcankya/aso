import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  AlertTitle,
  Stack,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  FormHelperText
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr';
import { publicService } from '../../services/api';

import { vehicleTypes, vehicleBrands, vehicleModels, vehicleBrandTypes } from '../../constants/vehicleData';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const requestTypes = [
  'Araç Bırakma',
  'Yolda Destek',
  'Serviste Bekleme'
];

const steps = ['Müşteri Bilgileri', 'Araç Bilgileri', 'Servis Bilgileri', 'Onay'];

const AppointmentBooking = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleBrand: 'Diğer',
    vehicleModel: 'Diğer',
    vehicleType: 'Diğer',
    vehicleYear: new Date().getFullYear().toString(),
    licensePlate: '',
    mechanicId: '',
    description: 'Aracımın genel bakımını yaptırmak istiyorum. Motor yağı, yağ filtresi, hava filtresi ve diğer rutin kontrollerin yapılmasını talep ediyorum. Ayrıca varsa aracımda fark ettiğim anormal sesler veya performans sorunları hakkında bilgi vereceğim.'
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [serviceError, setServiceError] = useState('');
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openServiceDetails, setOpenServiceDetails] = useState(false);
  const [openTimeSlots, setOpenTimeSlots] = useState(false);
  const [appointmentDateTime, setAppointmentDateTime] = useState(() => {
    const now = new Date();
    if (now.getHours() >= 18) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow;
    }
    if (now.getHours() < 9) {
      now.setHours(9, 0, 0, 0);
      return now;
    }
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 30) * 30;
    now.setMinutes(roundedMinutes, 0, 0);
    return now;
  });

  // Ortak form elemanı stilleri
  const commonInputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all 0.2s ease-in-out',
      '&:hover fieldset': {
        borderColor: 'primary.main',
        borderWidth: '2px',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      '&.Mui-focused': {
        color: 'primary.main',
      },
    },
    '& .MuiInputBase-input': {
      padding: '12px 14px',
    },
  };

  const commonSelectStyles = {
    ...commonInputStyles,
    '& .MuiSelect-select': {
      padding: '12px 14px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
  };

  const commonFormControlStyles = {
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      '&.Mui-focused': {
        color: 'primary.main',
      },
    },
  };

  // Seçili markanın tipleri
  const typeList = formData.vehicleBrand ? (vehicleBrandTypes[formData.vehicleBrand] || []) : vehicleTypes;
  // Seçili marka+tipin modelleri
  const modelList = (formData.vehicleBrand && formData.vehicleType && vehicleModels[formData.vehicleBrand] && vehicleModels[formData.vehicleBrand][formData.vehicleType])
    ? vehicleModels[formData.vehicleBrand][formData.vehicleType]
    : [];

  // Çalışma saatleri
  const workingHours = {
    start: 9, // 09:00
    end: 18,  // 18:00
    interval: 30 // 30 dakikalık aralıklar
  };

  // Seçilen tarihe göre müsait zaman dilimlerini hesapla
  const calculateAvailableTimeSlots = (date) => {
    if (!date) return [];

    const slots = [];
    const startTime = new Date(date);
    startTime.setHours(workingHours.start, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(workingHours.end, 0, 0);

    while (startTime < endTime) {
      slots.push(new Date(startTime));
      startTime.setMinutes(startTime.getMinutes() + workingHours.interval);
    }

    return slots;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await publicService.getServices();
        setServices(response.data.data.services);
        
        // Find 'Diğer' service or use the first service
        const defaultService = response.data.data.services.find(service => service.name === 'Diğer') || 
                             response.data.data.services[0];
        
        if (defaultService) {
          setSelectedServices([defaultService]);
          setFormData(prev => ({
            ...prev,
            service: defaultService.id
          }));
        }
      } catch (error) {
        setError('Servisler yüklenirken bir hata oluştu');
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await publicService.getMechanics();
        console.log('Mechanics response:', response.data); // Debug log
        setMechanics(response.data.data.mechanics);
        // İlk mekaniği varsayılan olarak seç
        if (response.data.data.mechanics && response.data.data.mechanics.length > 0) {
          setSelectedMechanic(response.data.data.mechanics[0]);
          setFormData(prev => ({
            ...prev,
            mechanicId: response.data.data.mechanics[0].id
          }));
        }
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      }
    };
    fetchMechanics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'vehicleBrand' ? { vehicleType: '', vehicleModel: '' } : {}),
      ...(name === 'vehicleType' ? { vehicleModel: '' } : {})
    }));
  };

  // Saat seçimi için yardımcı fonksiyonlar
  const isTimeValid = (date) => {
    if (!date) return false;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours >= 9 && hours < 18 && minutes % 30 === 0;
  };

  const handleDateTimeChange = (newDateTime) => {
    if (!newDateTime) {
      setAppointmentDateTime(null);
      setFormErrors(prev => ({
        ...prev,
        appointmentDate: 'Lütfen bir tarih ve saat seçiniz'
      }));
      return;
    }

    // Seçilen tarihin saatini kontrol et
    const hours = newDateTime.getHours();
    const minutes = newDateTime.getMinutes();

    // Saat 09:00-18:00 arasında olmalı ve 30 dakikalık dilimlerde olmalı
    if (hours < 9 || hours >= 18 || minutes % 30 !== 0) {
      // En yakın uygun saate yuvarla
      const roundedDate = new Date(newDateTime);
      if (hours < 9) {
        roundedDate.setHours(9, 0, 0, 0);
      } else if (hours >= 18) {
        roundedDate.setHours(17, 30, 0, 0);
      } else {
        // 30 dakikalık dilimlere yuvarla
        const roundedMinutes = Math.round(minutes / 30) * 30;
        roundedDate.setMinutes(roundedMinutes, 0, 0);
      }
      newDateTime = roundedDate;
    }

    setAppointmentDateTime(newDateTime);
    setFormErrors(prev => ({
      ...prev,
      appointmentDate: ''
    }));
  };

  // Servis seçimi değiştiğinde
  const handleServiceChange = (event, newValue) => {
    setSelectedServices(newValue);
    setServiceError('');
  };

  // Usta seçimi için işleyiciyi güncelle
  const handleMechanicChange = (event) => {
    const selectedId = event.target.value;
    setFormData(prev => ({
      ...prev,
      mechanicId: selectedId
    }));
    setFormErrors(prev => ({
      ...prev,
      mechanicId: '' // Seçim yapıldığında hata mesajını temizle
    }));
  };

  // Adım validasyonlarını güncelle
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 0: // Müşteri Bilgileri
        if (!formData.customerName?.trim()) {
          errors.customerName = 'Ad Soyad alanı zorunludur';
        }
        if (!formData.customerPhone?.trim()) {
          errors.customerPhone = 'Telefon numarası zorunludur';
        } else if (!/^[0-9]{10,11}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
          errors.customerPhone = 'Geçerli bir telefon numarası giriniz';
        }
        if (!formData.customerEmail?.trim()) {
          errors.customerEmail = 'E-posta adresi zorunludur';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
          errors.customerEmail = 'Geçerli bir e-posta adresi giriniz';
        }
        break;

      case 1: // Araç Bilgileri
        if (!formData.vehicleBrand?.trim()) {
          errors.vehicleBrand = 'Araç markası zorunludur';
        }
        if (!formData.vehicleModel?.trim()) {
          errors.vehicleModel = 'Araç modeli zorunludur';
        }
        if (!formData.vehicleYear) {
          errors.vehicleYear = 'Araç yılı zorunludur';
        }
        if (!formData.licensePlate?.trim()) {
          errors.licensePlate = 'Plaka zorunludur';
        }
        break;

      case 2: // Servis ve Randevu Bilgileri
        if (!selectedServices.length) {
          errors.services = 'En az bir servis seçmelisiniz';
        }
        if (!formData.mechanicId) {
          errors.mechanicId = 'Usta seçimi zorunludur';
        }
        if (!appointmentDateTime) {
          errors.appointmentDate = 'Lütfen bir randevu tarihi ve saati seçiniz';
        } else if (!isTimeValid(appointmentDateTime)) {
          errors.appointmentDate = 'Randevu saati 09:00-18:00 arasında ve 30 dakikalık dilimlerde olmalıdır';
        }
        break;

      default:
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // İleri butonu işleyicisini güncelle
  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
        setError(''); // Adım değiştiğinde hata mesajını temizle
      }
    } else {
      // Validasyon hatalarını göster
      const errorMessages = Object.values(formErrors).filter(Boolean);
      if (errorMessages.length > 0) {
        setError(errorMessages.join('\n'));
      }
    }
  };

  // Geri butonu işleyicisini güncelle
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(''); // Adım değiştiğinde hata mesajını temizle
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const selectedMechanic = mechanics.find(m => m.id === formData.mechanicId);
      if (!selectedMechanic) {
        throw new Error('Lütfen bir usta seçiniz');
      }

      const appointmentData = {
        ...formData,
        mechanicId: { id: selectedMechanic.id },
        services: selectedServices.map(service => service.id),
        appointmentDate: appointmentDateTime
      };

      const response = await publicService.createAppointment(appointmentData);

      if (response.data.success) {
        setSuccess(true);
        const trackingNumber = response.data.data.appointment.trackingNumber;
        setTrackingNumber(trackingNumber);

        // 2 saniye sonra randevu sorgulama sayfasına yönlendir
        setTimeout(() => {
          // Form verilerini sıfırla
          setFormData({
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            vehicleBrand: 'Toyota',
            vehicleModel: 'Corolla',
            vehicleType: 'Sedan',
            vehicleYear: new Date().getFullYear().toString(),
            licensePlate: '',
            mechanicId: '',
            description: ''
          });
          setSelectedServices([]);
          setAppointmentDateTime(null);
          navigate(`/appointment-tracking?trackingNumber=${trackingNumber}`);
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Randevu özeti için tarih formatını düzenle
  const formatAppointmentDateTime = (date) => {
    if (!date) return '';
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Adım içeriğini render et
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Müşteri Bilgileri
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ad Soyad"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  error={!!formErrors.customerName}
                  helperText={formErrors.customerName}
                  required
                  sx={commonInputStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefon"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  error={!!formErrors.customerPhone}
                  helperText={formErrors.customerPhone}
                  required
                  sx={commonInputStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-posta"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  error={!!formErrors.customerEmail}
                  helperText={formErrors.customerEmail}
                  required
                  sx={commonInputStyles}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Araç Bilgileri
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.vehicleBrand} sx={commonFormControlStyles}>
                  <InputLabel>Marka</InputLabel>
                  <Select
                    name="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={handleChange}
                    label="Marka"
                    sx={commonSelectStyles}
                    required
                  >
                    {vehicleBrands.map((brand) => (
                      <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.vehicleBrand && (
                    <FormHelperText>{formErrors.vehicleBrand}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.vehicleType} sx={commonFormControlStyles}>
                  <InputLabel>Tip</InputLabel>
                  <Select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    label="Tip"
                    sx={commonSelectStyles}
                    required
                  >
                    {typeList.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.vehicleType && (
                    <FormHelperText>{formErrors.vehicleType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.vehicleModel} sx={commonFormControlStyles}>
                  <InputLabel>Model</InputLabel>
                  <Select
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    label="Model"
                    sx={commonSelectStyles}
                    required
                  >
                    {modelList.map((model) => (
                      <MenuItem key={model} value={model}>{model}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.vehicleModel && (
                    <FormHelperText>{formErrors.vehicleModel}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.vehicleYear} sx={commonFormControlStyles}>
                  <InputLabel>Yıl</InputLabel>
                  <Select
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleChange}
                    label="Yıl"
                    sx={commonSelectStyles}
                    required
                  >
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.vehicleYear && (
                    <FormHelperText>{formErrors.vehicleYear}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Plaka"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  error={!!formErrors.licensePlate}
                  helperText={formErrors.licensePlate}
                  sx={commonInputStyles}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Servis ve Randevu Bilgileri
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={services}
                  getOptionLabel={(option) => option.name}
                  value={selectedServices}
                  onChange={handleServiceChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Servisler"
                      error={!!formErrors.services}
                      helperText={formErrors.services || 'Birden fazla servis seçebilirsiniz'}
                      required
                      sx={commonInputStyles}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={!!formErrors.mechanicId}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                >
                  <InputLabel id="mechanic-select-label">Usta</InputLabel>
                  <Select
                    labelId="mechanic-select-label"
                    id="mechanic-select"
                    value={formData.mechanicId}
                    onChange={handleMechanicChange}
                    label="Usta"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 224,
                        },
                      },
                    }}
                  >
                    {mechanics.map((mechanic) => (
                      <MenuItem key={mechanic.id} value={mechanic.id}>
                        {mechanic.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.mechanicId && (
                    <FormHelperText error>{formErrors.mechanicId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                  <DateTimePicker
                    label="Randevu Tarihi ve Saati"
                    value={appointmentDateTime}
                    onChange={handleDateTimeChange}
                    minDateTime={new Date()}
                    maxDateTime={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                    shouldDisableTime={(dateValue, viewType) => {
                      if (viewType === 'hours') {
                        const hours = dateValue.getHours();
                        return hours < 9 || hours >= 18;
                      }
                      if (viewType === 'minutes') {
                        const minutes = dateValue.getMinutes();
                        return minutes % 30 !== 0;
                      }
                      return false;
                    }}
                    minutesStep={30}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!formErrors.appointmentDate,
                        helperText: formErrors.appointmentDate || 'Randevu saati 09:00-18:00 arasında ve 30 dakikalık dilimlerde olmalıdır',
                        required: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Açıklama"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  sx={commonInputStyles}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Randevu Özeti
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Müşteri Bilgileri
                    </Typography>
                    <Typography>Ad Soyad: {formData.customerName}</Typography>
                    <Typography>Telefon: {formData.customerPhone}</Typography>
                    <Typography>E-posta: {formData.customerEmail}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                      Araç Bilgileri
                    </Typography>
                    <Typography>
                      {formData.vehicleBrand} {formData.vehicleModel} ({formData.vehicleYear})
                    </Typography>
                    <Typography>Plaka: {formData.licensePlate}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                      Servis Bilgileri
                    </Typography>
                    {selectedServices.map((service) => (
                      <Typography key={service.id}>• {service.name}</Typography>
                    ))}
                    <Typography>Usta: {selectedMechanic?.name}</Typography>
                    <Typography>
                      Tarih ve Saat
                    </Typography>
                    <Typography>
                      {formatAppointmentDateTime(appointmentDateTime)}
                    </Typography>

                    {formData.description && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                          Açıklama
                        </Typography>
                        <Typography>{formData.description}</Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  // Servis detayları dialog'u
  const renderServiceDetailsDialog = () => (
    <Dialog
      open={openServiceDetails}
      onClose={() => setOpenServiceDetails(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Servis Detayları
        </Typography>
      </DialogTitle>
      <DialogContent>
        {selectedServices.map((service) => (
          <Box sx={{ mt: 2 }} key={service.id}>
            <Typography variant="h6" gutterBottom>
              {service.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {service.description}
            </Typography>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Fiyat: {service.basePrice} ₺
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tahmini Süre: {service.estimatedDuration} dakika
            </Typography>
            {service.requiredParts && service.requiredParts.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Gerekli Parçalar:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {service.requiredParts.map((part, index) => (
                    <Chip
                      key={`part-${index}`}
                      label={part}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenServiceDetails(false)}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );

  // Zaman dilimleri dialog'u
  const renderTimeSlotsDialog = () => (
    <Dialog
      open={openTimeSlots}
      onClose={() => setOpenTimeSlots(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Müsait Saatler
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: trLocale })}
          </Typography>
          <Grid container spacing={1}>
            {availableTimeSlots.map((time, index) => (
              <Grid item xs={4} key={`time-${index}`}>
                <Button
                  fullWidth
                  variant={formData.appointmentTime === time ? "contained" : "outlined"}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, appointmentTime: time }));
                    setOpenTimeSlots(false);
                  }}
                  sx={{ mb: 1 }}
                >
                  {format(time, 'HH:mm')}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenTimeSlots(false)}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );

  // Başarı mesajını güncelle
  const renderSuccessMessage = () => (
    <Box sx={{ mt: 3, p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
      <Typography variant="h6" color="success.dark" gutterBottom>
        Randevu Başarıyla Oluşturuldu!
      </Typography>
      <Typography variant="body1" color="success.dark" paragraph>
        Randevu detaylarınız aşağıdaki gibidir:
      </Typography>
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Randevu Bilgileri
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Takip Numarası:</strong> {trackingNumber}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Tarih ve Saat:</strong> {formatAppointmentDateTime(appointmentDateTime)}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Durum:</strong> Beklemede
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Müşteri Bilgileri
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Ad Soyad:</strong> {formData.customerName}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Telefon:</strong> {formData.customerPhone}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>E-posta:</strong> {formData.customerEmail}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Araç Bilgileri
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Marka:</strong> {formData.vehicleBrand}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Model:</strong> {formData.vehicleModel}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Yıl:</strong> {formData.vehicleYear}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Plaka:</strong> {formData.licensePlate}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Seçilen Servisler
            </Typography>
            {selectedServices.map((service, index) => (
              <Typography key={index} variant="body2" paragraph>
                • {service.name} - {service.basePrice} ₺
              </Typography>
            ))}
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              Toplam Tutar: {selectedServices.reduce((sum, service) => sum + parseFloat(service.basePrice), 0)} ₺
            </Typography>
          </Grid>

          {formData.mechanicId && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Seçilen Usta
              </Typography>
              <Typography variant="body2" paragraph>
                {mechanics.find(m => m.id === formData.mechanicId.id)?.name}
              </Typography>
            </Grid>
          )}

          {formData.description && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Notlar
              </Typography>
              <Typography variant="body2" paragraph>
                {formData.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      <Typography variant="body1" color="success.dark" sx={{ mt: 2 }}>
        Randevu takip sayfasına yönlendiriliyorsunuz...
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Randevu Oluştur
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" paragraph>
          Aracınız için randevu oluşturmak için aşağıdaki adımları takip edin
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                whiteSpace: 'pre-line', // Satır sonlarını koru
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            renderSuccessMessage()
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Geri
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Randevu Oluştur'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  İleri
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Paper>
      {renderServiceDetailsDialog()}
      {renderTimeSlotsDialog()}
    </Container>
  );
};

export default AppointmentBooking; 