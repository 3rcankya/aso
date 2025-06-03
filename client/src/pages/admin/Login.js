import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { authService } from '../../services/api';
import logo from '../../assets/images/logo.png';

const AdminLogin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Token kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (token && userRole === 'admin' && userData.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

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

    try {
      const response = await authService.login(formData);

      if (response.data.success) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', response.data.data.token);
        // Kullanıcı rolünü localStorage'a kaydet
        if (response.data.data.user && response.data.data.user.role) {
          localStorage.setItem('userRole', response.data.data.user.role);
          localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        }

        // Admin veya usta rolü kontrolü
        if (response.data.data.user.role === 'admin' || response.data.data.user.role === 'mechanic') {
          navigate('/admin/dashboard');
        } else {
          setError('Bu sayfaya erişim yetkiniz yok');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userData');
        }
      } else {
        setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('E-posta veya şifre hatalı');
            break;
          case 404:
            setError('Kullanıcı bulunamadı');
            break;
          default:
            setError('Giriş yapılırken bir hata oluştu');
        }
      } else {
        setError('Sunucuya bağlanılamadı');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,rgb(36, 42, 104) 0%, #283593 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <Zoom in timeout={1000} style={{ transitionDelay: '200ms' }}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, sm: 6 },
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 4
                }}
              >
                <img
                  src={logo}
                  alt="ASO Logo"
                  style={{
                    width: '200px',
                    marginBottom: '1.5rem'
                  }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: '#1a237e',
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                  }}
                >
                  Yönetici Girişi
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{
                    mb: 3,
                    color: '#546e7a',
                    fontSize: '1rem'
                  }}
                >
                  Yönetim paneline erişmek için giriş yapın
                </Typography>
              </Box>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: '#ffebee',
                    color: '#c62828',
                    '& .MuiAlert-icon': {
                      color: '#c62828',
                      alignItems: 'center'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="E-posta"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      transition: 'all 0.3s ease-in-out',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(250, 250, 250, 0.9)',
                        '& fieldset': {
                          borderColor: 'rgba(36, 42, 104, 0.5)',
                          borderWidth: '1px'
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(250, 250, 250, 0.95)',
                        '& fieldset': {
                          borderColor: 'rgba(36, 42, 104, 0.7)',
                          borderWidth: '1px'
                        }
                      },
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease-in-out'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.5)',
                      transition: 'all 0.3s ease-in-out',
                      '&.Mui-focused': {
                        color: 'rgba(36, 42, 104, 0.7)',
                        fontWeight: 500
                      }
                    },
                    '& .MuiInputBase-input': {
                      padding: '14px 16px',
                      fontSize: '1rem',
                      color: 'rgba(0, 0, 0, 0.7)',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.3)',
                        opacity: 1
                      }
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Şifre"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: 'rgba(0, 0, 0, 0.4)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              color: 'rgba(36, 42, 104, 0.7)',
                              backgroundColor: 'rgba(36, 42, 104, 0.04)'
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      transition: 'all 0.3s ease-in-out',
                      backgroundColor: 'rgba(245, 245, 245, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(250, 250, 250, 0.9)',
                        '& fieldset': {
                          borderColor: 'rgba(36, 42, 104, 0.5)',
                          borderWidth: '1px'
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(250, 250, 250, 0.95)',
                        '& fieldset': {
                          borderColor: 'rgba(36, 42, 104, 0.7)',
                          borderWidth: '1px'
                        }
                      },
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease-in-out'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.5)',
                      transition: 'all 0.3s ease-in-out',
                      '&.Mui-focused': {
                        color: 'rgba(36, 42, 104, 0.7)',
                        fontWeight: 500
                      }
                    },
                    '& .MuiInputBase-input': {
                      padding: '14px 16px',
                      fontSize: '1rem',
                      color: 'rgba(0, 0, 0, 0.7)',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.3)',
                        opacity: 1
                      }
                    }
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                    boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 5px 8px 3px rgba(26, 35, 126, .4)',
                      background: 'linear-gradient(45deg, #283593 30%, #1a237e 90%)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>

              <Box
                sx={{
                  mt: 4,
                  textAlign: 'center'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    color: '#546e7a',
                    opacity: 0.8
                  }}
                >
                  © {new Date().getFullYear()} ASO. Tüm hakları saklıdır.
                </Typography>
              </Box>
            </Paper>
          </Zoom>
        </Fade>
      </Container>
    </Box>
  );
};

export default AdminLogin; 