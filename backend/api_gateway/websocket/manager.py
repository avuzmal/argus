from fastapi import WebSocket
from typing import List
import asyncio
import json
from ...ingestion.core.logging import logger
from confluent_kafka import Consumer, KafkaError
from ...ingestion.core.config import settings

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        
        # Kafka consumer for realtime updates
        conf = {
            'bootstrap.servers': settings.KAFKA_BOOTSTRAP_SERVERS,
            'group.id': 'websocket-gateway-group',
            'auto.offset.reset': 'latest'
        }
        self.consumer = Consumer(conf)
        self.consumer.subscribe(['sensor-readings', 'alert-events'])

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Total: {len(self.active_connections)}")

    async def broadcast_loop(self):
        logger.info("Starting WebSocket broadcast loop from Kafka")
        while True:
            try:
                # Poll Kafka (non-blocking using asyncio.to_thread in a real app, 
                # using small timeout here for simplicity)
                msg = await asyncio.to_thread(self.consumer.poll, 0.1)
                
                if msg is None:
                    await asyncio.sleep(0.01)
                    continue
                if msg.error():
                    if msg.error().code() != KafkaError._PARTITION_EOF:
                        logger.error(f"Kafka error: {msg.error()}")
                    continue
                
                # We assume msg value is JSON for this simplified broadcast
                # In full implementation, deserialize Avro first.
                payload = {
                    "topic": msg.topic(),
                    "data": json.loads(msg.value().decode('utf-8')) if msg.value() else {}
                }
                
                # Broadcast to all connected clients
                if self.active_connections:
                    message_str = json.dumps(payload)
                    for connection in self.active_connections:
                        try:
                            await connection.send_text(message_str)
                        except Exception:
                            self.disconnect(connection)
                            
            except Exception as e:
                logger.error(f"Error in broadcast loop: {e}")
                await asyncio.sleep(1)
