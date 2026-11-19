import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import { useWitsStream } from '../hooks/useWitsStream';
import { useAppSelector } from '../store/hooks';
import { selectLatest } from '../store/witsSlice';
import type { Channel, Thresholds, UnitSystem, Well } from '../types';
import AlarmBanner from './AlarmBanner';
import ChannelChart from './ChannelChart';
import GaugeTile from './GaugeTile';
import KpiSummary from './KpiSummary';
import NotesPanel from './NotesPanel';

const GAUGE_CHANNELS: Channel[] = ['hole_depth', 'bit_depth', 'rop', 'wob', 'hook_load', 'spp'];

type Props = {
  well: Well;
  units: UnitSystem;
  thresholds: Thresholds;
};

export default function Dashboard({ well, units, thresholds }: Props) {
  useWitsStream(well.id);

  const latest = useAppSelector(selectLatest);
  const connected = useAppSelector((s) => s.wits.connected);

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2} flexWrap="wrap">
        <Typography variant="h6">{well.name}</Typography>
        <Chip size="small" label={well.rig} />
        <Chip size="small" label={well.status} variant="outlined" />
        <Chip
          size="small"
          color={connected ? 'success' : 'default'}
          label={connected ? 'Live' : 'Offline'}
        />
      </Box>

      <AlarmBanner latest={latest} thresholds={thresholds} units={units} />

      <Grid container spacing={2}>
        {GAUGE_CHANNELS.map((channel) => (
          <Grid item xs={6} md={4} lg={2} key={channel}>
            <GaugeTile
              channel={channel}
              value={latest?.data[channel]}
              units={units}
              limits={{ min: thresholds[channel]?.min, max: thresholds[channel]?.max }}
              onClick={() => console.log('open channel details', channel)}
            />
          </Grid>
        ))}

        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2 }}>
            <ChannelChart channel="rop" units={units} timezone={well.timezone} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <KpiSummary units={units} />
        </Grid>

        <Grid item xs={12}>
          <NotesPanel wellId={well.id} />
        </Grid>
      </Grid>
    </Box>
  );
}
