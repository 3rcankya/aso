import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { adminService } from '../../services/api';

const Masters = () => {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'İsim alanı zorunludur';
    if (!formData.email.trim()) errors.email = 'E-posta alanı zorunludur';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Geçerli bir e-posta adresi giriniz';
    if (!formData.phone.trim()) errors.phone = 'Telefon alanı zorunludur';
    if (!formData.specialization.trim()) errors.specialization = 'Uzmanlık alanı zorunludur';
    if (!formData.experience) errors.experience = 'Deneyim alanı zorunludur';
    else if (isNaN(formData.experience) || formData.experience < 0) errors.experience = 'Geçerli bir deneyim süresi giriniz';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchMasters = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMechanics();
      setMasters(response.data.data.mechanics);
      setError(null);
    } catch (err) {
      setError('Ustalar yüklenirken bir hata oluştu.');
      setSnackbar({
        open: true,
        message: 'Ustalar yüklenirken bir hata oluştu.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  const handleOpenDialog = (master = null) => {
    if (master) {
      setSelectedMaster(master);
      setFormData({
        name: master.name,
        email: master.email,
        phone: master.phone,
        specialization: master.speciality,
        experience: master.experience,
        status: master.isActive ? 'active' : 'inactive'
      });
    } else {
      setSelectedMaster(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        status: 'active'
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMaster(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      status: 'active'
    });
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (selectedMaster) {
        await adminService.updateMaster(selectedMaster.id, formData);
        setSnackbar({
          open: true,
          message: 'Usta başarıyla güncellendi.',
          severity: 'success'
        });
      } else {
        await adminService.createMaster(formData);
        setSnackbar({
          open: true,
          message: 'Yeni usta başarıyla eklendi.',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchMasters();
    } catch (err) {
      setError('İşlem sırasında bir hata oluştu.');
      setSnackbar({
        open: true,
        message: 'İşlem sırasında bir hata oluştu.',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ustayı pasife almak istediğinizden emin misiniz?')) {
      try {
        await adminService.deleteMaster(id);
        setSnackbar({
          open: true,
          message: 'Usta başarıyla pasife alındı.',
          severity: 'success'
        });
        fetchMasters();
      } catch (err) {
        setError('Usta pasife alınırken bir hata oluştu.');
        setSnackbar({
          open: true,
          message: 'Usta pasife alınırken bir hata oluştu.',
          severity: 'error'
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'busy':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      case 'busy':
        return 'Meşgul';
      default:
        return status;
    }
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
          Usta Yönetimi
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchMasters}
            sx={{ mr: 1 }}
          >
            Yenile
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Yeni Usta
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usta</TableCell>
              <TableCell>İletişim</TableCell>
              <TableCell>Uzmanlık</TableCell>
              <TableCell>Deneyim</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {masters.map((master) => (
              <TableRow key={master.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="subtitle2">{master.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{master.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {master.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={master.speciality} size="small" />
                </TableCell>
                <TableCell>{master.experience} yıl</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(master.isActive ? 'active' : 'inactive')}
                    color={getStatusColor(master.isActive ? 'active' : 'inactive')}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Düzenle">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(master)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(master.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMaster ? 'Usta Düzenle' : 'Yeni Usta Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="İsim"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="E-posta"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Telefon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Uzmanlık Alanı"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  error={!!formErrors.specialization}
                  helperText={formErrors.specialization}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deneyim (Yıl)"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                  error={!!formErrors.experience}
                  helperText={formErrors.experience}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Durum</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Durum"
                  >
                    <MenuItem value="active">Aktif</MenuItem>
                    <MenuItem value="inactive">Pasif</MenuItem>
                    <MenuItem value="busy">Meşgul</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedMaster ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Masters; 