# Argus 👁️ 
**The All-Seeing Eye of Real-Time Data Intelligence**

Argus is an enterprise-grade, real-time data pipeline orchestrator designed for manufacturing and IoT edge environments (like Nexus Manufacturing). It combines sub-millisecond stream processing with real-time machine learning (Isolation Forest / LSTM) to detect anomalies in high-throughput sensor data.

![Argus Dashboard](https://raw.githubusercontent.com/avuzmal/argus/main/docs/dashboard.png)

## 🚀 Live Demo
**[https://argus.vercel.app](https://argus-mauve.vercel.app)** *(Auto-deploying via Vercel)*

## 🏗️ Architecture

1. **Ingestion (FastAPI)**: Receives high-throughput sensor telemetry. Enforces Avro schema validation and rate-limiting via Redis.
2. **Message Broker (Kafka KRaft)**: Buffers messages for robust, distributed processing.
3. **Stream Processing (Bytewax)**: Stateful stream processing engine that evaluates data points against pre-trained scikit-learn/TensorFlow models in real-time.
4. **Historical Storage (TimescaleDB / PostgreSQL)**: Efficiently stores time-series data for historical analytics.
5. **Real-time Gateway (FastAPI WebSockets)**: Broadcasts detected anomalies directly to the connected web clients.
6. **Frontend Dashboard (Next.js 14 App Router)**: A glassmorphism, highly responsive dashboard using D3.js and ECharts for high-performance streaming visualizations.

## ✨ Features
- **Real-Time Data Streaming:** Live charts powered by D3.js pushing 60fps with WebGL/Canvas fallbacks via ECharts.
- **Machine Learning Integration:** On-the-fly anomaly detection scoring.
- **Demo Simulator Mode:** Client-side fallback data generation for seamless presentation when the backend is disconnected.
- **Responsive Layout:** Sidebar navigation, responsive data grid, and floating glass-pane components.
- **Enterprise Controls:** Simulator controls, time range picker, JSON/PNG export capabilities.

## 🛠️ Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (Poetry)
- Node.js 20+

### Run the Pipeline
We have provided an automated PowerShell orchestrator to launch all microservices in separate windows for easy log monitoring.

```bash
git clone https://github.com/avuzmal/argus.git
cd argus

# Launch the entire stack (Infrastructure, Frontend, APIs, Stream Processors)
.\start-argus.ps1
```

Or run services manually:
1. `docker-compose up -d`
2. `cd backend && poetry install && poetry run uvicorn api_gateway.main:app --port 8001`
3. `cd frontend && npm install && npm run dev`

## 📡 API Documentation

### REST Endpoints (API Gateway - Port 8001)
- `GET /api/v1/sensors` - List all monitored sensors.
- `GET /api/v1/sensors/{id}/history` - Retrieve historical time-series data.
- `GET /api/v1/alerts` - List recent anomalies.
- `GET /api/v1/metrics` - Retrieve Prometheus-compatible system metrics.

### WebSocket 
- `ws://localhost:8001/ws/dashboard` - Subscribe to the live feed of anomalies and system throughput.

## 🤝 Contributing
Please read `CONTRIBUTING.md` for guidelines on submitting pull requests.

## 📄 License
MIT License
