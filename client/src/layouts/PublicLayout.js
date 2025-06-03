import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Grid, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import { publicService } from '../services/api';

const PublicLayout = () => {
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [settings, setSettings] = useState({
    business: {
      name: '',
      phone: '',
      email: '',
      address: '',
      logo: '',
      favicon: ''
    },
    homepage: {
      footer: {
        description: '',
        copyright: ''
      }
    }
  });

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
            logo: data.homepage_logo || '',
            favicon: data.homepage_favicon || ''
          },
          homepage: {
            footer: {
              description: data.homepage_footer_description || '',
              copyright: data.homepage_footer_copyright || ''
            }
          }
        });
      } catch (error) {
        console.error('Ayarlar yüklenirken hata oluştu:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold'
              }}
            >
              {settings.business.logo ? (
                <img 
                  src={settings.business.logo} 
                  alt={settings.business.name} 
                  style={{ height: '40px', marginLeft: '10px' }} 
                />
              ) : (
                settings.business.name
              )}
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button color="inherit" component={RouterLink} to="/">
                Ana Sayfa
              </Button>
              <Button color="inherit" component={RouterLink} to="/services">
                Hizmetlerimiz
              </Button>
              <Button color="inherit" component={RouterLink} to="/contact">
                İletişim
              </Button>
              <Button color="inherit" component={RouterLink} to="/appointment-booking">
                Randevu Al
              </Button>
              <Button color="inherit" component={RouterLink} to="/appointment-tracking">
                Randevu Sorgula
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMobileMenuClose}
      >
        <MenuItem component={RouterLink} to="/" onClick={handleMobileMenuClose}>
          Ana Sayfa
        </MenuItem>
        <MenuItem component={RouterLink} to="/services" onClick={handleMobileMenuClose}>
          Hizmetlerimiz
        </MenuItem>
        <MenuItem component={RouterLink} to="/contact" onClick={handleMobileMenuClose}>
          İletişim
        </MenuItem>
        <MenuItem component={RouterLink} to="/appointment-booking" onClick={handleMobileMenuClose}>
          Randevu Al
        </MenuItem>
        <MenuItem component={RouterLink} to="/appointment-tracking" onClick={handleMobileMenuClose}>
          Randevu Sorgula
        </MenuItem>
      </Menu>

      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>

      {/* Modern Footer */}
      <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'grey.100', mt: 'auto', pt: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="flex-start">
            {/* Logo & Açıklama */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {settings.business.logo ? (
                  <img 
                    src={settings.business.logo} 
                    alt={settings.business.name} 
                    style={{ height: '40px' }} 
                  />
                ) : (
                  settings.business.name
                )}
              </Typography>
              <Typography variant="body2" color="grey.300" sx={{ mb: 2 }}>
                {settings.homepage.footer.description}
              </Typography>
            </Grid>
            {/* Hızlı Linkler */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" color="white" sx={{ fontWeight: 600, mb: 1 }}>
                Hızlı Linkler
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link component={RouterLink} to="/" color="grey.200" underline="hover">Ana Sayfa</Link>
                <Link component={RouterLink} to="/services" color="grey.200" underline="hover">Hizmetlerimiz</Link>
                <Link component={RouterLink} to="/contact" color="grey.200" underline="hover">İletişim</Link>
                <Link component={RouterLink} to="/appointment-booking" color="grey.200" underline="hover">Randevu Al</Link>
                <Link component={RouterLink} to="/appointment-tracking" color="grey.200" underline="hover">Randevu Sorgula</Link>
                <Link component={RouterLink} to="/privacy" color="grey.400" underline="hover">Gizlilik Politikası</Link>
                <Link component={RouterLink} to="/terms" color="grey.400" underline="hover">Kullanım Koşulları</Link>
              </Box>
            </Grid>
            {/* İletişim Bilgileri */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" color="white" sx={{ fontWeight: 600, mb: 1 }}>
                İletişim
              </Typography>
              <Typography variant="body2" color="grey.200">
                Telefon: {settings.business.phone}
              </Typography>
              <Typography variant="body2" color="grey.200">
                E-posta: {settings.business.email}
              </Typography>
              <Typography variant="body2" color="grey.200">
                Adres: {settings.business.address}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ bgcolor: 'grey.800', my: 3 }} />
          <Box sx={{ textAlign: 'center', pb: 2 }}>
            <Typography variant="caption" color="grey.400">
              {settings.homepage.footer.copyright}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout; 