import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Send as SendIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon
} from '@mui/icons-material';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { publicService } from '../../services/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const center = {
  lat: 41.0082, // İstanbul koordinatları
  lng: 28.9784
};

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [settings, setSettings] = useState({
    business: {
      name: '',
      phone: '',
      email: '',
      address: '',
      workingHours: {
        start: '',
        end: ''
      }
    }
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await publicService.getSettings();
        const data = response.data.data;

        setSettings({
          business: {
            name: data.business_name || '',
            phone: data.business_phone || '',
            email: data.business_email || '',
            address: data.business_address || '',
            workingHours: {
              start: data.working_hours_start || '09:00',
              end: data.working_hours_end || '18:00'
            }
          }
        });
      } catch (error) {
        console.error('Ayarlar yüklenirken hata oluştu:', error);
      }
    };

    fetchSettings();
  }, []);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await publicService.sendContactMessage(formData);
      setSuccess('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Mesaj gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: <WhatsAppIcon />, label: 'WhatsApp', href: `https://wa.me/${settings.business.phone?.replace(/\D/g, '')}` },
    { icon: <FacebookIcon />, label: 'Facebook', href: 'https://facebook.com/aso' },
    { icon: <InstagramIcon />, label: 'Instagram', href: 'https://instagram.com/aso' }
  ];

  return (
    <Container maxWidth="lg">
      <Fade in timeout={1000}>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              mb: 2
            }}
          >
            İletişim
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            paragraph
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Sorularınız için bizimle iletişime geçebilir veya sosyal medya hesaplarımızdan bize ulaşabilirsiniz
          </Typography>
        </Box>
      </Fade>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* İletişim Bilgileri */}
        <Box sx={{ flex: { md: '0 0 400px' } }}>
          <Zoom in timeout={1000} style={{ transitionDelay: '200ms' }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 3
                  }}
                >
                  İletişim Bilgileri
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                        color: 'white'
                      }}
                    >
                      <PhoneIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Telefon
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {settings.business.phone}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                        color: 'white'
                      }}
                    >
                      <EmailIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        E-posta
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {settings.business.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                        color: 'white'
                      }}
                    >
                      <LocationIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Adres
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {settings.business.address}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                        color: 'white'
                      }}
                    >
                      <TimeIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Çalışma Saatleri
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Pazartesi - Cumartesi: {settings.business.workingHours.start} - {settings.business.workingHours.end}<br />
                        Pazar: Kapalı
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Sosyal Medya
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {socialLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      color="primary"
                      startIcon={link.icon}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ flex: 1 }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Box>

        {/* İletişim Formu */}
        <Box sx={{ flex: 1 }}>
          <Zoom in timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                borderRadius: 2
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Bize Ulaşın
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Adınız Soyadınız"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-posta Adresiniz"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon Numaranız"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Konu"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mesajınız"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SendIcon />}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Gönder'}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </Paper>
          </Zoom>
        </Box>
      </Box>

      {/* Harita */}
      <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1871.3079029847518!2d40.173878093695095!3d37.92687431738359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2str!4v1748439486108!5m2!1sen!2str"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="İşletme Konumu"
        />
      </Box>
    </Container>
  );
};

export default Contact; 