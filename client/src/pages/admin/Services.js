import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { adminService } from '../../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    estimatedDuration: '',
    categoryId: '',
    requiredParts: [],
    notes: ''
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await adminService.getServices();
      setServices(response.data.data.services);
      setError(null);
    } catch (err) {
      setError('Servisler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminService.getCategories();
      setCategories(response.data.filter(cat => cat.type === 'service'));
    } catch (err) {
      console.error('Kategoriler yüklenirken hata:', err);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await adminService.getInventory();
      const inventoryData = response.data.data.inventory || [];
      console.log('Inventory data:', inventoryData); // Debug log
      setInventory(inventoryData);
    } catch (err) {
      console.error('Envanter yüklenirken hata:', err);
      setInventory([]);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchInventory();
  }, []);

  const handleOpenDialog = (service = null) => {
    if (service) {
      console.log('Service data:', service); // Debug log
      const requiredParts = typeof service.requiredParts === 'string' 
        ? service.requiredParts.split(', ').filter(Boolean)
        : Array.isArray(service.requiredParts) 
          ? service.requiredParts 
          : [];

      setSelectedService(service);
      setFormData({
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        estimatedDuration: service.estimatedDuration,
        categoryId: service.categoryId,
        requiredParts: requiredParts,
        notes: service.notes || ''
      });
    } else {
      setSelectedService(null);
      setFormData({
        name: '',
        description: '',
        basePrice: '',
        estimatedDuration: '',
        categoryId: '',
        requiredParts: [],
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      estimatedDuration: '',
      categoryId: '',
      requiredParts: [],
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        requiredParts: Array.isArray(formData.requiredParts) 
          ? formData.requiredParts.join(', ')
          : formData.requiredParts
      };

      if (selectedService) {
        await adminService.updateService(selectedService.id, submitData);
      } else {
        await adminService.createService(submitData);
      }
      handleCloseDialog();
      fetchServices();
    } catch (err) {
      setError('İşlem sırasında bir hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu servisi silmek istediğinizden emin misiniz?')) {
      try {
        await adminService.deleteService(id);
        fetchServices();
      } catch (err) {
        setError('Servis silinirken bir hata oluştu.');
      }
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
          Servisler
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchServices}
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
            Yeni Servis
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
              <TableCell>Servis Adı</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Süre</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={categories.find(cat => cat.id === service.categoryId)?.name || service.category} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{service.basePrice} TL</TableCell>
                <TableCell>{service.estimatedDuration} dk</TableCell>
                <TableCell>
                  <Chip
                    label={service.isActive ? 'Aktif' : 'Pasif'}
                    color={service.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Düzenle">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(service.id)}
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
          {selectedService ? 'Servisi Düzenle' : 'Yeni Servis Ekle'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="Servis Adı"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Açıklama"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  label="Kategori"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Fiyat (TL)"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Süre (dk)"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                required
              />
              <Autocomplete
                multiple
                options={inventory}
                getOptionLabel={(option) => option.name}
                value={inventory.filter(item => 
                  formData.requiredParts.includes(item.name)
                )}
                onChange={(event, newValue) => {
                  console.log('Selected parts:', newValue); // Debug log
                  setFormData({
                    ...formData,
                    requiredParts: newValue.map(item => item.name)
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gerekli Parçalar"
                    placeholder="Parça seçin"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>{option.name}</Typography>
                      <Typography color="text.secondary">
                        {option.quantity} adet
                      </Typography>
                    </Box>
                  </li>
                )}
                isOptionEqualToValue={(option, value) => option.name === value.name}
              />
              <TextField
                fullWidth
                label="Notlar"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={2}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedService ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Services; 