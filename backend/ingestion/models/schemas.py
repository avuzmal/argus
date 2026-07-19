from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any

class SensorReadingCreate(BaseModel):
    sensor_id: str = Field(..., description="Unique identifier for the sensor")
    sensor_type: str = Field(..., description="Type of the sensor (e.g., TEMP, PRESSURE, VIBRATION)")
    value: float = Field(..., description="The numerical reading from the sensor")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of the reading")
    metadata: Optional[Dict[str, str]] = Field(default=None, description="Optional metadata key-value pairs")

class IngestionResponse(BaseModel):
    message_key: str
    partition: Optional[int]
    offset: Optional[int]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
