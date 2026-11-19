export type Channel = 'hole_depth' | 'bit_depth' | 'rop' | 'wob' | 'hook_load' | 'spp';

export type WitsRecord = {
  asset_id: number;
  /** Unix timestamp in seconds */
  timestamp: number;
  data: Record<Channel, number>;
};

export type WellStatus = 'drilling' | 'tripping' | 'idle';

export type Well = {
  id: number;
  name: string;
  rig: string;
  status: WellStatus;
  /** IANA time zone of the well site, e.g. "America/Chicago" */
  timezone: string;
};

export type Note = {
  id: string;
  wellId: number;
  /** Unix timestamp in seconds */
  createdAt: number;
  author: { name: string } | null;
  body: string;
};

export type UnitSystem = 'imperial' | 'metric';

export type Limit = { min?: number; max?: number };

export type Thresholds = Partial<Record<Channel, Limit>>;
