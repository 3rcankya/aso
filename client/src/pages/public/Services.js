import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { publicService } from '../../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await publicService.getServices();
        setServices(response.data.data.services);
      } catch (error) {
        setError('Hizmetler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookAppointment = () => {
    navigate('/appointment-booking');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Hizmetlerimiz
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" paragraph>
          Profesyonel ekibimiz ve modern ekipmanlarımızla aracınıza en iyi hizmeti sunuyoruz
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item key={service.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" color="primary">
                    {service.basePrice} ₺
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tahmini Süre: {service.estimatedDuration} dakika
                  </Typography>
                </Box>
                {service.requiredParts && service.requiredParts.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Gerekli Parçalar:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {service.requiredParts.map((part, index) => (
                        <Chip
                          key={index}
                          label={part}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleBookAppointment}
                >
                  Randevu Al
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Özel Hizmetler
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Aracınız için özel bir hizmet mi arıyorsunuz? Bizimle iletişime geçin.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={handleBookAppointment}
        >
          Özel Hizmet Talebi Oluştur
        </Button>
      </Box>
    </Container>
  );
};

export default Services; 