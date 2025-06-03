import { createTheme } from '@mui/material/styles';

const customerTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' }, // canlı mavi
    secondary: { main: '#222' },  // siyah
    background: { default: '#fff', paper: '#f8fafd' },
    text: { primary: '#222', secondary: '#555' }
  },
  components: {
    MuiAppBar: { 
      styleOverrides: { 
        colorPrimary: { backgroundColor: '#1976d2' },
        root: { borderRadius: 0 }
      } 
    }
  }
});

export default customerTheme; 