import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Thresholds, UnitSystem } from '../types';

type Settings = {
  units: UnitSystem;
  darkMode: boolean;
  /** Configured in imperial units */
  thresholds: Thresholds;
};

const STORAGE_KEY = 'rig-dashboard-settings';

const DEFAULT_SETTINGS: Settings = {
  units: 'imperial',
  darkMode: false,
  thresholds: {
    rop: { max: 160 },
    wob: { max: 40 },
    spp: { max: 3400 },
    hook_load: { min: 100, max: 260 },
  },
};

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (patch: Partial<Settings>) => {
    setSettings({ ...settings, ...patch });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
