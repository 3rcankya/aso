import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material';
import {
  Search as SearchIcon,
  Event as EventIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  Payment as PaymentIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  BuildCircle as BuildCircleIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { publicService } from '../../services/api';

const AppointmentTracking = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [trackingNumber, setTrackingNumber] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trackingNumberFromUrl = params.get('trackingNumber');
    if (trackingNumberFromUrl) {
      setTrackingNumber(trackingNumberFromUrl);
      handleTrackingSearch(trackingNumberFromUrl);
    }
  }, [location.search]);

  const handleTrackingSearch = async (number) => {
    if (!number) {
      setError('Lütfen takip numarası giriniz');
      return;
    }

    setLoading(true);
    setError('');
    setAppointment(null);

    try {
      const response = await publicService.getAppointment(number);
      if (response.data.success) {
        setAppointment(response.data.data.appointment);
      } else {
        setError(response.data.message || 'Randevu bulunamadı');
      }
    } catch (error) {
      console.error('Randevu sorgulama hatası:', error);
      setError(error.response?.data?.message || 'Randevu sorgulanırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleTrackingSearch(trackingNumber);
  };

  const handleTrackingNumberChange = (e) => {
    const value = e.target.value.toUpperCase();
    setTrackingNumber(value);
    setError('');
    if (value) {
      navigate(`/appointment-tracking?trackingNumber=${value}`, { replace: true });
    } else {
      navigate('/appointment-tracking', { replace: true });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <PendingIcon />;
      case 'confirmed': return <CheckCircleIcon />;
      case 'in_progress': return <BuildCircleIcon />;
      case 'completed': return <CheckCircleIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Onay Bekliyor';
      case 'confirmed': return 'Onaylandı';
      case 'in_progress': return 'İşlemde';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: tr });
  };

  return (
    <Container maxWidth="md">
      <Fade in timeout={500}>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1
            }}
          >
            Randevu Takip
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Randevunuzun durumunu takip numarası ile sorgulayabilirsiniz
          </Typography>

          {error && (
            <Zoom in>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                {error}
              </Alert>
            </Zoom>
          )}

          <Card
            elevation={3}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
            }}
          >
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Randevu Takip Numarası"
                      value={trackingNumber}
                      onChange={handleTrackingNumberChange}
                      placeholder="Örn: ASO123456789"
                      required
                      error={!!error}
                      helperText={error || 'Randevu takip numaranızı giriniz'}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || !trackingNumber.trim()}
                      startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                      sx={{
                        height: '56px',
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 5px 8px 3px rgba(33, 150, 243, .4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? 'Sorgulanıyor...' : 'Randevu Sorgula'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {appointment && (
            <Zoom in timeout={500}>
              <Card
                elevation={3}
                sx={{
                  mt: 4,
                  borderRadius: 2,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
                }}
              >
                <CardContent>
                  <Stack spacing={3}>
                    {/* Durum Bilgisi */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Chip
                        icon={getStatusIcon(appointment.status)}
                        label={getStatusText(appointment.status)}
                        color={getStatusColor(appointment.status)}
                        sx={{
                          py: 2,
                          px: 3,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          '& .MuiChip-icon': { fontSize: '1.5rem' }
                        }}
                      />
                    </Box>

                    <Divider />

                    {/* Randevu Detayları */}
                    <Grid container spacing={3}>
                      {/* Sol Kolon - Temel Bilgiler */}
                      <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon color="primary" />
                            <Typography variant="body1">
                              <strong>Randevu Tarihi:</strong> {formatDate(appointment.appointmentDate)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="primary" />
                            <Typography variant="body1">
                              <strong>Müşteri:</strong> {appointment.customerName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CarIcon color="primary" />
                            <Typography variant="body1">
                              <strong>Araç:</strong> {appointment.vehicle.brand} {appointment.vehicle.model} ({appointment.vehicle.licensePlate})
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Sağ Kolon - Ödeme ve Servis Bilgileri */}
                      <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PaymentIcon color="primary" />
                            <Typography variant="body1">
                              <strong>Toplam Tutar:</strong> {formatCurrency(appointment.totalAmount)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BuildIcon color="primary" />
                            <Typography variant="body1">
                              <strong>Seçilen Servisler:</strong>
                            </Typography>
                          </Box>
                          <Box sx={{ pl: 4 }}>
                            {appointment.services.map((service, index) => (
                              <Typography key={index} variant="body2" color="text.secondary">
                                • {service.name} - {formatCurrency(service.price)}
                              </Typography>
                            ))}
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>

                    {/* Notlar */}
                    {appointment.notes && (
                      <>
                        <Divider />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Notlar:
                          </Typography>
                          <Typography variant="body2">
                            {appointment.notes}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Zoom>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default AppointmentTracking; 