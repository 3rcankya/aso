import { createTheme } from '@mui/material/styles';

const adminTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0d47a1' }, // koyu mavi
    secondary: { main: '#222' },  // siyah
    background: { default: '#181c24', paper: '#232a36' },
    text: { primary: '#fff', secondary: '#b0b8c1' }
  },
  components: {
    MuiAppBar: { 
      styleOverrides: { 
        colorPrimary: { backgroundColor: '#0d47a1' },
        root: { borderRadius: 0 }
      } 
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } }
  }
});

export default adminTheme; 