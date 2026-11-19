import { memo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { Channel, Limit, UnitSystem } from '../types';
import { CHANNEL_LABELS, convert, unitLabel } from '../utils/units';

type Props = {
  channel: Channel;
  value?: number;
  units: UnitSystem;
  limits: Limit;
  onClick: () => void;
};

function GaugeTile({ channel, value, units, limits, onClick }: Props) {
  if (!value) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="overline" color="text.secondary">
          {CHANNEL_LABELS[channel]}
        </Typography>
        <Typography variant="h4">—</Typography>
      </Paper>
    );
  }

  const display = convert(channel, value, units);
  const isHigh = limits.max !== undefined && display > limits.max;
  const isLow = limits.min !== undefined && display < limits.min;
  const isAlarm = isHigh || isLow;

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 2,
        height: '100%',
        cursor: 'pointer',
        bgcolor: isAlarm ? '#ffebee' : undefined,
        border: isAlarm ? '2px solid red' : undefined,
      }}
    >
      <Typography variant="overline" color="text.secondary">
        {CHANNEL_LABELS[channel]}
      </Typography>
      <Box display="flex" alignItems="baseline" gap={0.5}>
        <Typography variant="h4" fontWeight={600}>
          {display.toFixed(1)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {unitLabel(channel, units)}
        </Typography>
      </Box>
      {isAlarm && (
        <Typography variant="caption" color="error">
          {isHigh ? 'Above limit' : 'Below limit'}
        </Typography>
      )}
    </Paper>
  );
}

export default memo(GaugeTile);
