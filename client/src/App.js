import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr';
import theme from './theme';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';
import AppointmentBooking from './pages/public/AppointmentBooking';
import AppointmentTracking from './pages/public/AppointmentTracking';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminServices from './pages/admin/Services';
import AdminInventory from './pages/admin/Inventory';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';
import AdminReports from './pages/admin/Reports';
import AdminCategories from './pages/admin/Categories';
import AdminMasters from './pages/admin/Masters';
import AdminLogin from './pages/admin/Login';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/appointment-booking" element={<AppointmentBooking />} />
              <Route path="/appointment-tracking" element={<AppointmentTracking />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<PrivateRoute isAdmin><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/dashboard" element={<PrivateRoute isAdmin><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/appointments" element={<PrivateRoute isAdmin><AdminAppointments /></PrivateRoute>} />
              <Route path="/admin/services" element={<PrivateRoute isAdmin><AdminServices /></PrivateRoute>} />
              <Route path="/admin/inventory" element={<PrivateRoute isAdmin><AdminInventory /></PrivateRoute>} />
              <Route path="/admin/users" element={<PrivateRoute isAdmin><AdminUsers /></PrivateRoute>} />
              <Route path="/admin/settings" element={<PrivateRoute isAdmin><AdminSettings /></PrivateRoute>} />
              <Route path="/admin/reports" element={<PrivateRoute isAdmin><AdminReports /></PrivateRoute>} />
              <Route path="/admin/categories" element={<PrivateRoute isAdmin><AdminCategories /></PrivateRoute>} />
              <Route path="/admin/masters" element={<PrivateRoute isAdmin><AdminMasters /></PrivateRoute>} />
            </Route>
            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
