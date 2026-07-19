from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from .websocket.manager import ConnectionManager
from ..ingestion.core.config import settings

app = FastAPI(
    title="Argus API Gateway",
    description="WebSocket gateway for real-time dashboard updates",
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
            # Handle client messages if any
    except WebSocketDisconnect:
        manager.disconnect(websocket)
