import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { selectSeries } from '../store/witsSlice';
import { CHANNEL_LABELS, convert, unitLabel } from '../utils/units';
import { formatTime } from '../utils/time';
import type { Channel, UnitSystem } from '../types';

type Props = {
  channel: Channel;
  units: UnitSystem;
  /** Well site time zone */
  timezone: string;
};

export default function ChannelChart({ channel, units, timezone }: Props) {
  const theme = useTheme();
  const series = useAppSelector(selectSeries(channel));

  const data = series.map(([t, v]) => [t, convert(channel, v, units)]);

  const options: Highcharts.Options = {
    chart: { height: 320, backgroundColor: 'transparent' },
    title: {
      text: CHANNEL_LABELS[channel],
      style: { color: theme.palette.text.primary },
    },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: { type: 'datetime' },
    yAxis: { title: { text: unitLabel(channel, units) } },
    series: [
      {
        type: 'line',
        name: CHANNEL_LABELS[channel],
        data,
        color: theme.palette.primary.main,
      },
    ],
    tooltip: {
      formatter: function () {
        const value = (this.y as number).toFixed(1);
        return `<b>${formatTime(this.x as number)}</b><br/>${value} ${unitLabel(channel, units)}`;
      },
    },
  };

  return <HighchartsReact key={Math.random()} highcharts={Highcharts} options={options} />;
}
