import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Speed, Group, Verified, AttachMoney } from '@mui/icons-material';
import car_service from '../../assets/images/car-service.png';
import { publicService } from '../../services/api';

const Home = () => {
  const [settings, setSettings] = useState({
    business: {
      name: '',
      slogan: ''
    },
    homepage: {
      title: '',
      description: '',
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
      expert: { title: '', description: '' },
      speed: { title: '', description: '' },
      quality: { title: '', description: '' },
      price: { title: '', description: '' }
    },
    homepageCta: {
      title: '',
      description: ''
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await publicService.getSettings();
        const data = response.data.data;

        setSettings({
          business: {
            name: data.business_name || '',
            slogan: data.business_slogan || ''
          },
          homepage: {
            title: data.homepage_title || '',
            description: data.homepage_description || '',
            logo: data.homepage_logo || '',
            favicon: data.homepage_favicon || ''
          },
          homepageStats: {
            customers: parseInt(data.homepage_stats_customers) || 0,
            services: parseInt(data.homepage_stats_services) || 0,
            experience: parseInt(data.homepage_stats_experience) || 0,
            mechanics: parseInt(data.homepage_stats_mechanics) || 0
          },
          homepageFeatures: {
            title: data.homepage_feature_title || '',
            expert: {
              title: data.homepage_feature_expert || '',
              description: data.homepage_feature_expert_desc || ''
            },
            speed: {
              title: data.homepage_feature_speed || '',
              description: data.homepage_feature_speed_desc || ''
            },
            quality: {
              title: data.homepage_feature_quality || '',
              description: data.homepage_feature_quality_desc || ''
            },
            price: {
              title: data.homepage_feature_price || '',
              description: data.homepage_feature_price_desc || ''
            }
          },
          homepageCta: {
            title: data.homepage_cta_title || '',
            description: data.homepage_cta_description || ''
          },
          homepageFooter: {
            description: data.homepage_footer_description || '',
            copyright: data.homepage_footer_copyright || ''
          }
        });
      } catch (error) {
        console.error('Ayarlar yüklenirken hata oluştu:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <Box>
      {/* Hero Section with Parallax Background */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 350, md: 500 },
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          mb: 8,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '120%',
            backgroundImage: `url(${car_service})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            zIndex: 0,
            transform: 'translateY(0)',
            transition: 'transform 0.5s ease-out',
            '&:hover': {
              transform: 'translateY(-20px)',
            },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(13, 71, 161, 0.8) 100%)',
            zIndex: 1
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animation: 'fadeInDown 1s ease-out'
            }}
          >
            {settings.business.name}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 1s ease-out 0.3s both'
            }}
          >
            {settings.business.slogan}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 1s ease-out 0.6s both'
            }}
          >
            {settings.homepage.description}
          </Typography>
          <Box sx={{ animation: 'fadeInUp 1s ease-out 0.9s both' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/appointment-booking"
              sx={{ mr: 2 }}
            >
              Hemen Randevu Al
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/services"
            >
              Hizmetlerimizi İncele
            </Button>
          </Box>
        </Container>
      </Box>

      {/* İstatistikler */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {settings.homepageStats.customers}+
              </Typography>
              <Typography variant="h6">Mutlu Müşteri</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {settings.homepageStats.services}+
              </Typography>
              <Typography variant="h6">Tamamlanan Servis</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {settings.homepageStats.experience}+
              </Typography>
              <Typography variant="h6">Yıllık Deneyim</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {settings.homepageStats.mechanics}+
              </Typography>
              <Typography variant="h6">Uzman Mekanik</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Randevuya Yönlendiren CTA */}
      <Box sx={{ bgcolor: 'primary.main', py: 6, color: 'white', textAlign: 'center', borderRadius: 3, my: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            {settings.homepageCta.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {settings.homepageCta.description}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/appointment-booking"
          >
            Randevu Al
          </Button>
        </Container>
      </Box>

      {/* Neden Bizi Seçmelisiniz */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 4, letterSpacing: 1, color: 'primary.main' }}>
            {settings.homepageFeatures.title || 'Neden Bizi Seçmelisiniz?'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'stretch',
              justifyContent: 'center',
              gap: { xs: 4, md: 4 },
              maxWidth: 1100,
              mx: 'auto',
            }}
          >
            {[
              {
                icon: <Group sx={{ fontSize: 56, color: 'primary.main' }} />,
                title: settings.homepageFeatures.expert.title || 'Uzman Ekip',
                desc: settings.homepageFeatures.expert.description || 'Deneyimli ve uzman ekibimizle en iyi hizmeti sunuyoruz.'
              },
              {
                icon: <Speed sx={{ fontSize: 56, color: 'primary.main' }} />,
                title: settings.homepageFeatures.speed.title || 'Hızlı Servis',
                desc: settings.homepageFeatures.speed.description || 'Zamanınızı değerli kılıyor, hızlı ve etkili çözümler sunuyoruz.'
              },
              {
                icon: <Verified sx={{ fontSize: 56, color: 'primary.main' }} />,
                title: settings.homepageFeatures.quality.title || 'Kalite Garantisi',
                desc: settings.homepageFeatures.quality.description || 'En yüksek kalite standartlarında hizmet garantisi veriyoruz.'
              },
              {
                icon: <AttachMoney sx={{ fontSize: 56, color: 'primary.main' }} />,
                title: settings.homepageFeatures.price.title || 'Uygun Fiyatlar',
                desc: settings.homepageFeatures.price.description || 'Rekabetçi fiyatlarla kaliteli hizmet sunuyoruz.'
              }
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: 1,
                  minWidth: 220,
                  maxWidth: 270,
                  bgcolor: 'white',
                  borderRadius: 4,
                  boxShadow: 3,
                  border: '1.5px solid',
                  borderColor: 'primary.100',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  px: { xs: 3, md: 4 },
                  py: { xs: 4, md: 5 },
                  mx: 'auto',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #fafdff 0%, #e3f0fc 100%)',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  '&:hover': {
                    boxShadow: 8,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    mb: 2,
                    bgcolor: 'primary.50',
                    boxShadow: 1,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: 22, color: 'primary.dark' }}>
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16, lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 