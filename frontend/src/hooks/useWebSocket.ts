import { useEffect, useRef, useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const addAlert = useDashboardStore(state => state.addAlert);
  const updateMetrics = useDashboardStore(state => state.updateMetrics);

  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectDelay = 10000;

    const connect = () => {
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          reconnectAttempts = 0;
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'alert') {
              addAlert(data.payload);
            } else if (data.type === 'metrics') {
              updateMetrics(data.payload.throughput, data.payload.activeSensors);
            }
          } catch (e) {
            console.error('Error parsing WS message:', e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), maxReconnectDelay);
          reconnectAttempts++;
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws.close();
        };
      } catch (error) {
        console.error('Failed to establish WebSocket connection:', error);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, addAlert, updateMetrics]);

  return { isConnected };
}
