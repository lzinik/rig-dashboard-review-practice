import { useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  FormControlLabel,
  Switch,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchWells, selectSelectedWell } from './store/wellsSlice';
import { useSettings } from './context/SettingsContext';
import WellSelector from './components/WellSelector';
import Dashboard from './components/Dashboard';

export default function App() {
  const dispatch = useAppDispatch();
  const { settings, updateSettings } = useSettings();
  const status = useAppSelector((s) => s.wells.status);
  const well = useAppSelector(selectSelectedWell);

  const theme = createTheme({
    palette: {
      mode: settings.darkMode ? 'dark' : 'light',
      primary: { main: '#0e6b70' },
    },
  });

  useEffect(() => {
    dispatch(fetchWells());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3} flexWrap="wrap">
          <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
            Rig Dashboard
          </Typography>
          <WellSelector />
          <FormControlLabel
            control={
              <Switch
                checked={settings.units === 'metric'}
                onChange={(e) => updateSettings({ units: e.target.checked ? 'metric' : 'imperial' })}
              />
            }
            label="Metric"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={(e) => updateSettings({ darkMode: e.target.checked })}
              />
            }
            label="Dark mode"
          />
        </Box>

        {status === 'loading' && <CircularProgress />}

        {well && <Dashboard well={well} units={settings.units} thresholds={settings.thresholds} />}
      </Container>
    </ThemeProvider>
  );
}
