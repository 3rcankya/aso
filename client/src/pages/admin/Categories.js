import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  InputAdornment,
  Chip,
  Snackbar,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Build as BuildIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { adminService } from '../../services/api';

const AdminCategories = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', type: 'service' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCategories();
      console.log(response.data);
      setCategories(response.data);
      setError('');
    } catch (err) {
      setError('Kategoriler yüklenirken bir hata oluştu');
      showSnackbar('Kategoriler yüklenirken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', type: 'service' });
    setFormError('');
    setOpenAddEditDialog(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      type: category.type || 'service'
    });
    setFormError('');
    setOpenAddEditDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        await adminService.deleteCategory(id);
        showSnackbar('Kategori başarıyla silindi');
        fetchCategories();
      } catch (err) {
        setError('Kategori silinirken bir hata oluştu');
        showSnackbar('Kategori silinirken bir hata oluştu', 'error');
        setLoading(false);
      }
    }
  };

  const handleDialogClose = () => {
    setOpenAddEditDialog(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', type: 'service' });
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formError) {
      setFormError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Kategori adı zorunludur');
      return false;
    }
    if (!formData.type) {
      setFormError('Kategori tipi zorunludur');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    setFormError('');
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
        showSnackbar('Kategori başarıyla güncellendi');
      } else {
        await adminService.createCategory(formData);
        showSnackbar('Yeni kategori başarıyla eklendi');
      }
      fetchCategories();
      handleDialogClose();
    } catch (err) {
      setFormError(err.response?.data?.message || 'İşlem başarısız oldu');
      showSnackbar(err.response?.data?.message || 'İşlem başarısız oldu', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || category.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon /> Kategori Yönetimi
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: isMobile ? '100%' : 250 }}
          />
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={(e, value) => value && setTypeFilter(value)}
            size="small"
          >
            <ToggleButton value="all">
              Tümü
            </ToggleButton>
            <ToggleButton value="service">
              <BuildIcon sx={{ mr: 1 }} /> Servis
            </ToggleButton>
            <ToggleButton value="inventory">
              <InventoryIcon sx={{ mr: 1 }} /> Envanter
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchCategories}
          >
            Yenile
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Yeni Kategori
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <List>
          {filteredCategories.map((category, index) => (
            <React.Fragment key={category.id}>
              <ListItem
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Chip
                        icon={category.type === 'service' ? <BuildIcon /> : <InventoryIcon />}
                        label={category.type === 'service' ? 'Servis' : 'Envanter'}
                        size="small"
                        color={category.type === 'service' ? 'primary' : 'secondary'}
                      />
                      <Chip
                        label={category.isActive ? 'Aktif' : 'Pasif'}
                        size="small"
                        color={category.isActive ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {category.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {category.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          ID: {category.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Oluşturulma: {new Date(category.created_at).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Düzenle">
                    <IconButton
                      edge="end"
                      onClick={() => handleEditClick(category)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteClick(category.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              {index < filteredCategories.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={openAddEditDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Kategori Adı"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            required
            error={!!formError && !formData.name}
            helperText={formError && !formData.name ? 'Kategori adı zorunludur' : ''}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Kategori Tipi</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleFormChange}
              label="Kategori Tipi"
              required
            >
              <MenuItem value="service">Servis</MenuItem>
              <MenuItem value="inventory">Envanter</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Açıklama (Opsiyonel)"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDialogClose} disabled={formLoading}>
            İptal
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={20} /> : null}
          >
            {editingCategory ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default AdminCategories; 