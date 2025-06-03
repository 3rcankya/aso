import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  CardContent,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  EventNote as EventNoteIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { adminService } from '../../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr';
import { useTheme, useMediaQuery } from '@mui/material';
import { vehicleBrands, vehicleTypes, vehicleBrandTypes, vehicleModels } from '../../constants/vehicleData';

const Appointments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    date: '',
    dateRange: [null, null],
    mechanic: '',
    customer: '',
    vehicle: ''
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: null,
    appointmentTime: null,
    description: '',
    notes: ''
  });
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    type: 'sedan'
  });
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAppointments(filters);
      setAppointments(response.data.data.appointments);
      setError('');
    } catch (err) {
      setError('Randevular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersRes, vehiclesRes, servicesRes, mechanicsRes] = await Promise.all([
          adminService.getCustomers(),
          adminService.getVehicles(),
          adminService.getServices(),
          adminService.getMechanics()
        ]);

        setCustomers(customersRes.data.data.customers || []);
        setVehicles(vehiclesRes.data.data.vehicles || []);
        setServices(servicesRes.data.data.services || []);
        setMechanics(mechanicsRes.data.data.mechanics || []);
        setError('');
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    console.log("asdasdas", vehicles)
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateAppointmentStatus(id, newStatus);
      fetchAppointments();
      setSuccess('Randevu durumu güncellendi');
    } catch (err) {
      setError('Durum güncellenirken bir hata oluştu');
    }
  };

  const handleEditAppointment = async () => {
    try {
      const appointmentDateTime = new Date(selectedAppointment.appointmentDate);
      if (selectedAppointment.appointmentTime) {
        appointmentDateTime.setHours(
          selectedAppointment.appointmentTime.getHours(),
          selectedAppointment.appointmentTime.getMinutes()
        );
      }

      const serviceIds = selectedAppointment.services?.map(service => service.id) || [];

      await adminService.updateAppointment(selectedAppointment.id, {
        customerId: selectedAppointment.customer.id,
        vehicleId: selectedAppointment.vehicle.id,
        serviceIds: serviceIds,
        appointmentDate: appointmentDateTime,
        description: selectedAppointment.description,
        notes: selectedAppointment.notes,
        status: selectedAppointment.status
      });

      setEditDialogOpen(false);
      fetchAppointments();
      setSuccess('Randevu güncellendi');
    } catch (error) {
      console.error('Randevu güncelleme hatası:', error);
      setError('Randevu güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      try {
        await adminService.deleteAppointment(id);
        fetchAppointments();
      } catch (err) {
        setError('Randevu silinirken bir hata oluştu');
      }
    }
  };

  const handleViewDetails = (appointment) => {
    const formattedAppointment = {
      ...appointment,
      services: appointment.services || []
    };
    setSelectedAppointment(formattedAppointment);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'confirmed':
        return 'Onaylandı';
      case 'in_progress':
        return 'İşlemde';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      const appointmentDateTime = new Date(newAppointment.appointmentDate);
      appointmentDateTime.setHours(
        newAppointment.appointmentTime.getHours(),
        newAppointment.appointmentTime.getMinutes()
      );

      const appointmentData = {
        customerId: selectedCustomer.id,
        vehicleId: selectedVehicle.id,
        serviceIds: selectedServices.map(service => service.id),
        mechanicId: selectedMechanic?.id,
        appointmentDate: appointmentDateTime,
        description: newAppointment.description,
        notes: newAppointment.notes
      };

      await adminService.createAppointment(appointmentData);
      setCreateDialogOpen(false);
      fetchAppointments();
      resetForm();
      setSuccess('Randevu başarıyla oluşturuldu');
    } catch (error) {
      console.error('Randevu oluşturma hatası:', error);
      setError('Randevu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewCustomer = async () => {
    try {
      const response = await adminService.createCustomer(newCustomer);
      setCustomers([...customers, response.data.data.customer]);
      setSelectedCustomer(response.data.data.customer);
      setShowNewCustomerForm(false);
      setNewCustomer({ name: '', phone: '', email: '' });
    } catch (error) {
      setError('Müşteri oluşturulurken bir hata oluştu');
    }
  };

  const handleCreateNewVehicle = async () => {
    try {
      const vehicleData = {
        ...newVehicle,
        brand: selectedBrand,
        type: selectedType,
        model: selectedModel
      };

      const response = await adminService.createVehicle(vehicleData);
      const createdVehicle = response.data.data.vehicle;
      setVehicles([...vehicles, createdVehicle]);
      setSelectedVehicle(createdVehicle);
      setShowNewVehicleForm(false);
      setNewVehicle({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        type: 'sedan'
      });
      setSelectedBrand('');
      setSelectedType('');
      setSelectedModel('');
    } catch (error) {
      setError('Araç oluşturulurken bir hata oluştu');
    }
  };

  const resetForm = () => {
    setNewAppointment({
      appointmentDate: null,
      appointmentTime: null,
      description: '',
      notes: ''
    });
    setNewCustomer({
      name: '',
      phone: '',
      email: ''
    });
    setNewVehicle({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      type: 'sedan'
    });
    setSelectedCustomer(null);
    setSelectedVehicle(null);
    setSelectedServices([]);
    setSelectedMechanic(null);
    setShowNewCustomerForm(false);
    setShowNewVehicleForm(false);
    setSelectedBrand('');
    setSelectedType('');
    setSelectedModel('');
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSelectedType('');
    setSelectedModel('');
    setAvailableTypes(vehicleBrandTypes[brand] || []);
    setAvailableModels([]);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSelectedModel('');
    setAvailableModels(vehicleModels[selectedBrand]?.[type] || []);
  };

  // Filtreleme fonksiyonu
  const filterAppointments = (appointments) => {
    return appointments.filter(appointment => {
      // Durum filtresi
      if (filters.status && appointment.status !== filters.status) {
        return false;
      }

      // Tarih filtresi
      if (filters.date) {
        const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('tr-TR');
        const filterDate = new Date(filters.date).toLocaleDateString('tr-TR');
        if (appointmentDate !== filterDate) {
          return false;
        }
      }

      // Arama filtresi (müşteri adı, telefon, plaka, takip no)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const customerName = appointment.customer?.name?.toLowerCase() || '';
        const customerPhone = appointment.customer?.phone?.toLowerCase() || '';
        const licensePlate = appointment.vehicle?.licensePlate?.toLowerCase() || '';
        const trackingNumber = appointment.trackingNumber?.toLowerCase() || '';
        const appointmentDate = appointment.appointmentDate?.toLowerCase() || '';
        const appointmentTime = appointment.appointmentTime?.toLowerCase() || '';
        const vehicleBrand = appointment.vehicle?.brand?.toLowerCase() || '';
        const vehicleModel = appointment.vehicle?.model?.toLowerCase() || '';
        const mechanicName = appointment.mechanic?.name?.toLowerCase() || '';


        if (!customerName.includes(searchLower) &&
          !customerPhone.includes(searchLower) &&
          !licensePlate.includes(searchLower) &&
          !trackingNumber.includes(searchLower) &&
          !appointmentDate.includes(searchLower) &&
          !appointmentTime.includes(searchLower) &&
          !vehicleBrand.includes(searchLower) &&
          !vehicleModel.includes(searchLower) &&
          !mechanicName.includes(searchLower)) {
          return false;
        }
      }

      // Usta filtresi
      if (filters.mechanic && appointment.mechanic?.id !== filters.mechanic) {
        return false;
      }

      // Müşteri filtresi
      if (filters.customer && appointment.customer?.id !== filters.customer) {
        return false;
      }

      // Araç filtresi
      if (filters.vehicle && appointment.vehicle?.id !== filters.vehicle) {
        return false;
      }

      return true;
    });
  };

  // Filtrelenmiş randevular
  const filteredAppointments = useMemo(() => {
    return filterAppointments(appointments);
  }, [appointments, filters]);

  // Responsive column definitions
  const getColumns = () => {
    const baseColumns = [
      {
        field: 'trackingNumber',
        headerName: 'Takip No',
        width: isMobile ? 80 : 100,
        flex: isMobile ? 0.3 : 0.5,
        minWidth: isMobile ? 80 : 100
      },
      {
        field: 'customer',
        headerName: 'Müşteri',
        width: isMobile ? 100 : 150,
        flex: isMobile ? 0.8 : 1,
        minWidth: isMobile ? 100 : 150,
        valueGetter: (params) => params.row.customer?.name || '-'
      },
      {
        field: 'customerPhone',
        headerName: 'Tel',
        width: isMobile ? 80 : 100,
        flex: isMobile ? 0.5 : 0.8,
        minWidth: isMobile ? 80 : 100,
        valueGetter: (params) => params.row.customer?.phone || '-',
        hide: isMobile
      },
      {
        field: 'vehicle',
        headerName: 'Araç',
        width: isMobile ? 100 : 150,
        flex: isMobile ? 0.8 : 1,
        minWidth: isMobile ? 100 : 150,
        valueGetter: (params) => `${params.row.vehicle?.brand || ''} ${params.row.vehicle?.model || ''}`
      },
      {
        field: 'licensePlate',
        headerName: 'Plaka',
        width: isMobile ? 70 : 90,
        flex: isMobile ? 0.4 : 0.6,
        minWidth: isMobile ? 70 : 90,
        valueGetter: (params) => params.row.vehicle?.licensePlate || '-'
      },
      {
        field: 'mechanic',
        headerName: 'Teknisyen',
        width: isMobile ? 80 : 120,
        flex: isMobile ? 0.6 : 0.8,
        minWidth: isMobile ? 80 : 120,
        valueGetter: (params) => params.row.mechanic?.name || '-',
        hide: isMobile
      },
      {
        field: 'appointmentDate',
        headerName: 'Tarih',
        width: isMobile ? 100 : 150,
        flex: isMobile ? 0.8 : 1,
        minWidth: isMobile ? 100 : 150,
        valueGetter: (params) => new Date(params.row.appointmentDate).toLocaleString('tr-TR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        hide: isTablet
      },
      {
        field: 'appointmentTime',
        headerName: 'Saat',
        width: isMobile ? 100 : 150,
        flex: isMobile ? 0.8 : 1,
        minWidth: isMobile ? 100 : 150,
        valueGetter: (params) => new Date(params.row.appointmentDate).toLocaleString('tr-TR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        hide: isTablet
      },
      {
        field: 'status',
        headerName: 'Durum',
        width: isMobile ? 80 : 100,
        flex: isMobile ? 0.5 : 0.7,
        minWidth: isMobile ? 80 : 100,
        renderCell: (params) => (
          <Chip
            label={getStatusText(params.value)}
            color={getStatusColor(params.value)}
            size="small"
            sx={{
              minWidth: isMobile ? '60px' : '80px',
              '& .MuiChip-label': {
                px: isMobile ? 0.5 : 1,
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }
            }}
          />
        )
      },
      {
        field: 'paymentStatus',
        headerName: 'Ödeme',
        width: isMobile ? 70 : 90,
        flex: isMobile ? 0.4 : 0.6,
        minWidth: isMobile ? 70 : 90,
        renderCell: (params) => (
          <Chip
            label={params.value === 'pending' ? 'Bekliyor' : params.value === 'partial' ? 'Kısmi' : 'Ödendi'}
            color={params.value === 'paid' ? 'success' : params.value === 'partial' ? 'warning' : 'error'}
            size="small"
            sx={{
              minWidth: isMobile ? '60px' : '80px',
              '& .MuiChip-label': {
                px: isMobile ? 0.5 : 1,
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }
            }}
          />
        ),
        hide: isTablet
      },
      {
        field: 'totalAmount',
        headerName: 'Tutar',
        width: isMobile ? 70 : 90,
        flex: isMobile ? 0.4 : 0.6,
        minWidth: isMobile ? 70 : 90,
        valueGetter: (params) => `${params.row.totalAmount} ₺`,
        hide: isTablet
      },
      {
        field: 'actions',
        headerName: 'İşlemler',
        width: isMobile ? 100 : 150,
        flex: isMobile ? 0.8 : 1,
        minWidth: isMobile ? 100 : 150,
        renderCell: (params) => (
          <Box sx={{
            display: 'flex',
            gap: isMobile ? 0.25 : 0.5,
            flexWrap: 'nowrap'
          }}>
            <Tooltip title="Detaylar">
              <IconButton
                onClick={() => handleViewDetails(params.row)}
                size={isMobile ? "small" : "medium"}
                sx={{ p: isMobile ? 0.25 : 0.5 }}
              >
                <ViewIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Düzenle">
              <IconButton
                onClick={() => {
                  setSelectedAppointment(params.row);
                  setEditDialogOpen(true);
                }}
                size={isMobile ? "small" : "medium"}
                color="primary"
                sx={{ p: isMobile ? 0.25 : 0.5 }}
              >
                <EditIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
            {params.row.status === 'pending' && (
              <>
                <Tooltip title="Onayla">
                  <IconButton
                    onClick={() => handleStatusChange(params.row.id, 'confirmed')}
                    size={isMobile ? "small" : "medium"}
                    color="success"
                    sx={{ p: isMobile ? 0.25 : 0.5 }}
                  >
                    <CheckCircleIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="İptal">
                  <IconButton
                    onClick={() => handleStatusChange(params.row.id, 'cancelled')}
                    size={isMobile ? "small" : "medium"}
                    color="error"
                    sx={{ p: isMobile ? 0.25 : 0.5 }}
                  >
                    <CancelIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {params.row.status === 'confirmed' && (
              <Tooltip title="İşleme Al">
                <IconButton
                  onClick={() => handleStatusChange(params.row.id, 'in_progress')}
                  size={isMobile ? "small" : "medium"}
                  color="primary"
                  sx={{ p: isMobile ? 0.25 : 0.5 }}
                >
                  <BuildIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            )}
            {params.row.status === 'in_progress' && (
              <Tooltip title="Tamamla">
                <IconButton
                  onClick={() => handleStatusChange(params.row.id, 'completed')}
                  size={isMobile ? "small" : "medium"}
                  color="success"
                  sx={{ p: isMobile ? 0.25 : 0.5 }}
                >
                  <CheckCircleIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Sil">
              <IconButton
                onClick={() => handleDelete(params.row.id)}
                size={isMobile ? "small" : "medium"}
                color="error"
                sx={{ p: isMobile ? 0.25 : 0.5 }}
              >
                <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ];

    return baseColumns;
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          Randevular
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          fullWidth={isMobile}
          sx={{
            minWidth: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: '100%', sm: '200px' }
          }}
        >
          Yeni Randevu
        </Button>
      </Box>

      {/* Filtreler */}
      <Card sx={{
        mb: 3,
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
        boxShadow: theme.shadows[2]
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Ara"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Müşteri adı, telefon, plaka veya takip no"
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Durum"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              size={isMobile ? "small" : "medium"}
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="pending">Bekleyen</MenuItem>
              <MenuItem value="confirmed">Onaylanan</MenuItem>
              <MenuItem value="in_progress">İşlemde</MenuItem>
              <MenuItem value="completed">Tamamlanan</MenuItem>
              <MenuItem value="cancelled">İptal Edilen</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Tarih"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Usta</InputLabel>
              <Select
                value={filters.mechanic}
                onChange={(e) => setFilters({ ...filters, mechanic: e.target.value })}
                label="Usta"
              >
                <MenuItem value="">Tümü</MenuItem>
                {mechanics.map((mechanic) => (
                  <MenuItem key={mechanic.id} value={mechanic.id}>
                    {mechanic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Müşteri</InputLabel>
              <Select
                value={filters.customer}
                onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                label="Müşteri"
              >
                <MenuItem value="">Tümü</MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setFilters({
                status: '',
                search: '',
                date: '',
                dateRange: [null, null],
                mechanic: '',
                customer: '',
                vehicle: ''
              })}
              size={isMobile ? "small" : "medium"}
            >
              Sıfırla
            </Button>
          </Grid>
        </Grid>
      </Card>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        >
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          height: { xs: 'calc(100vh - 300px)', sm: 600 },
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={filteredAppointments}
          columns={getColumns()}
          pageSize={isMobile ? 5 : 10}
          rowsPerPageOptions={isMobile ? [5, 10] : [10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          density={isMobile ? "compact" : "standard"}
          sx={{
            '& .MuiDataGrid-cell': {
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 1 }
            },
            '& .MuiDataGrid-columnHeader': {
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 1 }
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none'
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            }
          }}
          components={{
            LoadingOverlay: () => (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
                <CircularProgress size={isMobile ? 20 : 24} />
              </Box>
            )
          }}
        />
      </Paper>

      {/* Randevu Detay Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        {selectedAppointment && (
          <>
            <DialogTitle sx={{
              p: { xs: 2, sm: 3 },
              borderBottom: 1,
              borderColor: 'divider'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  <ViewIcon sx={{ mr: 1 }} />
                  Randevu Detayları
                </Typography>
                <Chip
                  label={getStatusText(selectedAppointment.status)}
                  color={getStatusColor(selectedAppointment.status)}
                  sx={{
                    minWidth: { xs: '100px', sm: '120px' },
                    '& .MuiChip-label': {
                      px: { xs: 1, sm: 2 }
                    }
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={2}>
                {/* Müşteri Bilgileri */}
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      borderRadius: 2
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        <PersonIcon sx={{ mr: 1 }} />
                        Müşteri Bilgileri
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {selectedAppointment.customer?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Tel: {selectedAppointment.customer?.phone}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Araç Bilgileri */}
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      borderRadius: 2
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        <CarIcon sx={{ mr: 1 }} />
                        Araç Bilgileri
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {selectedAppointment.vehicle?.brand} {selectedAppointment.vehicle?.model}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Plaka: {selectedAppointment.vehicle?.licensePlate}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Randevu Bilgileri */}
                <Grid item xs={12}>
                  <Card
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        <EventNoteIcon sx={{ mr: 1 }} />
                        Randevu Bilgileri
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            Takip No
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {selectedAppointment.trackingNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            Randevu Tarihi
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {new Date(selectedAppointment.appointmentDate).toLocaleString('tr-TR')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            Teknisyen
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {selectedAppointment.mechanic?.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Servis ve Ödeme Bilgileri */}
                <Grid item xs={12}>
                  <Card
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        <BuildIcon sx={{ mr: 1 }} />
                        Servis ve Ödeme Bilgileri
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            Yapılan Servisler
                          </Typography>
                          {selectedAppointment.services?.map((service, index) => (
                            <Box
                              key={index}
                              sx={{
                                mb: 1,
                                p: 1,
                                bgcolor: 'background.default',
                                borderRadius: 1
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                              >
                                {service.name} - {service.basePrice} ₺
                              </Typography>
                            </Box>
                          ))}
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: { xs: 1, sm: 0 }
                          }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                              Toplam Tutar
                            </Typography>
                            <Typography
                              variant="h6"
                              color="primary"
                              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                            >
                              {selectedAppointment.totalAmount} ₺
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={selectedAppointment.paymentStatus === 'paid' ? 'Ödendi' :
                                selectedAppointment.paymentStatus === 'partial' ? 'Kısmi Ödeme' : 'Bekliyor'}
                              color={selectedAppointment.paymentStatus === 'paid' ? 'success' :
                                selectedAppointment.paymentStatus === 'partial' ? 'warning' : 'error'}
                              size="small"
                              sx={{
                                minWidth: { xs: '100px', sm: '120px' },
                                '& .MuiChip-label': {
                                  px: { xs: 1, sm: 2 }
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Notlar */}
                {selectedAppointment.notes && (
                  <Grid item xs={12}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          <DescriptionIcon sx={{ mr: 1 }} />
                          Notlar
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {selectedAppointment.notes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{
              p: { xs: 2, sm: 3 },
              borderTop: 1,
              borderColor: 'divider'
            }}>
              <Button
                onClick={() => setViewDialogOpen(false)}
                variant="outlined"
                fullWidth={isMobile}
                sx={{
                  minWidth: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '100%', sm: '120px' }
                }}
              >
                Kapat
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        {selectedAppointment && (
          <>
            <DialogTitle sx={{
              p: { xs: 2, sm: 3 },
              borderBottom: 1,
              borderColor: 'divider'
            }}>
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                <EditIcon sx={{ mr: 1 }} />
                Randevu Düzenle
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={2}>
                {/* Müşteri ve Araç Bilgileri */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Müşteri: {selectedAppointment.customer.name}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Araç: {selectedAppointment.vehicle.brand} {selectedAppointment.vehicle.model} - {selectedAppointment.vehicle.licensePlate}
                    </Typography>
                  </Card>
                </Grid>

                {/* Servisler */}
                <Grid item xs={12}>
                  <FormControl fullWidth required size={isMobile ? "small" : "medium"}>
                    <InputLabel>Servisler</InputLabel>
                    <Select
                      multiple
                      value={selectedAppointment.services?.map(service => service.id) || []}
                      onChange={(e) => {
                        const selectedIds = e.target.value;
                        const selectedServicesList = services.filter(service =>
                          selectedIds.includes(service.id)
                        );
                        setSelectedAppointment({
                          ...selectedAppointment,
                          services: selectedServicesList
                        });
                      }}
                      label="Servisler"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const service = services.find(s => s.id === value);
                            return (
                              <Chip
                                key={value}
                                label={`${service?.name || ''} - ${service?.basePrice || 0} ₺`}
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}>
                            <Typography>{service.name}</Typography>
                            <Typography color="primary.main">{service.basePrice} ₺</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Randevu Tarihi ve Saati */}
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                    <DatePicker
                      label="Randevu Tarihi"
                      value={selectedAppointment.appointmentDate ? new Date(selectedAppointment.appointmentDate) : null}
                      onChange={(date) => {
                        const currentTime = selectedAppointment.appointmentTime || new Date();
                        const newDateTime = new Date(date);
                        newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes());
                        setSelectedAppointment({
                          ...selectedAppointment,
                          appointmentDate: newDateTime
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          size={isMobile ? "small" : "medium"}
                        />
                      )}
                      minDate={new Date()}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                    <TimePicker
                      label="Randevu Saati"
                      value={selectedAppointment.appointmentTime || new Date(selectedAppointment.appointmentDate)}
                      onChange={(time) => {
                        const currentDate = selectedAppointment.appointmentDate || new Date();
                        const newDateTime = new Date(currentDate);
                        newDateTime.setHours(time.getHours(), time.getMinutes());
                        setSelectedAppointment({
                          ...selectedAppointment,
                          appointmentTime: time,
                          appointmentDate: newDateTime
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          size={isMobile ? "small" : "medium"}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                {/* Durum */}
                <Grid item xs={12}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel>Durum</InputLabel>
                    <Select
                      value={selectedAppointment.status}
                      onChange={(e) => setSelectedAppointment({
                        ...selectedAppointment,
                        status: e.target.value
                      })}
                      label="Durum"
                    >
                      <MenuItem value="pending">Bekliyor</MenuItem>
                      <MenuItem value="confirmed">Onaylandı</MenuItem>
                      <MenuItem value="in_progress">İşlemde</MenuItem>
                      <MenuItem value="completed">Tamamlandı</MenuItem>
                      <MenuItem value="cancelled">İptal Edildi</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Açıklama ve Notlar */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Açıklama"
                    multiline
                    rows={2}
                    value={selectedAppointment.description}
                    onChange={(e) => setSelectedAppointment({
                      ...selectedAppointment,
                      description: e.target.value
                    })}
                    size={isMobile ? "small" : "medium"}
                    placeholder="Müşteri için açıklama..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Teknisyen Notları"
                    multiline
                    rows={2}
                    value={selectedAppointment.notes}
                    onChange={(e) => setSelectedAppointment({
                      ...selectedAppointment,
                      notes: e.target.value
                    })}
                    size={isMobile ? "small" : "medium"}
                    placeholder="Teknisyen için özel notlar..."
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{
              p: { xs: 2, sm: 3 },
              borderTop: 1,
              borderColor: 'divider'
            }}>
              <Button
                onClick={() => setEditDialogOpen(false)}
                variant="outlined"
                fullWidth={isMobile}
                sx={{
                  minWidth: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '100%', sm: '120px' }
                }}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleEditAppointment}
                fullWidth={isMobile}
                sx={{
                  minWidth: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '100%', sm: '200px' }
                }}
              >
                Kaydet
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create Appointment Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Yeni Randevu Oluştur
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {/* Müşteri Seçimi veya Yeni Müşteri Oluşturma */}
              <Grid item xs={12}>
                {!showNewCustomerForm ? (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Müşteri Seçin</Typography>
                      <Button
                        size="small"
                        onClick={() => setShowNewCustomerForm(true)}
                        startIcon={<AddIcon />}
                      >
                        Yeni Müşteri
                      </Button>
                    </Box>
                    <Autocomplete
                      options={customers}
                      getOptionLabel={(option) => `${option.name} - ${option.phone}`}
                      value={selectedCustomer}
                      onChange={(event, newValue) => {
                        setSelectedCustomer(newValue);
                        setSelectedVehicle(null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          size={isMobile ? "small" : "medium"}
                          placeholder="Müşteri ara..."
                        />
                      )}
                      loading={loading}
                      loadingText="Müşteriler yükleniyor..."
                      noOptionsText="Müşteri bulunamadı"
                    />
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Yeni Müşteri Bilgileri</Typography>
                      <Button
                        size="small"
                        onClick={() => setShowNewCustomerForm(false)}
                      >
                        Müşteri Seç
                      </Button>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Ad Soyad"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                          required
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Telefon"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                          required
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="E-posta"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleCreateNewCustomer}
                          disabled={!newCustomer.name || !newCustomer.phone}
                          fullWidth
                        >
                          Müşteri Oluştur
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Grid>

              {/* Araç Seçimi */}
              {selectedCustomer && (
                <Grid item xs={12}>
                  {!showNewVehicleForm ? (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">Araç Seçin</Typography>
                        <Button
                          size="small"
                          onClick={() => setShowNewVehicleForm(true)}
                          startIcon={<AddIcon />}
                        >
                          Yeni Araç
                        </Button>
                      </Box>
                      <FormControl fullWidth required size={isMobile ? "small" : "medium"}>
                        <InputLabel>Araç Seçin</InputLabel>
                        <Select
                          value={selectedVehicle?.id || ''}
                          onChange={(e) => {
                            const vehicle = vehicles.find(v => v.id === e.target.value);
                            setSelectedVehicle(vehicle);
                          }}
                          label="Araç Seçin"
                        >
                          {vehicles
                            .filter(vehicle => vehicle.customer?.id === selectedCustomer.id)
                            .map((vehicle) => (
                              <MenuItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ) : (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">Yeni Araç Bilgileri</Typography>
                        <Button
                          size="small"
                          onClick={() => setShowNewVehicleForm(false)}
                        >
                          Araç Seç
                        </Button>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Marka</InputLabel>
                            <Select
                              value={selectedBrand}
                              onChange={(e) => handleBrandChange(e.target.value)}
                              label="Marka"
                            >
                              {vehicleBrands.map((brand) => (
                                <MenuItem key={brand} value={brand}>
                                  {brand}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Tip</InputLabel>
                            <Select
                              value={selectedType}
                              onChange={(e) => handleTypeChange(e.target.value)}
                              label="Tip"
                              disabled={!selectedBrand}
                            >
                              {availableTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Model</InputLabel>
                            <Select
                              value={selectedModel}
                              onChange={(e) => setSelectedModel(e.target.value)}
                              label="Model"
                              disabled={!selectedType}
                            >
                              {availableModels.map((model) => (
                                <MenuItem key={model} value={model}>
                                  {model}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Plaka"
                            value={newVehicle.licensePlate}
                            onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Yıl"
                            type="number"
                            value={newVehicle.year}
                            onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Grid>
              )}

              {/* Usta Seçimi */}
              <Grid item xs={12}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>Usta Seçin</InputLabel>
                  <Select
                    value={selectedMechanic?.id || ''}
                    onChange={(e) => {
                      const mechanic = mechanics.find(m => m.id === e.target.value);
                      setSelectedMechanic(mechanic);
                    }}
                    label="Usta Seçin"
                  >
                    {mechanics.map((mechanic) => (
                      <MenuItem key={mechanic.id} value={mechanic.id}>
                        {mechanic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Servis Seçimi - Çoklu */}
              <Grid item xs={12}>
                <FormControl fullWidth required size={isMobile ? "small" : "medium"}>
                  <InputLabel>Servisler</InputLabel>
                  <Select
                    multiple
                    value={selectedServices.map(service => service.id)}
                    onChange={(e) => {
                      const selectedIds = e.target.value;
                      const selectedServicesList = services.filter(service =>
                        selectedIds.includes(service.id)
                      );
                      setSelectedServices(selectedServicesList);
                    }}
                    label="Servisler"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const service = services.find(s => s.id === value);
                          return (
                            <Chip
                              key={value}
                              label={`${service.name} - ${service.basePrice} ₺`}
                              size="small"
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          <Typography>{service.name}</Typography>
                          <Typography color="primary.main">{service.basePrice} ₺</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Randevu Tarihi ve Saati */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                  <DatePicker
                    label="Randevu Tarihi"
                    value={newAppointment.appointmentDate}
                    onChange={(date) => setNewAppointment({ ...newAppointment, appointmentDate: date })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        size={isMobile ? "small" : "medium"}
                      />
                    )}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                  <TimePicker
                    label="Randevu Saati"
                    value={newAppointment.appointmentTime}
                    onChange={(time) => setNewAppointment({ ...newAppointment, appointmentTime: time })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        size={isMobile ? "small" : "medium"}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Açıklama ve Notlar */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Açıklama"
                  multiline
                  rows={2}
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                  size={isMobile ? "small" : "medium"}
                  placeholder="Müşteri için açıklama..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teknisyen Notları"
                  multiline
                  rows={2}
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  size={isMobile ? "small" : "medium"}
                  placeholder="Teknisyen için özel notlar..."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{
          p: { xs: 2, sm: 3 },
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Button
            onClick={() => {
              setCreateDialogOpen(false);
              resetForm();
            }}
            variant="outlined"
            fullWidth={isMobile}
            sx={{
              minWidth: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '100%', sm: '120px' }
            }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateAppointment}
            disabled={loading || !selectedCustomer || !selectedVehicle || selectedServices.length === 0 || !newAppointment.appointmentDate || !newAppointment.appointmentTime}
            fullWidth={isMobile}
            sx={{
              minWidth: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '100%', sm: '200px' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Randevu Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments; 