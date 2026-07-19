import { create } from 'zustand';

export interface AlertEvent {
  id: string;
  time: string;
  sensor_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  score: number;
}

interface DashboardState {
  isSimulatorRunning: boolean;
  simulatorSpeed: number;
  timeRange: string;
  alerts: AlertEvent[];
  throughput: number;
  activeSensors: number;
  
  toggleSimulator: () => void;
  setSimulatorSpeed: (speed: number) => void;
  setTimeRange: (range: string) => void;
  addAlert: (alert: AlertEvent) => void;
  updateMetrics: (throughput: number, activeSensors: number) => void;
  clearAlerts: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isSimulatorRunning: true,
  simulatorSpeed: 1,
  timeRange: '1h',
  alerts: [],
  throughput: 0,
  activeSensors: 1248,
  
  toggleSimulator: () => set((state) => ({ isSimulatorRunning: !state.isSimulatorRunning })),
  setSimulatorSpeed: (speed) => set({ simulatorSpeed: speed }),
  setTimeRange: (range) => set({ timeRange: range }),
  
  addAlert: (newAlert) => set((state) => {
    // Deduplicate alerts based on ID
    if (state.alerts.some(a => a.id === newAlert.id)) {
      return state;
    }
    // Keep last 100 alerts
    const newAlerts = [newAlert, ...state.alerts].slice(0, 100);
    return { alerts: newAlerts };
  }),
  
  updateMetrics: (throughput, activeSensors) => set({ throughput, activeSensors }),
  clearAlerts: () => set({ alerts: [] })
}));
