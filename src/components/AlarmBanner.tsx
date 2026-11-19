import { useEffect, useState } from 'react';
import { Alert, AlertTitle, Stack } from '@mui/material';
import type { Channel, Thresholds, UnitSystem, WitsRecord } from '../types';
import { CHANNEL_LABELS, unitLabel } from '../utils/units';

type Props = {
  latest?: WitsRecord;
  thresholds: Thresholds;
  units: UnitSystem;
};

export default function AlarmBanner({ latest, thresholds, units }: Props) {
  const [alarms, setAlarms] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);

  useEffect(() => {
    if (!latest) return;

    const next: string[] = [];
    (Object.keys(thresholds) as Channel[]).forEach((channel) => {
      const limit = thresholds[channel]!;
      const value = latest.data[channel];
      const label = CHANNEL_LABELS[channel];
      const unit = unitLabel(channel, units);

      if (limit.max !== undefined && value > limit.max) {
        next.push(`${label} above ${limit.max} ${unit}`);
      }
      if (limit.min !== undefined && value < limit.min) {
        next.push(`${label} below ${limit.min} ${unit}`);
      }
    });

    setAlarms(next);
  }, [latest]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDismissed(alarms.map((_, i) => i));
      }
    };
    window.addEventListener('keydown', onKeyDown);
  }, [alarms]);

  const visible = alarms.filter((_, i) => !dismissed.includes(i));

  if (!visible.length) return null;

  return (
    <Stack spacing={1} mb={2}>
      {visible.map((alarm, i) => (
        <Alert key={i} severity="error" onClose={() => setDismissed([...dismissed, i])}>
          <AlertTitle>Alarm</AlertTitle>
          {alarm}
        </Alert>
      ))}
    </Stack>
  );
}
