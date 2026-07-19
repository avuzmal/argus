import { useDashboardStore } from '../store/dashboardStore';

let simulatorInterval: NodeJS.Timeout | null = null;
let currentThroughput = 12000;

export const startDemoSimulator = () => {
  if (simulatorInterval) return;

  const { addAlert, updateMetrics, simulatorSpeed } = useDashboardStore.getState();

  simulatorInterval = setInterval(() => {
    const state = useDashboardStore.getState();
    if (!state.isSimulatorRunning) return;

    // Simulate metrics fluctuation
    currentThroughput = Math.max(8000, currentThroughput + (Math.random() * 1000 - 500));
    updateMetrics(Math.floor(currentThroughput), 1248);

    // Simulate random anomaly injection
    if (Math.random() < 0.05 * state.simulatorSpeed) {
      const id = `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      addAlert({
        id,
        time: new Date().toISOString(),
        sensor_id: `MCH-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}-TEMP`,
        severity: Math.random() > 0.8 ? 'critical' : 'high',
        message: 'Temperature Spike Detected',
        score: 0.8 + (Math.random() * 0.2)
      });
    }
  }, 2000 / useDashboardStore.getState().simulatorSpeed);
};

export const stopDemoSimulator = () => {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
  }
};
