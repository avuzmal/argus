from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import asyncio
from typing import List, Dict

from .websocket.manager import ConnectionManager
from ..ingestion.core.config import settings
from .database import get_db, SensorReading, Alert

app = FastAPI(
    title="Argus API Gateway",
    description="WebSocket gateway and REST API for real-time dashboard updates",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    # Start background task to consume from Kafka/Redis and broadcast
    asyncio.create_task(manager.broadcast_loop())

@app.websocket("/ws/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# REST API Endpoints

@app.get("/api/v1/sensors")
def list_sensors(db: Session = Depends(get_db)):
    # In a real scenario, this would query a sensors metadata table
    # For now, return a mock list of unique sensors
    return [{"id": f"MCH-{i:03d}-TEMP", "type": "temperature", "status": "active"} for i in range(1, 21)]

@app.get("/api/v1/sensors/{sensor_id}")
def get_sensor_details(sensor_id: str, db: Session = Depends(get_db)):
    return {"id": sensor_id, "type": "temperature", "location": "Factory Floor A", "status": "active"}

@app.get("/api/v1/sensors/{sensor_id}/history")
def get_sensor_history(sensor_id: str, limit: int = 100, db: Session = Depends(get_db)):
    readings = db.query(SensorReading).filter(SensorReading.sensor_id == sensor_id).order_by(SensorReading.time.desc()).limit(limit).all()
    return readings

@app.get("/api/v1/alerts")
def list_alerts(limit: int = 50, db: Session = Depends(get_db)):
    try:
        alerts = db.query(Alert).order_by(Alert.time.desc()).limit(limit).all()
        return alerts
    except Exception as e:
        # Fallback if DB not ready (e.g., local dev without docker postgres)
        return []

@app.post("/api/v1/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.acknowledged = True
    db.commit()
    return {"status": "success", "alert_id": alert_id}

@app.get("/api/v1/metrics")
def get_metrics():
    # Return mock Prometheus-style metrics or system health
    return {
        "throughput": manager.current_throughput if hasattr(manager, 'current_throughput') else 12500,
        "active_sensors": 1248,
        "cpu_usage": 45.2,
        "memory_usage": 2.4 # GB
    }

