from fastapi import APIRouter, Depends, HTTPException, Header, status, BackgroundTasks
import time
import uuid
from datetime import datetime

from ...models.schemas import SensorReadingCreate, IngestionResponse
from ...services.kafka_producer import kafka_producer
from ...services.schema_registry import schema_registry
from ...services.rate_limiter import api_key_rate_limiter
from ...core.config import settings
from ...core.logging import logger
from prometheus_client import Counter, Histogram

router = APIRouter()

# Prometheus metrics
INGESTION_COUNTER = Counter(
    'argus_ingestion_total',
    'Total number of ingested messages',
    ['sensor_type', 'status']
)

INGESTION_LATENCY = Histogram(
    'argus_ingestion_latency_seconds',
    'Ingestion latency',
    ['sensor_type'],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0]
)

async def validate_api_key(x_api_key: str = Header(..., alias=settings.API_KEY_HEADER)):
    if x_api_key not in settings.VALID_API_KEYS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key"
        )
    await api_key_rate_limiter.check_rate_limit(x_api_key)
    return x_api_key

@router.post("/sensor", 
             status_code=status.HTTP_201_CREATED,
             response_model=IngestionResponse,
             summary="Ingest sensor reading",
             description="Accepts sensor data, validates against Avro schema, and produces to Kafka")
async def ingest_sensor_reading(
    reading: SensorReadingCreate,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(validate_api_key)
) -> IngestionResponse:
    
    start_time = time.time()
    
    # 1. Validate and serialize with Avro schema
    try:
        avro_bytes = await schema_registry.encode(
            subject="sensor-reading",
            record=reading.model_dump(mode='json')
        )
    except Exception as e:
        INGESTION_COUNTER.labels(sensor_type=reading.sensor_type, status="schema_error").inc()
        raise HTTPException(
            status_code=422,
            detail=f"Schema validation failed: {str(e)}"
        )
        
    # 2. Produce to Kafka
    message_key = f"{reading.sensor_id}:{reading.timestamp.isoformat()}"
    
    try:
        delivery = await kafka_producer.send_and_wait(
            topic="sensor-readings",
            key=message_key.encode(),
            value=avro_bytes,
            headers=[
                ("content-type", b"application/avro"),
                ("source", b"fastapi-ingestion"),
                ("trace-id", str(uuid.uuid4()).encode())
            ]
        )
        
        # Increment Prometheus metrics
        INGESTION_COUNTER.labels(
            sensor_type=reading.sensor_type,
            status="success"
        ).inc()
        
        INGESTION_LATENCY.labels(
            sensor_type=reading.sensor_type
        ).observe(time.time() - start_time)
        
        return IngestionResponse(
            message_key=message_key,
            partition=delivery.partition(),
            offset=delivery.offset(),
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Kafka production failed: {e}")
        INGESTION_COUNTER.labels(sensor_type=reading.sensor_type, status="kafka_error").inc()
        raise HTTPException(
            status_code=503,
            detail="Message broker unavailable"
        )
