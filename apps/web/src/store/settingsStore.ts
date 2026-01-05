import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'dark' | 'light';
  refreshInterval: number; // milliseconds
  showTestnetFarms: boolean;
  defaultChain: string | null;

  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setRefreshInterval: (interval: number) => void;
  setShowTestnetFarms: (show: boolean) => void;
  setDefaultChain: (chain: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      refreshInterval: 60_000,
      showTestnetFarms: false,
      defaultChain: null,

      setTheme: (theme) => set({ theme }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
      setShowTestnetFarms: (showTestnetFarms) => set({ showTestnetFarms }),
      setDefaultChain: (defaultChain) => set({ defaultChain }),
    }),
    {
      name: 'vibe-defi-settings',
    }
  )
);
