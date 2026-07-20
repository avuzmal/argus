import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  
  // Settings
  anomalyThreshold: number;
  theme: 'dark' | 'light';
  wsUrl: string;

  toggleSimulator: () => void;
  setSimulatorSpeed: (speed: number) => void;
  setTimeRange: (range: string) => void;
  addAlert: (alert: AlertEvent) => void;
  updateMetrics: (throughput: number, activeSensors: number) => void;
  clearAlerts: () => void;
  
  setAnomalyThreshold: (threshold: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setWsUrl: (url: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      isSimulatorRunning: true,
      simulatorSpeed: 1,
      timeRange: '1h',
      alerts: [],
      throughput: 0,
      activeSensors: 1248,
      
      anomalyThreshold: 0.85,
      theme: 'dark',
      wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001/ws/dashboard',
      
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
      clearAlerts: () => set({ alerts: [] }),
      
      setAnomalyThreshold: (threshold) => set({ anomalyThreshold: threshold }),
      setTheme: (theme) => set({ theme }),
      setWsUrl: (wsUrl) => set({ wsUrl }),
    }),
    {
      name: 'argus-storage',
      partialize: (state) => ({ 
        simulatorSpeed: state.simulatorSpeed, 
        anomalyThreshold: state.anomalyThreshold,
        theme: state.theme,
        wsUrl: state.wsUrl
      }), // Only persist these fields
    }
  )
);
