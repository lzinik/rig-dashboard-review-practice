import type { Channel, UnitSystem } from '../types';

type UnitDef = {
  imperial: string;
  metric: string;
  toMetric: (value: number) => number;
};

const FT_TO_M = 0.3048;
const KLBF_TO_KN = 4.44822;
const PSI_TO_KPA = 6.89476;

export const CHANNEL_UNITS: Record<Channel, UnitDef> = {
  hole_depth: { imperial: 'ft', metric: 'm', toMetric: (v) => v * FT_TO_M },
  bit_depth: { imperial: 'ft', metric: 'm', toMetric: (v) => v * FT_TO_M },
  rop: { imperial: 'ft/h', metric: 'm/h', toMetric: (v) => v / FT_TO_M },
  wob: { imperial: 'klbf', metric: 'kN', toMetric: (v) => v * KLBF_TO_KN },
  hook_load: { imperial: 'klbf', metric: 'kN', toMetric: (v) => v * KLBF_TO_KN },
  spp: { imperial: 'psi', metric: 'kPa', toMetric: (v) => v * PSI_TO_KPA },
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  hole_depth: 'Hole depth',
  bit_depth: 'Bit depth',
  rop: 'ROP',
  wob: 'WOB',
  hook_load: 'Hook load',
  spp: 'SPP',
};

export function convert(channel: Channel, value: number, units: UnitSystem): number {
  return units === 'metric' ? CHANNEL_UNITS[channel].toMetric(value) : value;
}

export function unitLabel(channel: Channel, units: UnitSystem): string {
  return CHANNEL_UNITS[channel][units];
}

export function formatValue(channel: Channel, value: number, units: UnitSystem): string {
  return `${convert(channel, value, units).toFixed(1)} ${unitLabel(channel, units)}`;
}
