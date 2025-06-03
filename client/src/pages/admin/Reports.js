import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  DateRange as DateRangeIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  TableChart as TableChartIcon,
  PictureAsPdf as PdfIcon,
  TableView as ExcelIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { adminService } from '../../services/api';
import { useTheme, useMediaQuery } from '@mui/material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('appointments');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1); // Ayın başlangıcı
    return date;
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date;
  });
  const [reportData, setReportData] = useState(null);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' veya 'table'
  const [anchorEl, setAnchorEl] = useState(null);

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd.MM.yyyy HH:mm', { locale: tr });
    } catch (error) {
      console.error('Tarih formatı hatası:', error);
      return 'Geçersiz Tarih';
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const filters = {
        type: reportType,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      };
      const response = await adminService.getReports(filters);

      let formattedData = {};

      switch (reportType) {
        case 'appointments':
          formattedData = {
            appointments: response.data.data.appointments.map(appointment => ({
              id: appointment.id,
              date: formatDate(appointment.date),
              customerName: appointment.customer?.name || 'Bilinmiyor',
              customerPhone: appointment.customer?.phone || 'Bilinmiyor',
              mechanicName: appointment.mechanic?.name || 'Bilinmiyor',
              vehicleInfo: appointment.vehicle ? `${appointment.vehicle.brand} ${appointment.vehicle.model}` : 'Bilinmiyor',
              licensePlate: appointment.vehicle?.licensePlate || 'Bilinmiyor',
              services: appointment.appointmentServices?.map(as => ({
                name: as.Service?.name || 'Bilinmiyor',
                price: parseFloat(as.price) || 0
              })) || [],
              status: appointment.status,
              totalAmount: parseFloat(appointment.totalAmount) || 0,
              trackingNumber: appointment.trackingNumber
            }))
          };
          break;

        case 'revenue':
          formattedData = {
            dailyRevenue: response.data.data.dailyRevenue.map(item => ({
              date: formatDate(item.date),
              revenue: parseFloat(item.totalRevenue) || 0,
              appointments: parseInt(item.appointmentCount) || 0
            })),
            summary: {
              totalRevenue: parseFloat(response.data.data.totalRevenue) || 0,
              totalAppointments: parseInt(response.data.data.totalAppointments) || 0,
              averageRevenue: parseFloat(response.data.data.averageRevenue) || 0
            }
          };
          break;

        case 'services':
          formattedData = {
            services: response.data.data.map(service => ({
              name: service.name,
              revenue: parseFloat(service.totalRevenue) || 0,
              count: parseInt(service.totalCount) || 0
            }))
          };
          break;

        case 'mechanics':
          formattedData = {
            mechanics: response.data.data.map(mechanic => ({
              name: mechanic.name,
              completedJobs: parseInt(mechanic.totalAppointments) || 0,
              totalRevenue: parseFloat(mechanic.totalRevenue) || 0,
              averageRating: parseFloat(mechanic.averageRevenue) || 0
            }))
          };
          break;

        default:
          formattedData = response.data.data;
      }

      setReportData(formattedData);
      setError(null);
    } catch (err) {
      setError('Rapor yüklenirken bir hata oluştu.');
      console.error('Rapor hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [reportType, startDate, endDate]);

  const handleDownload = (format) => {
    if (!reportData) return;

    let data = [];
    let fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}`;

    switch (reportType) {
      case 'revenue':
        data = reportData.dailyRevenue.map(item => ({
          Tarih: item.date,
          'Toplam Gelir': `${item.revenue} TL`,
          'Randevu Sayısı': item.appointments,
          'Ortalama Gelir': `${(item.revenue / item.appointments).toFixed(2)} TL`
        }));
        break;

      case 'services':
        data = reportData.services.map(service => ({
          'Servis Adı': service.name,
          'Toplam İşlem': service.count,
          'Toplam Gelir': `${service.revenue} TL`,
          'Ortalama Gelir': `${(service.revenue / service.count).toFixed(2)} TL`
        }));
        break;

      case 'mechanics':
        data = reportData.mechanics.map(mechanic => ({
          'Usta Adı': mechanic.name,
          'Tamamlanan İşler': mechanic.completedJobs,
          'Toplam Gelir': `${mechanic.totalRevenue} TL`,
          'Ortalama Gelir': `${mechanic.averageRating} TL`
        }));
        break;

      case 'appointments':
        data = reportData.appointments.map(appointment => ({
          'Tarih': appointment.date,
          'Müşteri': appointment.customerName,
          'Telefon': appointment.customerPhone,
          'Araç': appointment.vehicleInfo,
          'Plaka': appointment.licensePlate,
          'Servisler': appointment.services.map(s => `${s.name} - ${s.price} TL`).join(', '),
          'Usta': appointment.mechanicName,
          'Durum': appointment.status,
          'Tutar': `${appointment.totalAmount} TL`
        }));
        break;
    }

    if (format === 'excel') {
      exportToExcel(data, fileName);
    } else if (format === 'pdf') {
      exportToPdf(data, fileName);
    }

    setAnchorEl(null);
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapor');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToPdf = (data, fileName) => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

    // Title
    doc.setFontSize(16);
    doc.text('Rapor', 14, 15);
    
    // Report type
    doc.setFontSize(12);
    const reportTypeText = {
      'appointments': 'Randevu Raporu',
      'revenue': 'Gelir Raporu',
      'mechanics': 'Usta Performans Raporu',
      'services': 'Servis Raporu'
    }[reportType];
    doc.text(reportTypeText, 14, 25);

    // Date range
    doc.setFontSize(10);
    const dateRange = `${format(startDate, 'dd.MM.yyyy', { locale: tr })} - ${format(endDate, 'dd.MM.yyyy', { locale: tr })}`;
    doc.text(`Tarih Aralığı: ${dateRange}`, 14, 35);

    // Table headers
    const headers = Object.keys(data[0]).map(header => {
      const headerMap = {
        'Tarih': 'Tarih',
        'Müşteri': 'Müşteri',
        'Telefon': 'Telefon',
        'Araç': 'Araç',
        'Plaka': 'Plaka',
        'Servisler': 'Servisler',
        'Usta': 'Usta',
        'Durum': 'Durum',
        'Tutar': 'Tutar'
      };
      return headerMap[header] || header;
    });

    // Format table data
    const rows = data.map(item => {
      return Object.values(item).map(value => {
        if (typeof value === 'string' && value.includes('TL')) {
          return value;
        }
        if (typeof value === 'number') {
          return `${value.toLocaleString('tr-TR')} TL`;
        }
        return value;
      });
    });

    // Table settings
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 45,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Tarih
        1: { cellWidth: 40 }, // Müşteri
        2: { cellWidth: 30 }, // Telefon
        3: { cellWidth: 40 }, // Araç
        4: { cellWidth: 25 }, // Plaka
        5: { cellWidth: 60 }, // Servisler
        6: { cellWidth: 30 }, // Usta
        7: { cellWidth: 25 }, // Durum
        8: { cellWidth: 25 }  // Tutar
      },
      margin: { top: 45 },
      didDrawPage: function(data) {
        // Add page number
        doc.setFontSize(8);
        doc.text(
          `Sayfa ${data.pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10,
          { align: 'right' }
        );
      }
    });

    doc.save(`${fileName}.pdf`);
  };

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const renderChart = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'revenue':
        if (!reportData.dailyRevenue || !Array.isArray(reportData.dailyRevenue)) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">Gelir verisi bulunamadı</Typography>
            </Box>
          );
        }

        return (
          <Box>
            {/* Özet Bilgiler */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Toplam Gelir
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {reportData.summary.totalRevenue.toLocaleString('tr-TR')} TL
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Toplam Randevu
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {reportData.summary.totalAppointments}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Ortalama Gelir
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {reportData.summary.averageRevenue.toLocaleString('tr-TR')} TL
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Gelir Grafiği */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={reportData.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <RechartsTooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Gelir (TL)" />
                <Line yAxisId="right" type="monotone" dataKey="appointments" stroke="#82ca9d" name="Randevu Sayısı" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        );

      case 'services':
        if (!reportData.services || !Array.isArray(reportData.services)) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">Servis verisi bulunamadı</Typography>
            </Box>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={reportData.services}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, revenue }) => `${name}: ${revenue} TL`}
              >
                {reportData.services.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => `${value} TL`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'mechanics':
        if (!reportData.mechanics || !Array.isArray(reportData.mechanics)) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">Usta verisi bulunamadı</Typography>
            </Box>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.mechanics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <RechartsTooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="completedJobs" fill="#8884d8" name="Tamamlanan İşler" />
              <Bar yAxisId="right" dataKey="totalRevenue" fill="#82ca9d" name="Toplam Gelir (TL)" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'appointments':
        if (!reportData.appointments || !Array.isArray(reportData.appointments)) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">Randevu verisi bulunamadı</Typography>
            </Box>
          );
        }

        // Randevu durumlarına göre veri hazırlama
        const statusData = reportData.appointments.reduce((acc, appointment) => {
          const status = appointment.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const pieData = Object.entries(statusData).map(([status, count]) => ({
          name: status === 'completed' ? 'Tamamlandı' :
            status === 'cancelled' ? 'İptal Edildi' :
              status === 'confirmed' ? 'Onaylandı' :
                status === 'pending' ? 'Beklemede' : 'İşlemde',
          value: count
        }));

        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <Typography color="text.secondary">Grafik verisi bulunamadı</Typography>
          </Box>
        );
    }
  };

  const renderTable = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'services':
        if (!reportData.services || !Array.isArray(reportData.services)) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">Servis verisi bulunamadı</Typography>
            </Box>
          );
        }
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Servis Adı</TableCell>
                  <TableCell>Toplam İşlem</TableCell>
                  <TableCell>Toplam Gelir</TableCell>
                  <TableCell>Ortalama Gelir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.services.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.count}</TableCell>
                    <TableCell>{service.revenue.toLocaleString('tr-TR')} TL</TableCell>
                    <TableCell>
                      {service.count > 0
                        ? (service.revenue / service.count).toLocaleString('tr-TR', { maximumFractionDigits: 2 })
                        : 0} TL
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 'appointments':
        if (!reportData.appointments || !Array.isArray(reportData.appointments)) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">Randevu verisi bulunamadı</Typography>
            </Box>
          );
        }
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Müşteri</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Araç</TableCell>
                  <TableCell>Plaka</TableCell>
                  <TableCell>Servisler</TableCell>
                  <TableCell>Usta</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Tutar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.customerName}</TableCell>
                    <TableCell>{appointment.customerPhone}</TableCell>
                    <TableCell>{appointment.vehicleInfo}</TableCell>
                    <TableCell>{appointment.licensePlate}</TableCell>
                    <TableCell>
                      {appointment.services.map(service => (
                        <div key={service.name}>
                          {service.name} - {service.price.toLocaleString('tr-TR')} TL
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{appointment.mechanicName}</TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status === 'completed' ? 'Tamamlandı' :
                          appointment.status === 'cancelled' ? 'İptal Edildi' :
                            appointment.status === 'confirmed' ? 'Onaylandı' :
                              appointment.status === 'pending' ? 'Beklemede' : 'İşlemde'}
                        color={
                          appointment.status === 'completed' ? 'success' :
                            appointment.status === 'cancelled' ? 'error' :
                              appointment.status === 'confirmed' ? 'primary' :
                                appointment.status === 'pending' ? 'warning' : 'info'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{appointment.totalAmount.toLocaleString('tr-TR')} TL</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 'revenue':
        if (!reportData.dailyRevenue || !Array.isArray(reportData.dailyRevenue)) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">Gelir verisi bulunamadı</Typography>
            </Box>
          );
        }
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Toplam Gelir</TableCell>
                  <TableCell>Randevu Sayısı</TableCell>
                  <TableCell>Ortalama Gelir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.dailyRevenue.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.revenue} TL</TableCell>
                    <TableCell>{item.appointments}</TableCell>
                    <TableCell>{(item.revenue / item.appointments).toFixed(2)} TL</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 'mechanics':
        if (!reportData.mechanics || !Array.isArray(reportData.mechanics)) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">Usta verisi bulunamadı</Typography>
            </Box>
          );
        }
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usta</TableCell>
                  <TableCell>Tamamlanan İşler</TableCell>
                  <TableCell>Toplam Gelir</TableCell>
                  <TableCell>Ortalama Puan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.mechanics.map((master, index) => (
                  <TableRow key={index}>
                    <TableCell>{master.name}</TableCell>
                    <TableCell>{master.completedJobs}</TableCell>
                    <TableCell>{master.totalRevenue} TL</TableCell>
                    <TableCell>{master.averageRating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      default:
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <Typography color="text.secondary">Tablo verisi bulunamadı</Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Raporlar
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportClick}
            disabled={!reportData}
          >
            Dışa Aktar
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={() => handleDownload('excel')}>
              <ListItemIcon>
                <ExcelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Excel (.xlsx)</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleDownload('pdf')}>
              <ListItemIcon>
                <PdfIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>PDF (.pdf)</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Rapor Türü</InputLabel>
            <Select
              value={reportType}
              label="Rapor Türü"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="appointments">Randevular</MenuItem>
              <MenuItem value="revenue">Gelir Analizi</MenuItem>
              <MenuItem value="mechanics">Usta Performansı</MenuItem>
              <MenuItem value="services">Servis Analizi</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
            <DatePicker
              label="Başlangıç Tarihi"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
            <DatePicker
              label="Bitiş Tarihi"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Grafik Görünümü">
            <IconButton
              color={viewMode === 'chart' ? 'primary' : 'default'}
              onClick={() => setViewMode('chart')}
            >
              <BarChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tablo Görünümü">
            <IconButton
              color={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
            >
              <TableChartIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        viewMode === 'chart' ? renderChart() : renderTable()
      )}
    </Box>
  );
};

export default Reports; 