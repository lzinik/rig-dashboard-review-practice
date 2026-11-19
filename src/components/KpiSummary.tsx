import { Paper, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { selectRecords } from '../store/witsSlice';
import { convert, unitLabel } from '../utils/units';
import type { UnitSystem } from '../types';

type Props = {
  units: UnitSystem;
};

export default function KpiSummary({ units }: Props) {
  const records = useAppSelector(selectRecords);

  if (!records.length) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6">Session KPIs</Typography>
        <Typography color="text.secondary">Waiting for data…</Typography>
      </Paper>
    );
  }

  const rops = records.map((r) => r.data.rop);
  const avgRop = rops.reduce((sum, v) => sum + v, 0) / rops.length;
  const sortedRops = [...rops].sort();
  const medianRop = sortedRops[Math.floor(sortedRops.length / 2)];
  const maxWob = Math.max(...records.map((r) => r.data.wob));
  const footage = records[records.length - 1].data.hole_depth - records[0].data.hole_depth;
  const onBottomPct = (records.filter((r) => r.data.rop > 0).length / records.length) * 100;

  const rows: [string, string][] = [
    ['Avg ROP', `${convert('rop', avgRop, units).toFixed(1)} ${unitLabel('rop', units)}`],
    ['Median ROP', `${convert('rop', medianRop, units).toFixed(1)} ${unitLabel('rop', units)}`],
    ['Max WOB', `${convert('wob', maxWob, units).toFixed(1)} ${unitLabel('wob', units)}`],
    ['Footage drilled', `${footage.toFixed(1)} ${unitLabel('hole_depth', units)}`],
    ['On-bottom time', `${onBottomPct.toFixed(0)}%`],
    ['Samples', String(records.length)],
  ];

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Session KPIs
      </Typography>
      <Table size="small">
        <TableBody>
          {rows.map(([label, value]) => (
            <TableRow key={label}>
              <TableCell>{label}</TableCell>
              <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
