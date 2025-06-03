import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  Build as BuildIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  DirectionsCar as CarIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { adminService } from '../../services/api';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', borderRadius: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            borderRadius: 2,
            p: 1,
            mr: 2,
            color: `${color}.main`
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalCustomers: 0,
    totalServices: 0,
    totalInventory: 0,
    totalMasters: 0,
    recentAppointments: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      console.log('API Response:', response);

      // API yanıtını doğru şekilde işle
      const dashboardData = {
        totalAppointments: response.data?.totalAppointments || 0,
        pendingAppointments: response.data?.pendingAppointments || 0,
        totalCustomers: response.data?.totalCustomers || 0,
        totalServices: response.data?.totalServices || 0,
        totalInventory: response.data?.inventory?.length || 0,
        totalMasters: response.data?.totalMasters || 0,
        recentAppointments: response.data?.recentAppointments || []
      };

      setStats(dashboardData);
      setError('');
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Tooltip title="Yenile">
          <IconButton onClick={fetchDashboardData} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="Toplam Randevu"
            value={stats?.totalAppointments || 0}
            icon={<EventNoteIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="Bekleyen Randevu"
            value={stats?.pendingAppointments || 0}
            icon={<WarningIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="Toplam Müşteri"
            value={stats?.totalCustomers || 0}
            icon={<PeopleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="Toplam Hizmet"
            value={stats?.totalServices || 0}
            icon={<BuildIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="Stok Ürünleri"
            value={stats?.totalInventory || 0}
            icon={<InventoryIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="Toplam Usta"
            value={stats?.totalMasters || 0}
            icon={<PeopleIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <EventNoteIcon sx={{ mr: 1 }} />
                Son Randevular
              </Typography>
              <List>
                {stats?.recentAppointments?.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemIcon>
                        {appointment.status === 'completed' ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <WarningIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={appointment.customerName}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {appointment.service.name}
                            </Typography>
                            {' — '}
                            {new Date(appointment.appointmentDate).toLocaleDateString('tr-TR')}
                          </>
                        }
                      />
                    </ListItem>
                    {index < stats.recentAppointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Hızlı İşlemler
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/admin/appointments')}
                    startIcon={<EventNoteIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Yeni Randevu
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/admin/inventory')}
                    startIcon={<InventoryIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Stok Ekle
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    onClick={() => navigate('/admin/services')}
                    startIcon={<BuildIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Hizmet Ekle
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 